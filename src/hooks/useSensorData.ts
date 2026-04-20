import { onValue, ref } from 'firebase/database';
import { useEffect, useMemo, useState } from 'react';
import { db } from '../constants/firebaseConfig';

export type SensorStatus = 'occupied' | 'free' | 'offline';

export interface SensorReading {
  id: string;
  name: string;
  location: string;
  status: SensorStatus;
  vibration: number; 
  timestamp: number;
  timeLeft?: number;
}

export interface ConnectionState {
  connected: boolean;
  lastUpdated: number | null;
  error?: string | null;
}

// Configuration Constants
const OFFLINE_TIMEOUT_MS = 15000; // 15 seconds (adjust based on ESP32 send frequency)
const VIBRATION_THRESHOLD = 0.5;   // Ignore noise below this value

/**
 * Interface for the raw data structure coming from Firebase
 */
interface FirebaseMachineData {
  status?: string;
  vibration: number;
  lastUpdate: number;
  location?: string;
  timeLeft?: number;
}

interface FirebaseSnapshot {
  [key: string]: FirebaseMachineData;
}

export function useSensorData() {
  const [sensors, setSensors] = useState<SensorReading[]>([]);
  const [connection, setConnection] = useState<ConnectionState>({
    connected: false,
    lastUpdated: null,
    error: null
  });

  // We store the raw Firebase data and a local timestamp.
  // This allows us to detect timeouts even when Firebase doesn't send new events.
  const [rawMachines, setRawMachines] = useState<FirebaseSnapshot | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    // Listen to the 'machines' node in your Firebase Realtime DB
    const machinesRef = ref(db, 'machines');

    const unsubscribe = onValue(machinesRef, (snapshot) => {
      const data = snapshot.val() as FirebaseSnapshot | null;
      setRawMachines(data);
      setConnection({ connected: true, lastUpdated: now, error: null });
    }, (error) => {
      console.error("Firebase Read Error:", error);
      setConnection(prev => ({ ...prev, connected: false, error: error.message }));
    });

    // This timer runs every 5 seconds to force the UI to check for timed-out sensors
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  // Derive the sensor array whenever the DB data OR our local clock changes
  const sensorsList = useMemo(() => {
    if (!rawMachines) return [];

    return Object.keys(rawMachines).map((key) => {
      const machine = rawMachines[key];
      const isDemo = key.replace(/\s/g, '').toLowerCase() === 'washer1';
      
      let lastSeen = machine.lastUpdate;
      if (lastSeen && lastSeen < 10000000000) lastSeen *= 1000;

      const isOffline = !isDemo && (
        machine.status === 'OFFLINE' || 
        !lastSeen || 
        (now - lastSeen > OFFLINE_TIMEOUT_MS)
      );

      const status: SensorStatus = isOffline ? 'offline' : 
        (machine.vibration > VIBRATION_THRESHOLD ? 'occupied' : 'free');

      return {
        id: key,
        name: isDemo ? 'Washing Demo' : key.charAt(0).toUpperCase() + key.slice(1).replace(/(\d+)/, ' $1'),
        location: isDemo ? 'Demo' : (machine.location || 'UTK Dorm'),
        status,
        vibration: isOffline ? 0 : (machine.vibration || 0),
        timestamp: now,
        timeLeft: machine.timeLeft || 0,
      };
    });
  }, [rawMachines, now]);

  // Update the sensors state whenever our derived list changes
  useEffect(() => {
    setSensors(sensorsList);
  }, [sensorsList]);

  const stats = {
    total: sensors.length,
    free: sensors.filter(s => s.status === 'free').length,
    occupied: sensors.filter(s => s.status === 'occupied').length,
    offline: sensors.filter(s => s.status === 'offline').length,
  };

  return { sensors, stats, connection };
}