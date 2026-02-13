import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css'; // Ensure it loads the CSS

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in...');
    
    // 1. Update global authentication state
    onLogin(); 
    
    // 2. Redirect back to the Main App
    navigate('/');
  };

  return (
    <div className="login-container">
      {/* Background Decoration */}
      <div className="bg-decoration">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
      </div>

      <div className="login-card">
         <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'Space Grotesk', color: 'var(--text-main)', marginBottom:'10px' }}>
                Nano<span style={{color:'var(--accent-primary)'}}>Tox</span>
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk', color: 'var(--text-main)', fontSize: '1.5rem', margin: 0 }}>
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
         </div>

         <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '5px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginLeft: '4px' }}>Email</label>
                <input 
                  type="email" 
                  className="login-input" 
                  placeholder="you@example.com" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                />
            </div>
            
            <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginLeft: '4px' }}>Password</label>
                <input 
                  type="password" 
                  className="login-input" 
                  placeholder="••••••••" 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
            </div>

            <button type="submit" className="login-btn">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
         </form>

         <div className="toggle-mode">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span 
              onClick={() => setIsSignUp(!isSignUp)} 
              style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 'bold' }}
            >
                {isSignUp ? 'Sign In' : 'Sign Up'}
            </span>
         </div>
      </div>
    </div>
  );
}