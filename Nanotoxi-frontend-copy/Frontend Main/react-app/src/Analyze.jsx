import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Settings, FileText, Download, Lock, RefreshCw } from 'lucide-react';
import './styles.css';

export default function Analyze({ isAuthenticated }) {
  const [uploadsLeft, setUploadsLeft] = useState(3);
  const [file, setFile] = useState(null);
  
  // Animation States
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [streamRows, setStreamRows] = useState([]);
  
  // Result Data
  const [apiData, setApiData] = useState(null); 
  const [downloadUrl, setDownloadUrl] = useState(null);
  
  const navigate = useNavigate();

  // --- THE ANIMATION LOGIC ---
  const handleRun = () => {
    if (!file) return alert("Please select a CSV file first.");
    if (uploadsLeft <= 0) return alert("Limit reached. Please upgrade.");

    setLoading(true);
    setApiData(null);
    setProgress(0);
    setStreamRows([]);
    setUploadsLeft(prev => prev - 1);

    // 1. Start Visual Simulation
    const interval = setInterval(() => {
      setProgress(old => {
        if (old >= 100) {
          clearInterval(interval);
          finishSimulation();
          return 100;
        }
        
        // Add "Fake" processing lines every 15%
        if (Math.floor(old) % 15 === 0 && old < 90) {
            setStreamRows(prev => [
                ...prev, 
                `Analyzing Row ${prev.length + 1}: ${file.name.substring(0,5)}... [COMPUTING]`
            ]);
        }
        return old + 2; // Speed of bar
      });
    }, 50);
  };

  // 2. Finish & Show Data
  const finishSimulation = () => {
    // Mock Result Data (Replace with real fetch if backend is connected)
    setApiData({
        preview: [
            { id: 1, particle: "Ag-NP-10", size: 10, pred: "High (98%)" },
            { id: 2, particle: "Au-NP-50", size: 50, pred: "Low (92%)" },
            { id: 3, particle: "Si-NP-X",  size: 100, pred: "Low (99%)" },
        ]
    });
    setLoading(false);
  };

  return (
    <div className="container">
      <div style={{ maxWidth: '900px', margin: '40px auto' }}>
         
         {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'Space Grotesk', margin: 0 }}>Analysis Console</h2>
          {isAuthenticated && (
            <div style={{ background: 'var(--glass-bg)', padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)' }}>
              {uploadsLeft} Runs Left
            </div>
          )}
        </div>

        {/* --- STATE 1: LOCKED (Not Logged In) --- */}
        {!isAuthenticated ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '60px', borderColor: 'var(--text-muted)' }}>
             <Lock size={50} color="var(--text-muted)" style={{ marginBottom: '20px' }} />
             <h2 style={{ fontFamily: 'Space Grotesk', color: 'var(--text-main)' }}>Authentication Required</h2>
             <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
               Please login to access the Analysis Console and Playground.
             </p>
             <button onClick={() => navigate('/login')} className="btn-main">
               Log In / Sign Up
             </button>
          </div>
        ) : (
          // --- STATE 2: UNLOCKED ---
          <>
            {/* 2A. UPLOAD BOX (Show if not loading and no results yet) */}
            {!loading && !apiData && (
                <div className={`upload-box ${file ? 'active' : ''}`}>
                    <label style={{ cursor: 'pointer', display: 'block' }}>
                        <input type="file" hidden accept=".csv" onChange={e => setFile(e.target.files[0])} />
                        <FileText size={48} color={file ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                        <h3 style={{ margin: '10px 0', color: 'var(--text-main)' }}>{file ? file.name : "Click to Upload CSV"}</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Supported formats: .csv (Max 10MB)</p>
                    </label>
                    {file && (
                        <button onClick={handleRun} className="btn-main" style={{ marginTop: '20px', width: '100%' }}>
                            Initialize Simulation
                        </button>
                    )}
                </div>
            )}

            {/* 2B. LOADING ANIMATION (Gear + Bar + Stream) */}
            {loading && (
              <div className="loader-wrapper" style={{ display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                    <Settings className="gear-icon" />
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                        {Math.round(progress)}%
                    </div>
                </div>
                
                {/* Streaming Rows */}
                <div className="streaming-container" style={{ maxHeight: '200px', overflow: 'hidden' }}>
                    {streamRows.map((row, i) => (
                        <div key={i} className="stream-row" style={{ animationDelay: `${i * 0.1}s` }}>
                            <span>{row}</span>
                            <span style={{ color: 'var(--accent-primary)' }}>✓</span>
                        </div>
                    ))}
                </div>
              </div>
            )}

            {/* 2C. RESULTS TABLE (Simple View) */}
            {!loading && apiData && (
              <div className="table-wrapper">
                <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0 }}>Preliminary Report</h3>
                  <button 
                    onClick={() => { setFile(null); setApiData(null); }} 
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <RefreshCw size={16} /> New Run
                  </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table>
                      <thead>
                          <tr>
                            <th>ID</th>
                            <th>Particle</th>
                            <th>Size (nm)</th>
                            <th>Prediction</th>
                          </tr>
                      </thead>
                      <tbody>
                          {apiData.preview.map((row, i) => (
                              <tr key={i}>
                                  <td>{row.id}</td>
                                  <td>{row.particle}</td>
                                  <td>{row.size}</td>
                                  <td style={{ color: row.pred.includes("High") ? "#ef4444" : "var(--accent-primary)", fontWeight: 'bold' }}>
                                    {row.pred}
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2D. PLAYGROUND LINK (Always visible if logged in) */}
            <div className="playground-link-box">
                <p style={{ margin: '0 0 15px 0', color: 'var(--text-muted)' }}>
                    Need to dive deeper? Want to simulate changes in real-time?
                </p>
                <Link to="/playground" className="playground-link">
                    🧪 Jump to the Research Playground &rarr;
                </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}