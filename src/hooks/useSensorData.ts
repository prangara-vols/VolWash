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

const OFFLINE_TIMEOUT_MS = 15000; // 15 sec

interface FirebaseMachineData {
  status?: string;
  vibration?: number;
  lastUpdate?: number;
  location?: string;
  timeLeft?: number;
}

export function useSensorData() {
  const [sensor, setSensor] = useState<SensorReading | null>(null);
  const [connection, setConnection] = useState<ConnectionState>({
    connected: false,
    lastUpdated: null,
    error: null
  });
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    // Only listen to the demo machine
    const washerRef = ref(db, 'machines/washer1');

    const unsubscribe = onValue(
      washerRef,
      (snapshot) => {
        const machine = snapshot.val() as FirebaseMachineData | null;
        const currentTime = Date.now();

        if (!machine) {
          setSensor(null);
          setConnection({
            connected: false,
            lastUpdated: null,
            error: 'No demo machine data found'
          });
          return;
        }

        let lastSeen = machine.lastUpdate ?? currentTime;

        // If timestamp came in seconds instead of ms, convert it
        if (lastSeen < 10000000000) {
          lastSeen *= 1000;
        }

        const isOffline = !lastSeen || (currentTime - lastSeen > OFFLINE_TIMEOUT_MS);

        let status: SensorStatus = 'free';

        if (isOffline) {
          status = 'offline';
        } else if (machine.status === 'IN USE' || (machine.vibration ?? 0) >= 1) {
          status = 'occupied';
        } else {
          status = 'free';
        }

        setSensor({
          id: 'washer1',
          name: 'Washing Demo',
          location: 'Demo',
          status,
          vibration: isOffline ? 0 : (machine.vibration ?? (machine.status === 'IN USE' ? 1 : 0)),
          timestamp: lastSeen,
          timeLeft: machine.timeLeft
        });

        setConnection({
          connected: true,
          lastUpdated: currentTime,
          error: null
        });
      },
      (error) => {
        console.error('Firebase Read Error:', error);
        setConnection({
          connected: false,
          lastUpdated: null,
          error: error.message
        });
      }
    );

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const sensors = useMemo(() => {
    if (!sensor) return [];

    const isOffline = now - sensor.timestamp > OFFLINE_TIMEOUT_MS;

    if (!isOffline) return [sensor];

    return [
      {
        ...sensor,
        status: 'offline',
        vibration: 0
      }
    ];
  }, [sensor, now]);

  const stats = {
    total: sensors.length,
    free: sensors.filter((s) => s.status === 'free').length,
    occupied: sensors.filter((s) => s.status === 'occupied').length,
    offline: sensors.filter((s) => s.status === 'offline').length,
  };

  return { sensors, stats, connection };
}
