import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MapPin, Calendar, LogOut } from 'lucide-react';

const Navbar = ({ onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/places', label: 'Mekanlar', icon: MapPin },
    { path: '/appointments', label: 'Randevular', icon: Calendar },
  ];

  return (
    <nav className="glass-card" style={{ 
      margin: '1.5rem 1rem', 
      padding: '1rem 2rem', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      position: 'sticky',
      top: '1.5rem',
      zIndex: 100,
      borderRadius: '1.5rem'
    }}>
      <div className="flex-center" style={{ gap: '0.75rem' }}>
        <div style={{ 
          width: '42px', 
          height: '42px', 
          background: 'var(--primary)', 
          borderRadius: '0.875rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
        }}>
          <Calendar className="text-white w-6 h-6" />
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: '800', trackingTight: '-0.025em' }}>
          Randevu<span style={{ color: 'var(--primary)' }}>Takip</span>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              fontSize: '0.9375rem',
              fontWeight: '600'
            }}
          >
            <item.icon size={18} />
            <span className="hidden md:inline">{item.label}</span>
          </Link>
        ))}
      </div>

      <button
        onClick={onLogout}
        className="nav-link"
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          color: 'var(--error)',
          fontWeight: '600',
          background: 'none',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <LogOut size={18} />
        <span className="hidden md:inline">Çıkış</span>
      </button>
    </nav>
  );
};

export default Navbar;
