// ============================================================
//  SensorCard.tsx  —  Individual sensor tile
// ============================================================
//
//  Displays one sensor's status, name, location, and readings.
//  Used in the Dashboard screen in a scrollable grid.
//
//  WHAT TO CHANGE:
//  • The fields shown inside the card (vibration, current, etc.)
//  • Card size — adjust CARD_WIDTH and cardStyles
//  • Add a tap handler (onPress) to open a sensor detail screen
// ============================================================

import React from 'react';
import { SENSOR_CONFIG } from '../constants/sensorConfig';
import { SensorReading, SensorStatus } from '../hooks/useSensorData';

interface Props {
  sensor: SensorReading;
  isDarkMode?: boolean;
  // Optional: pass an onPress to navigate to a detail screen
  onPress?: (sensor: SensorReading) => void;
}

// ----------------------------------------------------------
//  Status label and colour — driven by SENSOR_CONFIG.COLORS
//  Change the colours there, not here
// ----------------------------------------------------------
const STATUS_LABELS: Record<SensorStatus, string> = {
  occupied: 'Occupied',
  free:     'Free',
  offline:  'Offline',
};

const STATUS_COLORS: Record<SensorStatus, string> = {
  occupied: SENSOR_CONFIG.COLORS.occupied,
  free:     SENSOR_CONFIG.COLORS.free,
  offline:  SENSOR_CONFIG.COLORS.offline,
};

export default function SensorCard({ sensor, isDarkMode = true, onPress }: Props) {
  const statusColor = STATUS_COLORS[sensor.status];
  const isOffline = sensor.status === 'offline';

  // Format how long ago this sensor last reported
  const lastSeenSeconds = Math.round((Date.now() - sensor.timestamp) / 1000);
  const lastSeenLabel =
    lastSeenSeconds < 5
      ? 'Just now'
      : lastSeenSeconds < 60
      ? `${lastSeenSeconds}s ago`
      : `${Math.round(lastSeenSeconds / 60)}m ago`;

  return (
    <div 
      onClick={() => onPress?.(sensor)}
      style={{
        ...styles.card,
        backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
        ...(isOffline ? styles.cardOffline : {}),
        cursor: onPress ? 'pointer' : 'default'
      }}
    >
      {/* ---- Top row: name + status badge ---- */}
      <div style={styles.topRow}>
        <span style={{ ...styles.sensorName, color: isDarkMode ? '#FFFFFF' : '#000000' }}>
          {sensor.name}
        </span>

        {/* Status pill — colour changes with status */}
        <div style={{ ...styles.statusBadge, backgroundColor: statusColor + '22' }}>
          <div style={{ ...styles.statusDot, backgroundColor: statusColor }} />
          <span style={{ ...styles.statusText, color: statusColor }}>
            {STATUS_LABELS[sensor.status]}
          </span>
        </div>
      </div>

      {/* ---- Location label ---- */}
      <div style={{ ...styles.location, color: isDarkMode ? '#8E8E93' : '#636366' }}>{sensor.location}</div>

      {/* ---- Time Remaining (OG Logic) ---- */}
      {sensor.status === 'occupied' && sensor.timeLeft !== undefined && (
        <div style={{ ...styles.timerText, color: statusColor }}>
          {sensor.timeLeft} min remaining
        </div>
      )}

      {/* ---- Sensor readings ---- */}
      {!isOffline && (
        <div style={{ ...styles.readingsRow, backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7' }}>
          <div style={styles.reading}>
            <div style={{ ...styles.readingLabel, color: isDarkMode ? '#8E8E93' : '#636366' }}>Vibration</div>
            <div style={{ ...styles.readingValue, color: isDarkMode ? '#FFFFFF' : '#000000' }}>
              {sensor.vibration === 1 ? 'Active' : 'None'}
            </div>
          </div>
        </div>
      )}

      {/* ---- Footer: last updated time ---- */}
      <div style={styles.lastSeen}>
        {isOffline ? '⚠ Sensor offline' : `Updated ${lastSeenLabel}`}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '12px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    transition: 'opacity 0.2s',
  },
  cardOffline: {
    opacity: 0.6,
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  sensorName: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#FFFFFF',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
    marginRight: '8px',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '20px',
    gap: '4px',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
  statusText: {
    fontSize: '11px',
    fontWeight: 600,
  },
  location: {
    fontSize: '12px',
    color: '#8E8E93',
    fontWeight: 300,
    marginBottom: '12px',
  },
  timerText: {
    fontSize: '15px',
    fontWeight: 700,
    marginBottom: '10px',
  },
  readingsRow: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: '10px',
    padding: '10px',
    marginBottom: '10px',
  },
  reading: {
    flex: 1,
    textAlign: 'center',
  },
  readingDivider: {
    width: '1px',
    height: '28px',
    backgroundColor: '#3A3A3C',
  },
  readingLabel: {
    fontSize: '10px',
    color: '#8E8E93',
    marginBottom: '2px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: 300,
  },
  readingValue: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#FFFFFF',
  },
};
