import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
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

export function useSensorData() {
  const [sensors, setSensors] = useState<SensorReading[]>([]);
  const [connection, setConnection] = useState<ConnectionState>({
    connected: false,
    lastUpdated: null,
    error: null
  });

  useEffect(() => {
    // Listen to the 'machines' node in your Firebase Realtime DB
    const machinesRef = ref(db, 'machines');

    const unsubscribe = onValue(machinesRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setSensors([]);
        setConnection(prev => ({ ...prev, connected: true, lastUpdated: Date.now() }));
        return;
      }

      const now = Date.now();

      // Transform Firebase object into our App's array format
      const mappedSensors: SensorReading[] = Object.keys(data).map((key) => {
        const machine = data[key];
        
        const isDemo = key.replace(/\s/g, '').toLowerCase() === 'washer1';
        
        // Offline detection logic: 
        // If the ESP32 is unplugged, it won't update the heartbeat (lastUpdate).
        // We consider it offline if the heartbeat is missing or older than 60 seconds.
        const OFFLINE_TIMEOUT_MS = 60000;
        let lastSeen = machine.lastUpdate;
        
        // Normalize: Many ESP32 libraries send Unix seconds; JS expects milliseconds.
        if (lastSeen && lastSeen < 10000000000) lastSeen *= 1000;

        const isOffline = !isDemo && (
          machine.status === 'OFFLINE' || 
          !lastSeen || 
          (now - lastSeen > OFFLINE_TIMEOUT_MS)
        );

        const status: SensorStatus = isOffline ? 'offline' : 
          (machine.vibration > 0 ? 'occupied' : 'free');

        return {
          id: key,
          name: isDemo ? 'Washing Demo' : key.charAt(0).toUpperCase() + key.slice(1).replace(/(\d+)/, ' $1'),
          location: isDemo ? 'Demo' : (machine.location || 'UTK Dorm'),
          status,
          vibration: machine.vibration || 0,
          timestamp: now,
          timeLeft: machine.timeLeft || 0,
        };
      });

      setSensors(mappedSensors);
      setConnection({ connected: true, lastUpdated: now, error: null });
    }, (error) => {
      console.error("Firebase Read Error:", error);
      setConnection(prev => ({ ...prev, connected: false, error: error.message }));
    });

    return () => unsubscribe();
  }, []);

  const stats = {
    total: sensors.length,
    free: sensors.filter(s => s.status === 'free').length,
    occupied: sensors.filter(s => s.status === 'occupied').length,
    offline: sensors.filter(s => s.status === 'offline').length,
  };

  return { sensors, stats, connection };
}