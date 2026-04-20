// ============================================================
//  StatsBar.tsx  —  Occupancy summary row at top of dashboard
// ============================================================
//
//  Shows: Total sensors / Occupied / Free / Offline counts
//  and a coloured occupancy percentage bar.
//
//  WHAT TO CHANGE:
//  • Tile colours — edit tileColors below
//  • Add more stat tiles by duplicating a <StatTile> block
//  • Remove the progress bar if you don't want it
// ============================================================

import React from 'react';
import { SENSOR_CONFIG } from '../constants/sensorConfig';

interface Props {
  total: number;
  occupied: number;
  free: number;
  offline: number;
  occupancyRate: number;   // 0–100
  isDarkMode?: boolean;
}

// ----------------------------------------------------------
//  Individual stat tile — reused for each number
// ----------------------------------------------------------
function StatTile({
  label,
  value,
  color,
  isDarkMode,
}: {
  label: string;
  value: number | string;
  color: string;
  isDarkMode: boolean;
}) {
  return (
    <div style={styles.tile}>
      <div style={{ ...styles.tileValue, color }}>{value}</div>
      <div style={{ ...styles.tileLabel, color: isDarkMode ? '#8E8E93' : '#636366' }}>{label}</div>
    </div>
  );
}

export default function StatsBar({
  total,
  occupied,
  free,
  offline,
  occupancyRate,
  isDarkMode = true,
}: Props) {
  // Pick bar colour based on how busy it is
  // Change these thresholds to adjust when the bar turns amber/red
  const barColor =
    occupancyRate >= SENSOR_CONFIG.THRESHOLDS.HIGH_OCCUPANCY_PERCENT
      ? SENSOR_CONFIG.COLORS.occupied    // red when very busy
      : occupancyRate >= 50
      ? SENSOR_CONFIG.COLORS.warning     // amber when moderately busy
      : SENSOR_CONFIG.COLORS.free;       // green when mostly free

  return (
    <div style={{ ...styles.container, backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }}>
      {/* ---- Four stat tiles ---- */}
      <div style={styles.tilesRow}>
        <StatTile label="Total"    value={total}    color={isDarkMode ? '#FFFFFF' : '#000000'} isDarkMode={isDarkMode} />
        <StatTile label="Occupied" value={occupied} color={SENSOR_CONFIG.COLORS.occupied} isDarkMode={isDarkMode} />
        <StatTile label="Free"     value={free}     color={SENSOR_CONFIG.COLORS.free} isDarkMode={isDarkMode} />
        <StatTile label="Offline"  value={offline}  color={SENSOR_CONFIG.COLORS.offline} isDarkMode={isDarkMode} />
      </div>

      {/* ---- Occupancy progress bar ---- */}
      <div style={styles.barSection}>
        <div style={styles.barRow}>
          <div style={{ ...styles.barLabel, color: isDarkMode ? '#8E8E93' : '#636366' }}>Occupancy</div>
          <div style={{ ...styles.barPercent, color: barColor }}>
            {occupancyRate}%
          </div>
        </div>
        {/* Track */}
        <div style={styles.barTrack}>
          {/* Fill — width is a percentage string e.g. "65%" */}
          <div
            style={{
              ...styles.barFill,
              width: `${occupancyRate}%`,
              backgroundColor: barColor 
            }}
          />
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: '#1C1C1E',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '16px',
  },
  tilesRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  tile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  tileValue: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '2px',
  },
  tileLabel: {
    fontSize: '11px',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: 300,
  },
  barSection: {
    borderTop: '1px solid #2C2C2E',
    paddingTop: '12px',
  },
  barRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '6px',
  },
  barLabel: {
    fontSize: '12px',
    color: '#8E8E93',
  },
  barPercent: {
    fontSize: '12px',
    fontWeight: 600,
  },
  barTrack: {
    height: '6px',
    backgroundColor: '#2C2C2E',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
};
