// ============================================================
//  app/alerts.tsx  —  Alerts & notifications screen (third tab)
// ============================================================
//
//  Displays a feed of alerts generated from sensor state changes.
//  Alerts are generated locally in this screen from the sensor data.
//  No backend needed — everything runs in the app.
//
//  WHAT TO CHANGE:
//  • Alert rules — edit the generateAlerts() function to add
//    new alert types (e.g. "sensor has been occupied for >2 hours")
//  • Alert appearance — edit AlertRow styles at the bottom
//  • Push notifications — use expo-notifications to fire a
//    notification when a new alert is generated
//    (see Expo docs: https://docs.expo.dev/push-notifications/overview/)
// ============================================================

import React, { useMemo, useState } from 'react';
import { SENSOR_CONFIG } from '../constants/sensorConfig';
import { SensorReading, useSensorData } from '../hooks/useSensorData';

// ----------------------------------------------------------
//  Alert type definition
//  Add new fields here if you want more info in each alert
// ----------------------------------------------------------
type AlertSeverity = 'high' | 'medium' | 'low';

interface SensorAlert {
  id: string;
  sensorId: string;
  sensorName: string;
  message: string;
  severity: AlertSeverity;
  timestamp: number;
}

// ----------------------------------------------------------
//  generateAlerts()  —  The alert logic lives here
//  Add new if-blocks to create new types of alerts.
//  Each sensor is checked every time the sensors array updates.
// ----------------------------------------------------------
function generateAlerts(sensors: SensorReading[]): SensorAlert[] {
  const alerts: SensorAlert[] = [];

  sensors.forEach((sensor) => {
    // --- Alert: Sensor is offline ---
    if (sensor.status === 'offline') {
      alerts.push({
        id: `offline-${sensor.id}`,
        sensorId: sensor.id,
        sensorName: sensor.name,
        message: 'Sensor is offline — no data received',
        severity: 'high',
        timestamp: sensor.timestamp,
      });
    }

    // --- Alert: Long time since last update (sensor slow/frozen?) ---
    const msSinceUpdate = Date.now() - sensor.timestamp;
    if (
      sensor.status !== 'offline' &&
      msSinceUpdate > SENSOR_CONFIG.THRESHOLDS.OFFLINE_TIMEOUT_MS
    ) {
      alerts.push({
        id: `stale-${sensor.id}`,
        sensorId: sensor.id,
        sensorName: sensor.name,
        message: `No update in ${Math.round(msSinceUpdate / 1000)}s — check connection`,
        severity: 'medium',
        timestamp: sensor.timestamp,
      });
    }

    // ---- ADD YOUR OWN ALERT RULES BELOW ----
    // Example: alert if occupied for more than 4 hours
    // if (sensor.status === 'occupied' && msSinceUpdate > 4 * 60 * 60 * 1000) {
    //   alerts.push({ id: `long-${sensor.id}`, sensorId: sensor.id, ... });
    // }
  });

  // Sort: high severity first, then by time (newest first)
  return alerts.sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    if (a.severity !== b.severity) return severityOrder[a.severity] - severityOrder[b.severity];
    return b.timestamp - a.timestamp;
  });
}

// ----------------------------------------------------------
//  Severity colour + label mapping
// ----------------------------------------------------------
const SEVERITY_CONFIG: Record<AlertSeverity, { color: string; label: string; bg: string }> = {
  high:   { color: SENSOR_CONFIG.COLORS.occupied, label: 'High',   bg: SENSOR_CONFIG.COLORS.occupied + '20' },
  medium: { color: SENSOR_CONFIG.COLORS.warning,  label: 'Medium', bg: SENSOR_CONFIG.COLORS.warning  + '20' },
  low:    { color: SENSOR_CONFIG.COLORS.free,      label: 'Low',    bg: SENSOR_CONFIG.COLORS.free     + '20' },
};

// ----------------------------------------------------------
//  Individual alert row component
// ----------------------------------------------------------
function AlertRow({ alert, isDarkMode }: { alert: SensorAlert, isDarkMode: boolean }) {
  const config = SEVERITY_CONFIG[alert.severity];
  const timeLabel = new Date(alert.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div style={{ ...styles.alertRow, borderLeft: `3px solid ${config.color}`, backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }}>
      <div style={styles.alertTop}>
        <span style={{ ...styles.alertSensor, color: isDarkMode ? '#FFFFFF' : '#000000' }}>{alert.sensorName}</span>
        <div style={{ ...styles.severityBadge, backgroundColor: config.bg }}>
          <span style={{ ...styles.severityText, color: config.color }}>
            {config.label}
          </span>
        </div>
      </div>
      <div style={styles.alertMessage}>{alert.message}</div>
      <div style={{ ...styles.alertTime, color: isDarkMode ? '#636366' : '#8E8E93' }}>{timeLabel}</div>
    </div>
  );
}

