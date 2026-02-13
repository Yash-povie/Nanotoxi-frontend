import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const BlurText = ({ children }) => {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) ref.current.classList.add('visible');
      else ref.current.classList.remove('visible');
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <p ref={ref} className="blur-text">{children}</p>;
};

export default function Home({ isAuthenticated }) {
  const navigate = useNavigate();

  const handleCtaClick = () => {
    if (isAuthenticated) {
      // If logged in, scroll to Analyze section
      const element = document.getElementById('analyze');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If not logged in, go to Login page
      navigate('/login');
    }
  };

  return (
    <div style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h1 className="hero-title" style={{ fontSize: '4rem', fontFamily: 'Space Grotesk', marginBottom: '20px', lineHeight: 1.1 }}>
        Uncover Nano-Toxicity <br /><span style={{ color: 'var(--accent-primary)' }}>10x Faster</span>
      </h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 50px auto' }}>
        The world's first AI-driven platform for predicting nanoparticle interactions.
      </p>
      
      {/* Dynamic Button Text based on Auth Status */}
      <button onClick={handleCtaClick} className="btn-main">
        {isAuthenticated ? 'Analyze Now' : 'Get Started'}
      </button>

      {isAuthenticated && (
         <div style={{color: 'var(--accent-primary)', fontWeight:'bold', marginTop: '20px'}}>
            Session Active
         </div>
      )}

      <div style={{ marginTop: '150px', maxWidth: '800px', margin: '150px auto' }}>
        <BlurText>Nanotoxi is a patent-pending, multi-stage cytotoxicity model that integrates nanoparticles' physicochemical traits.</BlurText>
        <BlurText>We predict and explain toxicity mechanisms faster than wet labs using proprietary AI agents.</BlurText>
        <BlurText>Traditional testing depends on costly, time-intensive in-vivo experiments. We solve this.</BlurText>
      </div>
    </div>
  );
}