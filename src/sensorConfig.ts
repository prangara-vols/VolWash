// ============================================================
//  sensorConfig.ts  —  All settings in one place
// ============================================================
//
//  This is the main config file. Change values here to
//  customise the app without digging through screen files.
//
//  QUICK SETUP CHECKLIST:
//  1. Set WS_URL to your ESP32's local IP address
//  2. Edit LOCATIONS to match your building layout
//  3. Adjust THRESHOLDS to tune alert sensitivity
//  4. Replace MOCK_SENSORS with real ones once ESP32 is live
// ============================================================

import { SensorReading } from './hooks/useSensorData';

export const SENSOR_CONFIG = {

  // ----------------------------------------------------------
  //  WebSocket connection
  //  Format: ws://<ESP32_IP_ADDRESS>:<PORT>
  //  Find the ESP32's IP in your router's device list, or
  //  print it over Serial in the Arduino sketch with:
  //    Serial.println(WiFi.localIP());
  // ----------------------------------------------------------
  WS_URL: 'ws://192.168.1.100:81',

  // How many milliseconds to wait before trying to reconnect
  // after a lost connection. 3000 = 3 seconds.
  RECONNECT_INTERVAL: 3000,

  // ----------------------------------------------------------
  //  Alert thresholds
  //  Adjust these to change when the app shows warnings
  // ----------------------------------------------------------
  THRESHOLDS: {
    // If a sensor hasn't sent data in this many ms, mark it offline
    OFFLINE_TIMEOUT_MS: 15000,       // 15 seconds

    // ACS712 current (amps) above this = equipment is on/in use
    CURRENT_ACTIVE_AMPS: 0.1,

    // Occupancy % above this = show "high occupancy" warning
    HIGH_OCCUPANCY_PERCENT: 80,
  },

  // ----------------------------------------------------------
  //  Locations / zones shown on the map tab
  //  Add or rename to match your actual floor plan
  // ----------------------------------------------------------
  LOCATIONS: [
    'Poplar',
    'Geier',
    'Beacon',
    'Hess',
    'Clement',
    'Magnolia',
    'Dogwood',
    'Robinson',
    'Reese',
    'Stokely',
  ],

  // ----------------------------------------------------------
  //  App display settings
  // ----------------------------------------------------------
  APP_NAME: 'Sensor',              // shown in headers
  REFRESH_LABEL: 'Live',           // label next to the live indicator dot

  // ----------------------------------------------------------
  //  Mock data — used when ESP32 is not connected
  //  Remove these or set to [] once your hardware is running.
  //  Each object must match the SensorReading type in useSensorData.ts
  // ----------------------------------------------------------
  MOCK_SENSORS: [
  // ── Demo Dorm ───────────────────────────────────────────
  { id: 'demo-1', name: 'Washing Demo', location: 'Demo', status: 'occupied', vibration: 1, timestamp: Date.now(), timeLeft: 15 },

  // ── Poplar ──────────────────────────────────────────────
  { id: 'poplar-w1', name: 'Washer 1', location: 'Poplar', status: 'occupied', vibration: 1, timestamp: Date.now() },
  { id: 'poplar-w2', name: 'Washer 2', location: 'Poplar', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'poplar-w3', name: 'Washer 3', location: 'Poplar', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'poplar-d1', name: 'Dryer 1',  location: 'Poplar', status: 'occupied', vibration: 1, timestamp: Date.now() },
  { id: 'poplar-d2', name: 'Dryer 2',  location: 'Poplar', status: 'occupied', vibration: 1, timestamp: Date.now() },
  { id: 'poplar-d3', name: 'Dryer 3',  location: 'Poplar', status: 'free',     vibration: 0, timestamp: Date.now() },

  // ── Geier ───────────────────────────────────────────────
  { id: 'geier-w1', name: 'Washer 1', location: 'Geier', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'geier-w2', name: 'Washer 2', location: 'Geier', status: 'occupied', vibration: 1, timestamp: Date.now() },
  { id: 'geier-w3', name: 'Washer 3', location: 'Geier', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'geier-d1', name: 'Dryer 1',  location: 'Geier', status: 'occupied', vibration: 1, timestamp: Date.now() },
  { id: 'geier-d2', name: 'Dryer 2',  location: 'Geier', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'geier-d3', name: 'Dryer 3',  location: 'Geier', status: 'free',     vibration: 0, timestamp: Date.now() },

  // ── Beacon ──────────────────────────────────────────────
  { id: 'beacon-w1', name: 'Washer 1', location: 'Beacon', status: 'occupied', vibration: 1, timestamp: Date.now() },
  { id: 'beacon-w2', name: 'Washer 2', location: 'Beacon', status: 'occupied', vibration: 1, timestamp: Date.now() },
  { id: 'beacon-w3', name: 'Washer 3', location: 'Beacon', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'beacon-d1', name: 'Dryer 1',  location: 'Beacon', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'beacon-d2', name: 'Dryer 2',  location: 'Beacon', status: 'occupied', vibration: 1, timestamp: Date.now() },
  { id: 'beacon-d3', name: 'Dryer 3',  location: 'Beacon', status: 'offline',  vibration: 0, timestamp: Date.now() - 30000 },

  // ── Hess ────────────────────────────────────────────────
  { id: 'hess-w1', name: 'Washer 1', location: 'Hess', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'hess-w2', name: 'Washer 2', location: 'Hess', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'hess-w3', name: 'Washer 3', location: 'Hess', status: 'occupied', vibration: 1, timestamp: Date.now() },
  { id: 'hess-d1', name: 'Dryer 1',  location: 'Hess', status: 'occupied', vibration: 1, timestamp: Date.now() },
  { id: 'hess-d2', name: 'Dryer 2',  location: 'Hess', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'hess-d3', name: 'Dryer 3',  location: 'Hess', status: 'free',     vibration: 0, timestamp: Date.now() },

  // ── Clement ─────────────────────────────────────────────
  { id: 'clement-w1', name: 'Washer 1', location: 'Clement', status: 'occupied', vibration: 1, timestamp: Date.now() },
  { id: 'clement-w2', name: 'Washer 2', location: 'Clement', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'clement-w3', name: 'Washer 3', location: 'Clement', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'clement-d1', name: 'Dryer 1',  location: 'Clement', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'clement-d2', name: 'Dryer 2',  location: 'Clement', status: 'occupied', vibration: 1, timestamp: Date.now() },
  { id: 'clement-d3', name: 'Dryer 3',  location: 'Clement', status: 'occupied', vibration: 1, timestamp: Date.now() },

  // ── Magnolia ────────────────────────────────────────────
  { id: 'magnolia-w1', name: 'Washer 1', location: 'Magnolia', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'magnolia-w2', name: 'Washer 2', location: 'Magnolia', status: 'occupied', vibration: 1, timestamp: Date.now() },
  { id: 'magnolia-w3', name: 'Washer 3', location: 'Magnolia', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'magnolia-d1', name: 'Dryer 1',  location: 'Magnolia', status: 'occupied', vibration: 1, timestamp: Date.now() },
  { id: 'magnolia-d2', name: 'Dryer 2',  location: 'Magnolia', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'magnolia-d3', name: 'Dryer 3',  location: 'Magnolia', status: 'offline',  vibration: 0, timestamp: Date.now() - 30000 },

  // ── Dogwood ─────────────────────────────────────────────
  { id: 'dogwood-w1', name: 'Washer 1', location: 'Dogwood', status: 'occupied', vibration: 1, timestamp: Date.now() },
  { id: 'dogwood-w2', name: 'Washer 2', location: 'Dogwood', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'dogwood-w3', name: 'Washer 3', location: 'Dogwood', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'dogwood-d1', name: 'Dryer 1',  location: 'Dogwood', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'dogwood-d2', name: 'Dryer 2',  location: 'Dogwood', status: 'occupied', vibration: 1, timestamp: Date.now() },
  { id: 'dogwood-d3', name: 'Dryer 3',  location: 'Dogwood', status: 'occupied', vibration: 1, timestamp: Date.now() },

  // ── Robinson ────────────────────────────────────────────
  { id: 'robinson-w1', name: 'Washer 1', location: 'Robinson', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'robinson-w2', name: 'Washer 2', location: 'Robinson', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'robinson-w3', name: 'Washer 3', location: 'Robinson', status: 'occupied', vibration: 1, timestamp: Date.now() },
  { id: 'robinson-d1', name: 'Dryer 1',  location: 'Robinson', status: 'occupied', vibration: 1, timestamp: Date.now() },
  { id: 'robinson-d2', name: 'Dryer 2',  location: 'Robinson', status: 'occupied', vibration: 1, timestamp: Date.now() },
  { id: 'robinson-d3', name: 'Dryer 3',  location: 'Robinson', status: 'free',     vibration: 0, timestamp: Date.now() },

  // ── Reese ───────────────────────────────────────────────
  { id: 'reese-w1', name: 'Washer 1', location: 'Reese', status: 'occupied', vibration: 1, timestamp: Date.now() },
  { id: 'reese-w2', name: 'Washer 2', location: 'Reese', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'reese-w3', name: 'Washer 3', location: 'Reese', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'reese-d1', name: 'Dryer 1',  location: 'Reese', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'reese-d2', name: 'Dryer 2',  location: 'Reese', status: 'occupied', vibration: 1, timestamp: Date.now() },
  { id: 'reese-d3', name: 'Dryer 3',  location: 'Reese', status: 'offline',  vibration: 0, timestamp: Date.now() - 30000 },

  // ── Stokely ─────────────────────────────────────────────
  { id: 'stokely-w1', name: 'Washer 1', location: 'Stokely', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'stokely-w2', name: 'Washer 2', location: 'Stokely', status: 'occupied', vibration: 1, timestamp: Date.now() },
  { id: 'stokely-w3', name: 'Washer 3', location: 'Stokely', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'stokely-d1', name: 'Dryer 1',  location: 'Stokely', status: 'occupied', vibration: 1, timestamp: Date.now() },
  { id: 'stokely-d2', name: 'Dryer 2',  location: 'Stokely', status: 'free',     vibration: 0, timestamp: Date.now() },
  { id: 'stokely-d3', name: 'Dryer 3',  location: 'Stokely', status: 'occupied', vibration: 1, timestamp: Date.now() },
] as SensorReading[],

  // ----------------------------------------------------------
  //  Colours used across the app
  //  Change these to retheme everything at once
  // ----------------------------------------------------------
  COLORS: {
    occupied:  '#FF453A',   // red  — space is in use
    free:      '#30D158',   // green — space is available
    offline:   '#636366',   // grey  — sensor not responding
    accent:    '#FF8200',   // blue  — primary interactive colour
    warning:   '#ffd500',   // amber — high occupancy warning
  },
};