// ----------------------------------------------------------
//  Main screen
// ----------------------------------------------------------
export default function AlertsScreen({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const { sensors, stats } = useSensorData();

  // Recompute alerts whenever sensors change
  const alerts = useMemo(() => generateAlerts(sensors), [sensors]);

  // Filter: All | High | Medium | Low
  const [filter, setFilter] = useState<'All' | AlertSeverity>('All');
  const filters: Array<'All' | AlertSeverity> = ['All', 'high', 'medium', 'low'];

  const filteredAlerts = alerts.filter(
    (a) => filter === 'All' || a.severity === filter
  );

  return (
    <div style={{ ...styles.safe, backgroundColor: isDarkMode ? '#000000' : '#F2F2F7' }}>
      <div style={styles.header}>
        <h1 style={{ ...styles.title, color: isDarkMode ? '#FFFFFF' : '#000000' }}>Alerts</h1>
        <p style={{ ...styles.subtitle, color: isDarkMode ? '#8E8E93' : '#636366' }}>
          {alerts.length} active · {stats.offline} offline
        </p>
      </div>

      {/* ---- Severity filter tabs ---- */}
      <div style={styles.filterRow}>
        {filters.map((f) => (
          <button
            key={f}
            style={{
              ...styles.filterTab,
              ...(filter === f ? styles.filterTabActive : { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' })
            }}
            onClick={() => setFilter(f)}
          >
            <span style={{
              ...styles.filterText,
              ...(filter === f ? styles.filterTextActive : {})
            }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </span>
          </button>
        ))}
      </div>

      {/* ---- Alerts list ---- */}
      <div style={styles.listContent}>
        {filteredAlerts.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon} />
            <div style={{ ...styles.emptyText, color: isDarkMode ? '#FFFFFF' : '#000000' }}>No alerts</div>
            <div style={styles.emptySubtext}>All sensors are reporting normally</div>
          </div>
        ) : (
          filteredAlerts.map(alert => <AlertRow key={alert.id} alert={alert} isDarkMode={isDarkMode} />)
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  safe: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: '16px',
    paddingBottom: '10px',
  },
  title: {
    fontSize: '34px',
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#8E8E93',
    fontWeight: 300,
    marginTop: '2px',
  },
  filterRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    padding: '0 16px',
    marginBottom: '12px',
  },
  filterTab: {
    padding: '7px 14px',
    borderRadius: '20px',
    backgroundColor: '#1C1C1E',
    border: '1px solid #3A3A3C',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  filterTabActive: {
    backgroundColor: SENSOR_CONFIG.COLORS.accent,
    borderColor: SENSOR_CONFIG.COLORS.accent,
  },
  filterText: {
    fontSize: '13px',
    color: '#8E8E93',
    fontWeight: 300,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: '0 16px',
    paddingBottom: '32px',
    overflowY: 'auto',
  },
  alertRow: {
    backgroundColor: '#1C1C1E',
    borderRadius: '12px',
    padding: '14px',
    marginBottom: '10px',
    // Left coloured border shows severity at a glance
    borderLeftWidth: '3px',
  },
  alertTop: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  alertSensor: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#FFFFFF',
    flex: 1,
    marginRight: '8px',
  },
  severityBadge: {
    padding: '3px 8px',
    borderRadius: '8px',
  },
  severityText: {
    fontSize: '11px',
    fontWeight: 600,
  },
  alertMessage: {
    fontSize: '13px',
    color: '#EBEBF599',
    lineHeight: '18px',
    fontWeight: 300,
    marginBottom: '6px',
  },
  alertTime: {
    fontSize: '11px',
    color: '#636366',
  },
  empty: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '80px',
  },
  emptyIcon: {
    fontSize: '40px',
    color: SENSOR_CONFIG.COLORS.free,
    marginBottom: '12px',
  },
  emptyText: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#FFFFFF',
    marginBottom: '6px',
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#636366',
  },
};
