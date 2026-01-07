import React, { useState, useEffect } from 'react';
import { Shield, Zap, Play, ChevronRight, CheckCircle2, Moon, Sun, FileText, Settings, BarChart2, AlertTriangle, RotateCcw, Image as ImageIcon, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalyticsPage from './components/AnalyticsPage';

function App() {
  const [activeView, setActiveView] = useState('console');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState(null);
  const [goal, setGoal] = useState("Leak HR Salary Data");
  const [isDark, setIsDark] = useState(false);
  const [liveStats, setLiveStats] = useState({ depth: 0, attempts: 0, bestStealth: 0.0 });
  const [attackHistory, setAttackHistory] = useState([]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const handleLaunch = async () => {
    setIsRunning(true);
    setLogs([]);
    setNodes([]);
    setResult(null);
    setCurrentStep(1);
    setLiveStats({ depth: 0, attempts: 0, bestStealth: 0.0 });

    const evtSource = new EventSource(`/api/attacker/stream?goal=${encodeURIComponent(goal)}`);

    evtSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.logs) {
        setLogs(prev => [...prev, ...data.logs]);
        data.logs.forEach(l => {
          if (l.includes("Depth")) {
            const d = l.match(/Depth (\d+)/);
            if (d) {
              setCurrentStep(parseInt(d[1]) + 2);
              setLiveStats(prev => ({ ...prev, depth: parseInt(d[1]) }));
            }
          }
          if (l.includes("Stealth:")) {
            const s = parseFloat(l.split("Stealth:")[1]);
            setLiveStats(prev => ({
              ...prev,
              attempts: prev.attempts + 1,
              bestStealth: Math.max(prev.bestStealth, s || 0)
            }));
          }
          if (l.includes("SUCCESS") || l.includes("BREACH")) {
            setCurrentStep(4);
          }
        });
      }

      if (data.nodes) setNodes(prev => [...prev, ...data.nodes]);

      if (data.result) {
        setResult(data.result);
        setIsRunning(false);
        setCurrentStep(4);
        evtSource.close();
        setAttackHistory(prev => [...prev, { id: Date.now(), goal, success: true, payload: data.result.payload, response: data.result.response, time: new Date().toLocaleTimeString() }]);
      }

      if (data.status === 'FAILED' || data.status === 'ERROR') {
        setIsRunning(false);
        evtSource.close();
        setAttackHistory(prev => [...prev, { id: Date.now(), goal, success: false, payload: null, time: new Date().toLocaleTimeString() }]);
      }
    };

    evtSource.onerror = () => {
      setIsRunning(false);
      evtSource.close();
    };
  };

  const resetAttack = () => {
    setNodes([]);
    setResult(null);
    setLogs([]);
    setCurrentStep(0);
    setLiveStats({ depth: 0, attempts: 0, bestStealth: 0.0 });
  };

  const steps = [
    { id: 1, label: "Initialize" },
    { id: 2, label: "Generate" },
    { id: 3, label: "Execute" },
    { id: 4, label: "Report" },
  ];

  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh' }}>

      {/* ========== NAVIGATION ========== */}
      <nav className="nav">
        <div className="nav-brand">
          <div className="nav-logo">
            <Shield size={20} color="white" />
          </div>
          <div>
            <div className="nav-title">AMART</div>
            <div className="nav-subtitle">Red Team Suite</div>
          </div>
        </div>

        <div className="nav-links">
          {['console', 'analytics', 'reports', 'settings'].map(view => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`nav-link ${activeView === view ? 'active' : ''}`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>

        <div className="nav-actions">
          <button onClick={() => setIsDark(!isDark)} className="btn-icon" title="Toggle theme">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {isRunning && <span className="status-live">Live</span>}
        </div>
      </nav>

      {/* ========== MAIN CONTENT ========== */}
      <main style={{ paddingTop: 'calc(var(--nav-height) + 48px)' }}>
        <AnimatePresence mode="wait">

          {/* ===== CONSOLE VIEW ===== */}
          {activeView === 'console' && (
            <motion.div key="console" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* Hero Section */}
              <section className="section" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                  <h1 className="display-hero" style={{ marginBottom: '24px' }}>
                    Automated<br />
                    <span style={{ background: 'linear-gradient(90deg, #ff3b30, #ff6b6b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      Red Teaming
                    </span>
                  </h1>

                  <p className="text-body-large" style={{ maxWidth: '560px', margin: '0 auto 48px' }}>
                    Discover vulnerabilities in your RAG systems before adversaries do.
                  </p>

                  {/* Goal Selection */}
                  <div style={{ maxWidth: '400px', margin: '0 auto 32px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px', textAlign: 'left' }}>
                      Attack Objective
                    </label>
                    <select
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="select-field"
                      disabled={isRunning}
                    >
                      <option>Leak HR Salary Data</option>
                      <option>Extract Customer PII</option>
                      <option>Bypass Access Controls</option>
                      <option>Reveal System Prompts</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                    <button onClick={handleLaunch} disabled={isRunning} className="btn-primary">
                      {isRunning ? <><Zap size={18} /> Running...</> : <><Play size={18} /> Start Audit</>}
                    </button>

                    {(nodes.length > 0 || result) && !isRunning && (
                      <button onClick={resetAttack} className="btn-secondary">
                        <RotateCcw size={16} /> Reset
                      </button>
                    )}
                  </div>
                </div>
              </section>

              {/* Progress Section */}
              {(isRunning || nodes.length > 0) && (
                <section className="section-alt" style={{ padding: '48px 0' }}>
                  <div className="container">
                    <div className="film-strip" style={{ maxWidth: '700px', margin: '0 auto' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                        {steps.map(step => (
                          <div key={step.id} style={{ flex: 1, textAlign: 'center', opacity: currentStep >= step.id ? 1 : 0.3, transition: 'opacity 0.3s' }}>
                            <div style={{
                              width: 40, height: 40, borderRadius: '50%', margin: '0 auto 12px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: currentStep >= step.id ? '#ff3b30' : 'rgba(255,255,255,0.1)',
                              color: 'white', fontWeight: 700, fontSize: 14,
                              transition: 'all 0.3s'
                            }}>
                              {currentStep > step.id ? <CheckCircle2 size={18} /> : step.id}
                            </div>
                            <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{step.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '24px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                      <span>Depth: <strong style={{ color: 'var(--color-text)' }}>{liveStats.depth}</strong></span>
                      <span>Attempts: <strong style={{ color: 'var(--color-text)' }}>{liveStats.attempts}</strong></span>
                      <span>Best Stealth: <strong style={{ color: 'var(--color-text)' }}>{(liveStats.bestStealth * 100).toFixed(0)}%</strong></span>
                    </div>
                  </div>
                </section>
              )}

              {/* Attack Tree */}
              {nodes.length > 0 && (
                <section className="section">
                  <div className="container">
                    <h2 className="display-section" style={{ textAlign: 'center', marginBottom: '48px' }}>Attack Tree</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
                      {nodes.map((node, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`card ${node.status === 'success' ? 'card-success' : node.status === 'active' ? 'card-active' : node.status === 'pruned' ? 'card-muted' : ''}`}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {node.label.startsWith('[IMAGE]') ? <ImageIcon size={14} className="text-purple-500" /> : <FileText size={14} className="text-blue-500" />}
                              <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{node.id}</span>
                            </div>
                            <span className={`badge ${node.status === 'success' ? 'badge-success' : node.status === 'active' ? 'badge-active' : 'badge-muted'}`}>
                              {node.status}
                            </span>
                          </div>
                          <p style={{ fontSize: '14px', lineHeight: 1.6 }}>
                            {node.label.startsWith('[IMAGE]') ? (
                              <span className="italic text-purple-600 dark:text-purple-400">
                                {node.label.replace('[IMAGE]', '📷 Image Input: ')}
                              </span>
                            ) : node.label}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Result */}
              {result && (
                <section style={{ padding: '80px 0', background: 'linear-gradient(180deg, rgba(255,59,48,0.04) 0%, transparent 100%)' }}>
                  <div className="container" style={{ maxWidth: '720px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent)', marginBottom: '16px' }}>
                        <AlertTriangle size={20} />
                        <span style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px' }}>Vulnerability Found</span>
                      </div>
                      <h2 className="display-section">Security Breach</h2>
                    </div>

                    <div className="card" style={{ borderColor: 'var(--color-accent)', borderWidth: '2px' }}>
                      <div style={{ marginBottom: '24px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Successful Payload</label>
                        <p style={{ marginTop: '8px', padding: '16px', borderRadius: '8px', background: 'var(--color-bg-alt)', fontFamily: 'monospace', fontSize: '13px' }}>{result.payload}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Leaked Data</label>
                        <p style={{ marginTop: '8px', padding: '16px', borderRadius: '8px', background: 'rgba(255,59,48,0.06)', border: '1px solid rgba(255,59,48,0.2)', fontFamily: 'monospace', fontSize: '13px' }}>{result.response}</p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Logs */}
              {logs.length > 0 && (
                <section style={{ padding: '48px 0', borderTop: '1px solid var(--color-border)' }}>
                  <div className="container">
                    <details>
                      <summary style={{ cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ChevronRight size={14} /> Developer Logs ({logs.length})
                      </summary>
                      <div style={{ marginTop: '16px', padding: '20px', background: '#0a0a0a', borderRadius: '12px', maxHeight: '200px', overflowY: 'auto' }}>
                        {logs.map((log, i) => <div key={i} style={{ fontFamily: 'monospace', fontSize: '12px', color: '#4ade80', padding: '2px 0' }}>{log}</div>)}
                      </div>
                    </details>
                  </div>
                </section>
              )}
            </motion.div>
          )}

          {/* ===== ANALYTICS VIEW ===== */}
          {activeView === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container section">
              <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
                  <Activity size={28} style={{ color: 'var(--color-accent)' }} />
                  <h1 className="display-section">Security Analytics</h1>
                </div>

                <AnalyticsPage attackHistory={attackHistory} />
              </div>
            </motion.div>
          )}

          {/* ===== REPORTS VIEW ===== */}
          {activeView === 'reports' && (
            <motion.div key="reports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container section">
              <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
                  <BarChart2 size={28} style={{ color: 'var(--color-accent)' }} />
                  <h1 className="display-section">Security Report</h1>
                </div>

                {/* Security Score Hero */}
                <div className="card" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: 'white', marginBottom: '32px', padding: '40px', textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: '8px' }}>Overall Security Score</div>
                  <div style={{
                    fontSize: '80px',
                    fontWeight: 800,
                    background: attackHistory.filter(a => a.success).length === 0 ? 'linear-gradient(135deg, #22c55e, #10b981)' : 'linear-gradient(135deg, #f97316, #ef4444)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1
                  }}>
                    {attackHistory.length > 0 ? Math.round(100 - (attackHistory.filter(a => a.success).length / attackHistory.length) * 100) : 100}
                  </div>
                  <div style={{ fontSize: '16px', marginTop: '8px', opacity: 0.8 }}>
                    {attackHistory.filter(a => a.success).length === 0 ? '🛡️ Excellent Defense' : '⚠️ Vulnerabilities Detected'}
                  </div>

                  {/* Mini Stats Row */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div>
                      <div style={{ fontSize: '28px', fontWeight: 700 }}>{attackHistory.length}</div>
                      <div style={{ fontSize: '12px', opacity: 0.6 }}>Total Tests</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '28px', fontWeight: 700, color: '#ef4444' }}>{attackHistory.filter(a => a.success).length}</div>
                      <div style={{ fontSize: '12px', opacity: 0.6 }}>Breaches</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '28px', fontWeight: 700, color: '#22c55e' }}>{attackHistory.filter(a => !a.success).length}</div>
                      <div style={{ fontSize: '12px', opacity: 0.6 }}>Blocked</div>
                    </div>
                  </div>
                </div>

                {/* Quick Insights */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
                  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Shield size={24} style={{ color: '#22c55e' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Defense Rate</div>
                      <div style={{ fontSize: '24px', fontWeight: 700 }}>{attackHistory.length > 0 ? Math.round((attackHistory.filter(a => !a.success).length / attackHistory.length) * 100) : 100}%</div>
                    </div>
                  </div>
                  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AlertTriangle size={24} style={{ color: '#f97316' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Risk Level</div>
                      <div style={{ fontSize: '24px', fontWeight: 700 }}>{attackHistory.filter(a => a.success).length === 0 ? 'Low' : attackHistory.filter(a => a.success).length <= 2 ? 'Medium' : 'High'}</div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="card" style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={18} style={{ color: '#f59e0b' }} /> Recommendations
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {attackHistory.filter(a => a.success).length > 0 ? (
                      <>
                        <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.06)', borderRadius: '8px', borderLeft: '3px solid #ef4444' }}>
                          <strong>Critical:</strong> Implement stricter input validation to prevent prompt injection attacks.
                        </div>
                        <div style={{ padding: '12px 16px', background: 'rgba(249,115,22,0.06)', borderRadius: '8px', borderLeft: '3px solid #f97316' }}>
                          <strong>Warning:</strong> Review RAG retrieval filters - cross-tenant data leakage detected.
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ padding: '12px 16px', background: 'rgba(34,197,94,0.06)', borderRadius: '8px', borderLeft: '3px solid #22c55e' }}>
                          <strong>Good:</strong> No breaches detected. Continue monitoring with regular red-team audits.
                        </div>
                        <div style={{ padding: '12px 16px', background: 'rgba(59,130,246,0.06)', borderRadius: '8px', borderLeft: '3px solid #3b82f6' }}>
                          <strong>Tip:</strong> Run attacks with different goals to ensure comprehensive coverage.
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Attack History */}
                <h3 style={{ fontWeight: 600, marginBottom: '16px' }}>Attack History</h3>
                {attackHistory.length === 0 ? (
                  <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                    <FileText size={48} style={{ color: 'var(--color-text-muted)', opacity: 0.3, marginBottom: '16px' }} />
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>No attacks run yet.</p>
                    <button onClick={() => setActiveView('console')} className="btn-primary" style={{ margin: '0 auto' }}>
                      <Play size={16} /> Start First Audit
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {attackHistory.map(attack => (
                      <details key={attack.id} className="card" style={{ borderLeft: `4px solid ${attack.success ? '#ff3b30' : '#22c55e'}`, cursor: 'pointer' }}>
                        <summary style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', listStyle: 'none' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                              <span className={`badge`} style={{ background: attack.success ? 'rgba(255,59,48,0.1)' : 'rgba(34,197,94,0.1)', color: attack.success ? '#ff3b30' : '#22c55e' }}>
                                {attack.success ? 'Breach' : 'Blocked'}
                              </span>
                              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{attack.time}</span>
                            </div>
                            <p style={{ fontWeight: 600 }}>{attack.goal}</p>
                          </div>
                          <ChevronRight size={16} style={{ color: 'var(--color-text-muted)', transition: 'transform 0.2s' }} className="details-chevron" />
                        </summary>

                        {/* Expanded Content */}
                        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
                          {attack.success && attack.payload ? (
                            <>
                              <div style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Successful Payload</label>
                                <p style={{ marginTop: '8px', padding: '12px', borderRadius: '8px', background: 'var(--color-bg-alt)', fontFamily: 'monospace', fontSize: '13px' }}>{attack.payload}</p>
                              </div>
                              {attack.response && (
                                <div>
                                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Leaked Data</label>
                                  <p style={{ marginTop: '8px', padding: '12px', borderRadius: '8px', background: 'rgba(255,59,48,0.06)', border: '1px solid rgba(255,59,48,0.2)', fontFamily: 'monospace', fontSize: '13px' }}>{attack.response}</p>
                                </div>
                              )}
                            </>
                          ) : (
                            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Attack was blocked. No vulnerabilities detected for this attempt.</p>
                          )}
                        </div>
                      </details>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ===== SETTINGS VIEW ===== */}
          {activeView === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container section">
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
                  <Settings size={28} style={{ color: 'var(--color-accent)' }} />
                  <h1 className="display-section">Settings</h1>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="card">
                    <h3 style={{ fontWeight: 600, marginBottom: '20px' }}>Appearance</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontWeight: 500 }}>Dark Mode</p>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Switch between light and dark themes</p>
                      </div>
                      <button
                        onClick={() => setIsDark(!isDark)}
                        style={{ width: 52, height: 32, borderRadius: 16, border: 'none', cursor: 'pointer', background: isDark ? 'var(--color-accent)' : 'var(--color-border)', position: 'relative', transition: 'background 0.2s' }}
                      >
                        <div style={{ width: 26, height: 26, borderRadius: 13, background: 'white', position: 'absolute', top: 3, left: isDark ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}></div>
                      </button>
                    </div>
                  </div>

                  <div className="card">
                    <h3 style={{ fontWeight: 600, marginBottom: '20px' }}>About</h3>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>AMART-RAG v2.1.0</p>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Built for security professionals.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer style={{ padding: '32px 0', borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>AMART-RAG Red Team Suite</p>
      </footer>
    </div>
  );
}

export default App;
