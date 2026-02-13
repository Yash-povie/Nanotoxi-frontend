import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Sun, Moon, LogOut } from 'lucide-react';
import Home from './Home';
import Analyze from './Analyze';
import About from './About';
import Pricing from './Pricing';
import Playground from './Playground';
import Login from './Login';
import './styles.css';

// --- BIO FIELD BACKGROUND ---
const BioFieldBackground = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();
    const lines = 15; const speed = 0.002;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const style = getComputedStyle(document.body);
      ctx.strokeStyle = style.getPropertyValue('--line-color').trim();
      ctx.lineWidth = 1.5;
      for (let i = 0; i < lines; i++) {
        ctx.beginPath();
        const yBase = (canvas.height / lines) * i;
        for (let x = 0; x <= canvas.width; x += 20) {
          const noise = Math.sin(x * 0.003 + frame * speed + i) * Math.cos(x * 0.01 + frame * speed * 0.5);
          ctx.lineTo(x, yBase + (noise * 80));
        }
        ctx.stroke();
      }
      frame++;
      requestAnimationFrame(draw);
    };
    draw();
    return () => window.removeEventListener('resize', resize);
  }, []);
  return <canvas ref={canvasRef} className="bio-field-canvas" />;
};

// --- NAVBAR ---
const Navbar = ({ theme, toggleTheme, isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleNavClick = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAnalyzeClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      handleNavClick('analyze');
    }
  };

  return (
    <nav>
      <div 
        onClick={() => handleNavClick('home')}
        style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'Space Grotesk', color: 'var(--text-main)', cursor: 'pointer', whiteSpace: 'nowrap' }}
      >
        Nano<span style={{color:'var(--accent-primary)'}}>Toxi AI</span>
      </div>
      
      <div className="nav-links">
        <button onClick={handleAnalyzeClick} className="nav-link-btn">Analyze</button>
        <button onClick={() => handleNavClick('about')} className="nav-link-btn">About</button>
        <button onClick={() => handleNavClick('pricing')} className="nav-link-btn">Pricing</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: 'auto' }}>
        {isAuthenticated && (
          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ 
                width: '40px', height: '40px', borderRadius: '50%', 
                background: 'var(--accent-primary)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', cursor: 'pointer', border: '2px solid var(--bg-primary)'
              }}
            >
              U
            </div>
            {showProfileMenu && (
              <div style={{
                position: 'absolute', top: '50px', right: 0,
                background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                borderRadius: '12px', padding: '10px', minWidth: '120px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)'
              }}>
                <button 
                  onClick={() => { onLogout(); setShowProfileMenu(false); }}
                  style={{
                    background: 'transparent', border: 'none', color: 'var(--text-main)',
                    display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                    width: '100%', padding: '8px'
                  }}
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            )}
          </div>
        )}

        <button onClick={toggleTheme} className="theme-btn">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
};

// --- MAIN LAYOUT (The Single Page) ---
const MainApp = ({ isAuthenticated }) => (
  <div className="container">
    <section id="home"><Home isAuthenticated={isAuthenticated} /></section>
    
    {/* PASS AUTH STATE TO ANALYZE TO SECURE IT */}
    <section id="analyze"><Analyze isAuthenticated={isAuthenticated} /></section>
    
    <section id="about"><About /></section>
    <section id="pricing"><Pricing /></section>
  </div>
);

// --- PROTECTED ROUTE WRAPPER ---
const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  const [theme, setTheme] = useState('light');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <Router>
      <BioFieldBackground />
      <Routes>
        {/* ONE PAGER */}
        <Route path="/" element={
          <>
            <Navbar theme={theme} toggleTheme={toggleTheme} isAuthenticated={isAuthenticated} onLogout={() => setIsAuthenticated(false)} />
            <MainApp isAuthenticated={isAuthenticated} />
          </>
        } />
        
        {/* PLAYGROUND (SECURE) */}
        <Route path="/playground" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
             <>
                <Navbar theme={theme} toggleTheme={toggleTheme} isAuthenticated={isAuthenticated} onLogout={() => setIsAuthenticated(false)} />
                <div className="container" style={{paddingTop: '40px'}}><Playground /></div>
             </>
          </ProtectedRoute>
        } />

        {/* LOGIN */}
        <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
      </Routes>
    </Router>
  );
}