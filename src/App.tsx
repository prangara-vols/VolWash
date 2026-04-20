import React, { useState } from 'react';
import AlertsScreen from './app/alerts';
import MapScreen from './app/map';
import utkLogo from './assets/images/UTK.png';
import logo from './assets/images/volwash-logo-textless.png';
import ConnectionBanner from './components/ConnectionBanner';
import SensorCard from './components/SensorCard';
import StatsBar from './components/StatsBar';
import { SENSOR_CONFIG } from './constants/sensorConfig';
import { SensorReading, useSensorData } from './hooks/useSensorData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dash' | 'map' | 'alerts'>('dash');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedDorm, setSelectedDorm] = useState('All');
  const [machineType, setMachineType] = useState<'all' | 'washers' | 'dryers'>('all');
  
  const { sensors, stats, connection } = useSensorData();

  const occupancyRate = stats.total > 0 
    ? Math.round((stats.occupied / stats.total) * 100) 
    : 0;

  const theme = {
    bg: isDarkMode ? '#000000' : '#F2F2F7',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    subtext: isDarkMode ? '#8E8E93' : '#636366',
    nav: isDarkMode ? '#1C1C1E' : '#FFFFFF',
  };

  // Step 1: Filter by Residence Hall
  const dormFiltered = selectedDorm === 'All' 
    ? sensors 
    : sensors.filter((s: SensorReading) => s.location === selectedDorm);

  // Step 2: Filter by Machine Type
  const filteredSensors = dormFiltered.filter((s: SensorReading) => {
    if (machineType === 'washers') return s.id?.toLowerCase().includes('w') || s.name?.toLowerCase().includes('washer');
    if (machineType === 'dryers') return s.id?.toLowerCase().includes('d') || s.name?.toLowerCase().includes('dryer');
    return true;
  });

  const renderDashboard = () => (
    <div style={{ padding: '16px' }}>
      <header style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* VolWash Logo HD - No longer a link */}
            <img 
              src={logo} 
              alt="VolWash Logo" 
              style={{ height: '50px', width: 'auto' }}
            />
            
            {/* Unit Identifier */}
            <div>
              <h1 title="VolWash" style={{ 
                fontSize: window.innerWidth > 768 ? '44px' : '24px', 
                margin: 0, 
                fontWeight: 700, 
                color: '#58595B', // Smokey Gray
                lineHeight: 1,
                fontFamily: 'inherit',
                letterSpacing: '-0.02em'
              }}>VolWash</h1>
            </div>
          </div>
        </div>

        {/* Dorm Selector Dropdown */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 300, color: theme.subtext, textTransform: 'uppercase', marginBottom: '8px' }}>
            Select Residence Hall
          </label>
          <select 
            value={selectedDorm}
            onChange={(e) => setSelectedDorm(e.target.value)}
            style={{
              ...styles.dropdown,
              backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
              color: theme.text,
              borderColor: isDarkMode ? '#3A3A3C' : '#D1D1D6'
            }}
          >
            <option value="All">All Dorms</option>
            {SENSOR_CONFIG.LOCATIONS.map(dorm => (
              <option key={dorm} value={dorm}>{dorm}</option>
            ))}
          </select>
        </div>

        {/* Machine Type Filter */}
        <div style={{ marginTop: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 300, color: theme.subtext, textTransform: 'uppercase', marginBottom: '8px' }}>
            Filter Machines
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['all', 'washers', 'dryers'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMachineType(type)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  cursor: 'pointer',
                  backgroundColor: machineType === type ? SENSOR_CONFIG.COLORS.accent : (isDarkMode ? '#1C1C1E' : '#FFFFFF'),
                  color: machineType === type ? '#FFFFFF' : theme.text,
                  borderColor: isDarkMode ? '#3A3A3C' : '#D1D1D6'
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Show the live connection status at the top */}
      {connection && <ConnectionBanner connection={connection} isDarkMode={isDarkMode} />}

      <StatsBar 
        total={stats.total} 
        occupied={stats.occupied} 
        free={stats.free} 
        offline={stats.offline} 
        occupancyRate={occupancyRate} 
        isDarkMode={isDarkMode}
      />

      <div style={styles.grid}>
        {filteredSensors.map((s: SensorReading) => (
          <SensorCard key={s.id} sensor={s} isDarkMode={isDarkMode} />
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'map':    return <MapScreen isDarkMode={isDarkMode} />;
      case 'alerts': return <AlertsScreen isDarkMode={isDarkMode} />;
      default:       return renderDashboard();
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: theme.bg, 
      color: theme.text, 
      paddingBottom: '80px', 
      transition: 'background-color 0.3s',
      // Official UTK Brand font prioritized
      fontFamily: 'Gotham, "Montserrat", "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* 1. The Big Orange ID Line (6px UT Orange) */}
      <div style={{ height: '6px', backgroundColor: '#FF8200', width: '100%' }} />

      {renderContent()}

      <nav style={{ ...styles.nav, backgroundColor: theme.nav, borderTopColor: isDarkMode ? '#2C2C2E' : '#D1D1D6' }}>
        <button onClick={() => setActiveTab('dash')} style={{ ...styles.btn, color: activeTab === 'dash' ? SENSOR_CONFIG.COLORS.accent : '#636366' }}>
          <span style={{ fontSize: '12px', fontWeight: 600 }}>Status</span>
          {activeTab === 'dash' && <div style={styles.navIndicator} />}
        </button>
        <button onClick={() => setActiveTab('map')} style={{ ...styles.btn, color: activeTab === 'map' ? SENSOR_CONFIG.COLORS.accent : '#636366' }}>
          <span style={{ fontSize: '12px', fontWeight: 600 }}>Map</span>
          {activeTab === 'map' && <div style={styles.navIndicator} />}
        </button>
        <button onClick={() => setActiveTab('alerts')} style={{ ...styles.btn, color: activeTab === 'alerts' ? SENSOR_CONFIG.COLORS.accent : '#636366' }}>
          <span style={{ fontSize: '12px', fontWeight: 600 }}>Alerts</span>
          {activeTab === 'alerts' && <div style={styles.navIndicator} />}
        </button>
        <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ ...styles.btn, color: '#636366' }}>
          <span style={{ fontSize: '12px', fontWeight: 600 }}>{isDarkMode ? 'Light' : 'Dark'}</span>
        </button>
      </nav>

      {/* UT Contact Bar */}
      <div style={{ 
        ...styles.contactBar, 
        backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
        borderTop: '6px solid #FF8200' 
      }}>
        <div style={{ ...styles.footerContent, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <img src={utkLogo} alt="University of Tennessee" style={{ height: '60px', width: 'auto' }} />
            <h3 style={{ color: '#58595B', margin: 0, fontSize: '22px', fontWeight: 700 }}>Tickle College of Engineering</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', fontSize: '14px', color: theme.subtext }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700 }}>Tickle College of Engineering</p>
              <p style={{ margin: '4px 0', fontWeight: 300 }}>Zeanah Engineering Complex, 863 Neyland Dr<br />Knoxville, TN 37996</p>
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 300 }}>Phone: (865) 974-5321</p>
              <p style={{ margin: '4px 0', fontWeight: 300 }}>Email: <a href="mailto:engineering@utk.edu" style={{ color: '#FF8200', textDecoration: 'none' }}>engineering@utk.edu</a></p>
            </div>
            <div>
              <a href="https://tickle.utk.edu" style={{ color: '#FF8200', textDecoration: 'none', fontWeight: 300 }}>TCE Website</a>
            </div>
          </div>
        </div>
      </div>

      {/* UT Standard Footer */}
      <div style={{ 
        padding: '32px 0 110px', // Removed horizontal padding to push further left
        color: isDarkMode ? '#8E8E93' : '#58595B',
        fontSize: '13px',
        borderTop: isDarkMode ? '1px solid #2C2C2E' : '1px solid #E5E5EA'
      }}>
        <div style={{ ...styles.footerContent, textAlign: 'left' }}>
          <div style={{ marginBottom: '20px', marginLeft: '24px' }}>
            <p style={{ margin: '0 0 4px 0', fontWeight: 700 }}>The University of Tennessee</p>
            <p style={{ margin: 0 }}>Knoxville, Tennessee 37996<br />865-974-1000</p>
          </div>
          
          <p style={{ lineHeight: '1.6', maxWidth: '600px', fontWeight: 300, marginLeft: '24px' }}>
            The flagship campus of the University of Tennessee System and partner in the Tennessee Transfer Pathway.
          </p>

          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '12px', 
            marginTop: '24px',
            marginLeft: '24px', // Pushed legal links a lil to the right
            textTransform: 'uppercase',
            fontWeight: 300,
            letterSpacing: '0.05em'
          }}>
            <a href="#" style={styles.footerLink}>ADA</a>
            <a href="#" style={styles.footerLink}>Privacy</a>
            <a href="#" style={styles.footerLink}>Safety</a>
            <a href="#" style={styles.footerLink}>Title IX</a>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '12px',
    marginTop: '20px'
  },
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '65px',
    backgroundColor: '#1C1C1E',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTop: '1px solid #2C2C2E',
    zIndex: 1000
  },
  btn: {
    background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', transition: 'color 0.2s', fontFamily: 'inherit'
  },
  dropdown: {
    width: '100%',
    padding: '12px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 500,
    border: '1px solid',
    appearance: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  contactBar: {
    marginTop: '40px',
    padding: '32px 16px',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0', // Pushed to the left
  },
  footerLink: {
    color: 'inherit',
    textDecoration: 'none',
    fontSize: '11px'
  },
  navIndicator: {
    height: '4px',
    width: '24px',
    backgroundColor: SENSOR_CONFIG.COLORS.accent,
    borderRadius: '4px', // Beveled look
    marginTop: '2px'
  }
};