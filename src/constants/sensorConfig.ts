import { SensorReading } from '../hooks/useSensorData';

export const SENSOR_CONFIG = {
  RECONNECT_INTERVAL: 3000,

  THRESHOLDS: {
    OFFLINE_TIMEOUT_MS: 15000,
    CURRENT_ACTIVE_AMPS: 0.1,
    HIGH_OCCUPANCY_PERCENT: 80,
  },

  LOCATIONS: ['Demo'],

  APP_NAME: 'Sensor',
  REFRESH_LABEL: 'Live',

  MOCK_SENSORS: [] as SensorReading[],

  COLORS: {
    occupied: '#FF453A',
    free: '#30D158',
    offline: '#636366',
    accent: '#FF8200',
    warning: '#FFD60A',
    smokey: '#58595B',
  },
};
