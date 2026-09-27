import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Target, BookOpen, Activity, LogOut, BrainCircuit } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Target size={20} />, label: 'Quest & Misi', path: '/quest' },
    { icon: <BookOpen size={20} />, label: 'Ruang Belajar', path: '/learn' },
    { icon: <Activity size={20} />, label: 'Simulasi TKA', path: '/tka' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="btn-icon" style={{ padding: '0.5rem', background: 'var(--primary)', color: 'white' }}>
          <BrainCircuit size={24} />
        </div>
        <h2 className="text-xl text-gradient">ISTIQ-MATH</h2>
      </div>

      <nav className="sidebar-nav flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
        {/* Logout button as a nav item for mobile bottom nav compatibility */}
        <button
          onClick={handleLogout}
          className="nav-item"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
