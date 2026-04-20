// ============================================================
//  app/map.tsx  —  Map screen (web + mobile compatible)
// ============================================================
//
//  react-native-maps only works on a real phone/emulator.
//  This version shows a sensor list on web browser preview
//  and the real map when running on a phone.
//
//  WHAT TO CHANGE:
//  • SENSOR_COORDS — add real GPS coordinates for each sensor
//  • INITIAL_REGION — set to your building's location
// ============================================================

import React from 'react';
import { SENSOR_CONFIG } from '../constants/sensorConfig';
import { SensorReading, useSensorData } from '../hooks/useSensorData';

const PIN_COLORS: Record<string, string> = {
  occupied: SENSOR_CONFIG.COLORS.occupied,
  free:     SENSOR_CONFIG.COLORS.free,
  offline:  SENSOR_CONFIG.COLORS.offline,
};

export default function MapScreen({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const { sensors, stats } = useSensorData();

  return (
    <div style={{ ...styles.safe, backgroundColor: isDarkMode ? '#000000' : '#F2F2F7' }}>
      <div style={styles.header}>
        <h1 style={{ ...styles.title, color: isDarkMode ? '#FFFFFF' : '#000000' }}>Map</h1>
        <p style={{ ...styles.subtitle, color: isDarkMode ? '#8E8E93' : '#636366' }}>{stats.free} of {stats.total} available</p>
      </div>

      <div style={styles.webContent}>
        <div style={{ ...styles.webNotice, backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }}>
          <div style={{ ...styles.webNoticeTitle, color: isDarkMode ? '#FFFFFF' : '#000000' }}>Map View</div>
          <p style={{ ...styles.webNoticeText, color: isDarkMode ? '#8E8E93' : '#636366' }}>
            Interactive map is coming soon. Showing sensor locations below:
          </p>
        </div>
        {sensors.map((sensor: SensorReading) => (
          <div key={sensor.id} style={{ ...styles.locationRow, backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }}>
            <div style={{ ...styles.statusDot, backgroundColor: PIN_COLORS[sensor.status] ?? '#636366' }} />
            <div style={styles.locationInfo}>
              <div style={{ ...styles.locationName, color: isDarkMode ? '#FFFFFF' : '#000000' }}>{sensor.name}</div>
              <div style={{ ...styles.locationSub, color: isDarkMode ? '#8E8E93' : '#636366' }}>{sensor.location}</div>
            </div>
            <div style={{ ...styles.locationStatus, color: PIN_COLORS[sensor.status] ?? '#636366' }}>
              {sensor.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  safe: { 
    minHeight: '100vh',
    backgroundColor: '#000000' 
  },
  header: { 
    padding: '16px', 
    paddingBottom: '10px' 
  },
  title: { 
    fontSize: '34px', 
    fontWeight: 700, 
    color: '#FFFFFF', 
    letterSpacing: '-0.5px',
    margin: 0
  },
  subtitle: { 
    fontSize: '14px', 
    color: '#8E8E93', 
    marginTop: '2px' 
  },
  webContent: { 
    padding: '16px', 
    paddingBottom: '32px' 
  },
  webNotice: { backgroundColor: '#1C1C1E', borderRadius: '12px', padding: '16px', marginBottom: '16px', textAlign: 'center' },
  webNoticeTitle: { fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginBottom: '6px' },
  webNoticeText: { fontSize: '13px', color: '#8E8E93', lineHeight: '20px' },
  locationRow: { display: 'flex', alignItems: 'center', backgroundColor: '#1C1C1E', borderRadius: '12px', padding: '14px', marginBottom: '8px', gap: '12px' },
  statusDot: { width: '10px', height: '10px', borderRadius: '50%', minWidth: '10px' },
  locationInfo: { flex: 1 },
  locationName: { fontSize: '14px', fontWeight: 600, color: '#FFFFFF' },
  locationSub: { fontSize: '12px', color: '#8E8E93', marginTop: '2px' },
  locationStatus: { fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' },
};
