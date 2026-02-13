import React from 'react';
import { Check } from 'lucide-react';
import './styles.css';

export default function Pricing() {
  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', marginTop: '60px', fontFamily: 'Space Grotesk', fontSize: '3rem' }}>Upgrade Plan</h1>
      <div className="card-grid">
        <div className="glass-card">
          <h3>Starter</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '20px 0' }}>Free</div>
          <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, lineHeight: 2 }}>
             <li><Check size={16} /> 3 Free Uploads</li>
             <li><Check size={16} /> Basic Reports</li>
          </ul>
        </div>
        <div className="glass-card" style={{ borderColor: 'var(--accent-primary)', boxShadow: '0 0 30px var(--accent-glow)' }}>
          <h3 style={{ color: 'var(--accent-primary)' }}>Pro Lab</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '20px 0' }}>$49</div>
          <button className="btn-main" style={{ width: '100%', marginBottom: '20px' }}>Upgrade</button>
          <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, lineHeight: 2 }}>
             <li><Check size={16} /> Unlimited Uploads</li>
             <li><Check size={16} /> API Access</li>
             <li><Check size={16} /> Priority Support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}