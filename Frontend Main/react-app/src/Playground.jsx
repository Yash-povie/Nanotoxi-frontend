import React, { useState } from 'react';
import { Settings, Save, Play, Cpu, FileText, AlertCircle } from 'lucide-react';
import './styles.css';

// --- VISUAL COMPONENTS ---
const LlamaLoader = () => (
  <div className="llama-loader">
    <div className="gear-assembly">
      <Settings className="gear-spinner" size={40} />
      <div className="particle-track">
        {[...Array(5)].map((_, i) => <div key={i} className="hex-particle" />)}
      </div>
    </div>
    <div className="llama-text">Llama 3 is analyzing your data...</div>
  </div>
);

const InferenceStream = ({ text }) => {
  // Split by newlines to render cleanly
  const lines = text.split('\n').filter(line => line.trim() !== '');
  return (
    <div className="inference-box">
      <h3 style={{ color: '#eab308', marginTop: 0, display:'flex', gap:'10px', alignItems:'center' }}>
        <Cpu size={20} /> Llama 3 Inference
      </h3>
      {lines.map((line, i) => (
        <div key={i} className="inference-line" style={{ animationDelay: `${i * 0.1}s` }}>
          {line}
        </div>
      ))}
    </div>
  );
};

export default function Playground() {
  const [file, setFile] = useState(null);
  
  // Dynamic Data States
  const [headers, setHeaders] = useState([]); // Stores "nanoparticle_id", "core_size", etc.
  const [gridData, setGridData] = useState([]); // Stores the actual rows
  
  // Analysis States
  const [analyzed, setAnalyzed] = useState(false);
  const [loadingML, setLoadingML] = useState(false);
  
  // Llama States
  const [loadingLlama, setLoadingLlama] = useState(false);
  const [inferenceResult, setInferenceResult] = useState("");
  const [llamaError, setLlamaError] = useState(null);

  // --- 1. REAL CSV PARSER ---
  const handleFileUpload = (e) => {
    const f = e.target.files[0];
    if(!f) return;
    setFile(f);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const rows = text.split('\n').map(r => r.trim()).filter(r => r);
      
      if (rows.length > 0) {
        // Extract Headers
        const headerRow = rows[0].split(',').map(h => h.trim());
        setHeaders(headerRow);

        // Extract Data
        const parsedData = rows.slice(1).map((row, index) => {
          const values = row.split(',');
          const rowObj = { id: index }; // Internal ID for React keys
          headerRow.forEach((header, i) => {
            rowObj[header] = values[i] ? values[i].trim() : '';
          });
          // Add placeholders for AI results
          rowObj['Toxicity_Pred'] = 'Pending'; 
          return rowObj;
        });
        
        setGridData(parsedData);
        setAnalyzed(false);
        setInferenceResult("");
      }
    };
    reader.readAsText(f);
  };

  // --- 2. EDITING LOGIC ---
  const handleEdit = (rowId, field, val) => {
    setGridData(prev => prev.map(row => 
      row.id === rowId ? { ...row, [field]: val } : row
    ));
    setAnalyzed(false); // Force re-analysis if data changes
  };

  // --- 3. MOCK ML ANALYSIS (Simulates your Python Backend) ---
  const runAnalysis = () => {
    setLoadingML(true);
    // Simulate processing time
    setTimeout(() => {
      setGridData(prev => prev.map(row => {
        // Simple logic: if 'core_size' column exists and is < 20, mark High
        // This simulates your Random Forest model
        const size = parseFloat(row['core_size'] || 0);
        const tox = size > 0 && size < 20 ? "High" : "Low";
        return { ...row, Toxicity_Pred: tox };
      }));
      setAnalyzed(true);
      setLoadingML(false);
    }, 1500);
  };

  // --- 4. REAL OLLAMA CONNECTION ---
  const runInference = async () => {
    setLoadingLlama(true);
    setInferenceResult("");
    setLlamaError(null);

    // Construct a prompt using the FIRST row of your edited data
    // (You can loop this for all rows, but let's start with the first one for the demo)
    const targetRow = gridData[0];
    const dataContext = Object.entries(targetRow)
      .filter(([key]) => key !== 'id') // exclude internal ID
      .map(([key, val]) => `${key}: ${val}`)
      .join(', ');

    const prompt = `
      Act as a nanotoxicologist expert. 
      Analyze the following nanoparticle data row: [ ${dataContext} ]. 
      
      The machine learning model predicted: ${targetRow['Toxicity_Pred']} Toxicity.
      
      1. Explain the likely biological mechanism for this result based on the size (core_size), charge (zeta_potential), and composition.
      2. Suggest one chemical modification to improve biocompatibility.
      Keep it concise and scientific.
    `;

    try {
      // THE REAL FETCH CALL TO LOCALHOST:11434
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "llama3", // Ensure you have 'ollama pull llama3' run previously
          prompt: prompt,
          stream: false // Set to false to get full text at once, or true for streaming
        })
      });

      if (!response.ok) throw new Error("Failed to connect to Ollama. Is it running?");
      
      const data = await response.json();
      setInferenceResult(data.response); // This is the real text from Llama 3

    } catch (err) {
      console.error(err);
      setLlamaError("Error: Could not reach Llama 3. Make sure to run 'ollama serve' with CORS enabled.");
    } finally {
      setLoadingLlama(false);
    }
  };

  return (
    <div className="container">
      <div style={{ maxWidth: '1200px', margin: '40px auto' }}>
        
        <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
          Research <span style={{color: '#eab308'}}>Playground</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>
          Edit real CSV data and ask your local Llama 3 model for reasoning.
        </p>

        {/* UPLOAD */}
        {!file && (
          <div className="upload-box">
             <label style={{ cursor: 'pointer', display: 'block' }}>
                <input type="file" hidden accept=".csv" onChange={handleFileUpload} />
                <FileText size={48} color="var(--accent-primary)" />
                <h3>Load Baseline CSV</h3>
                <p style={{color: 'var(--text-muted)'}}>Upload your 11-column dataset</p>
             </label>
          </div>
        )}

        {/* EDITOR */}
        {file && (
          <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
                 <div style={{ fontWeight: 'bold' }}>{file.name}</div>
                 <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>Editable Mode</span>
               </div>
               <button 
                 className="btn-main" 
                 onClick={runAnalysis}
                 disabled={loadingML}
                 style={{ padding: '10px 24px', fontSize: '0.9rem', display: 'flex', gap: '8px', alignItems: 'center' }}
               >
                 {loadingML ? 'Simulating...' : <><Save size={16} /> Save & Analyze</>}
               </button>
            </div>

            <div style={{ overflowX: 'auto', maxHeight: '500px' }}>
              <table style={{ margin: 0 }}>
                <thead>
                  <tr>
                    {headers.map((h, i) => <th key={i}>{h}</th>)}
                    <th style={{ color: 'var(--accent-primary)' }}>ML Prediction</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData.map((row) => (
                    <tr key={row.id}>
                      {headers.map((header) => (
                        <td key={header}>
                          <input 
                            className="cell-input" 
                            type="text" 
                            value={row[header]} 
                            onChange={(e) => handleEdit(row.id, header, e.target.value)}
                          />
                        </td>
                      ))}
                      <td style={{ 
                        color: row.Toxicity_Pred === "High" ? "#ef4444" : 
                               row.Toxicity_Pred === "Low" ? "var(--accent-primary)" : "var(--text-muted)",
                        fontWeight: 'bold' 
                      }}>
                        {row.Toxicity_Pred}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INFERENCE SECTION */}
        {analyzed && (
          <div style={{ marginTop: '40px', animation: 'popUp 0.5s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#eab308' }}>Mechanistic Reasoning</h3>
              {!loadingLlama && !inferenceResult && (
                <button 
                  onClick={runInference}
                  className="btn-main" 
                  style={{ background: '#eab308', color: '#000', boxShadow: '0 0 20px rgba(234, 179, 8, 0.3)' }}
                >
                  <Play size={16} style={{ marginRight: '8px' }} /> Run Llama Inference
                </button>
              )}
            </div>

            {loadingLlama && <LlamaLoader />}

            {llamaError && (
              <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ef4444', borderRadius: '12px', color: '#ef4444', display: 'flex', gap: '10px' }}>
                <AlertCircle /> {llamaError}
              </div>
            )}

            {inferenceResult && (
              <InferenceStream text={inferenceResult} />
            )}
          </div>
        )}

      </div>
    </div>
  );
}