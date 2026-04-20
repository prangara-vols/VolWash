// ============================================================
//  ConnectionBanner.tsx  —  Live / disconnected status bar
// ============================================================
//
//  Shows a green "Live" banner when connected to the ESP32,
//  or an amber "Reconnecting..." banner when the connection
//  drops. Sits at the top of the dashboard screen.
//
//  WHAT TO CHANGE:
//  • Banner colours — edit styles.connected / styles.disconnected
//  • The message text — edit the strings in the return block
//  • Hide it entirely — just don't render <ConnectionBanner /> in index.tsx
// ============================================================

import React, { useEffect, useState } from 'react';
import { SENSOR_CONFIG } from '../constants/sensorConfig';
import { ConnectionState } from '../hooks/useSensorData';

export interface ConnectionBannerProps {
  connection: ConnectionState;
  isDarkMode?: boolean;
}

export default function ConnectionBanner({ connection, isDarkMode = true }: ConnectionBannerProps) {
  const [now, setNow] = useState(Date.now());

  // Keep the "seconds ago" timer ticking every second so it stays fresh
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format the "last updated X seconds ago" label
  const lastUpdated = connection.lastUpdated;
  const lastUpdatedLabel = lastUpdated
    ? `Last update ${Math.round((now - (typeof lastUpdated === 'number' ? lastUpdated : new Date(lastUpdated).getTime())) / 1000)}s ago`
    : 'Waiting for data...';

  return (
    <div style={{ ...styles.banner, ...(connection.connected ? styles.connected : styles.disconnected) }}>
      <div style={styles.leftRow}>
        {/* Pulsing dot */}
        <div
          style={{
            ...styles.dot,
            backgroundColor: connection.connected ? SENSOR_CONFIG.COLORS.free : SENSOR_CONFIG.COLORS.warning,
            animation: connection.connected ? 'pulse 1.4s infinite' : 'none'
          }}
        />
        {/* Status text */}
        <span style={{ ...styles.statusText, color: isDarkMode ? '#EBEBF5CC' : '#636366' }}>
          {connection.connected
            ? `${SENSOR_CONFIG.REFRESH_LABEL} · ${lastUpdatedLabel}`
            : connection.error ?? 'Reconnecting to ESP32...'}
        </span>
      </div>

      {/* Show the WebSocket URL so it's easy to debug */}
      {!connection.connected && (
        <span style={styles.urlText}>{SENSOR_CONFIG.WS_URL}</span>
      )}

      <style>
        {`@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.4); } 100% { transform: scale(1); } }`}
      </style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  banner: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 14px',
    borderRadius: '10px',
    marginBottom: 12,
  },
  connected: {
    backgroundColor: SENSOR_CONFIG.COLORS.free + '18',
    border: `1px solid ${SENSOR_CONFIG.COLORS.free}40`,
  },
  disconnected: {
    backgroundColor: SENSOR_CONFIG.COLORS.warning + '18',
    border: `1px solid ${SENSOR_CONFIG.COLORS.warning}40`,
  },
  leftRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  statusText: {
    fontSize: '12px',
    fontWeight: 300,
  },
  urlText: {
    fontSize: '11px',
    color: '#636366',
    fontFamily: 'monospace',
  },
};
