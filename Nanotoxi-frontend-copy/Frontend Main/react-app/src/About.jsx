import React, { useEffect, useRef } from 'react';
import './styles.css';

// Helper for Staggered Animation
const TeamCard = ({ member, index }) => {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className="glass-card team-card" /* Added glass-card class */
      style={{ 
        transitionDelay: `${index * 0.2}s`, 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: 0, 
        transform: 'translateY(50px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease'
      }}
    >
      {/* Initials Avatar */}
      <div style={{ 
        width: '100px', height: '100px', borderRadius: '50%', 
        background: 'linear-gradient(135deg, var(--bg-secondary), var(--glass-bg))',
        border: '2px solid var(--accent-primary)',
        color: 'var(--accent-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2rem', fontWeight: 'bold', fontFamily: 'Space Grotesk',
        marginBottom: '20px',
        boxShadow: '0 0 20px var(--accent-glow)'
      }}>
        {member.initials}
      </div>

      {/* Text Content - Uses CSS Variables for Light/Dark Mode */}
      <h3 style={{ 
        color: 'var(--accent-primary)', margin: '10px 0', fontSize: '1.5rem', fontFamily: 'Space Grotesk' 
      }}>
        {member.name}
      </h3>
      <h4 style={{ 
        color: 'var(--text-main)', margin: '0 0 15px 0', fontSize: '1rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' 
      }}>
        {member.role}
      </h4>
      <p style={{ 
        color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '300px'
      }}>
        {member.desc}
      </p>
    </div>
  );
};

export default function About() {
  const team = [
    { name: "Yash Pramod Wasnik", initials: "YW", role: "Founding Engineer", desc: "Led AI projects for Govt of Zambia & Makerere University." },
    { name: "Ronith Lahoti", initials: "RL", role: "Founder & Scientific Lead", desc: "Researcher at UPenn & Singh Center for Nanotechnology." },
    { name: "Dr. Swapnil Gaikward", initials: "SG", role: "Key Opinion Leader", desc: "Post-Doc Fellow, University of Sao Paulo (4031+ Citations)." }
  ];

  return (
    <div className="container">
      <h1 className="hero-title" style={{ textAlign: 'center', marginTop: '60px', marginBottom: '50px' }}>
        Meet Our Team
      </h1>
      <div className="card-grid" style={{ alignItems: 'start' }}>
        {team.map((member, i) => (
          <TeamCard key={i} member={member} index={i} />
        ))}
      </div>
    </div>
  );
}