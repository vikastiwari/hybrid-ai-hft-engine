import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, TrendingUp, Zap, BarChart3, 
  Terminal, ShieldAlert, Cpu, Search, Bell, Settings, User, ServerOff, Sparkles, X, CheckCircle2, LogOut,
  CreditCard, Shield, ToggleLeft, ToggleRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// --- COMPONENTS ---

const TelemetryTab = ({ pnl, inventory, logs, isConnected, confidence }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Mark-to-Market PnL</p>
        <h2 style={{ fontSize: '2rem', color: pnl >= 10000 ? '#00ff9d' : '#ff003c' }}>
          ${pnl.toFixed(2)}
        </h2>
      </div>
      
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Net Inventory</p>
        <h2 style={{ fontSize: '2rem', color: inventory === 0 ? 'var(--text-main)' : inventory > 0 ? '#00ff9d' : '#ff003c' }}>
          {inventory} AAPL
        </h2>
      </div>
      
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>PPO Model Confidence</p>
        <h2 style={{ fontSize: '2rem', color: 'var(--accent-purple)' }}>
          {confidence.toFixed(1)}%
        </h2>
      </div>
    </div>

    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Terminal size={18} color="var(--accent-cyan)" />
        <h3 style={{ fontSize: '1rem', margin: 0 }}>C++ Engine UDP Stream</h3>
      </div>
      
      <div style={{ padding: '1rem', overflowY: 'auto', flex: 1, maxHeight: '400px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
        <AnimatePresence>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                marginBottom: '0.5rem',
                color: log.type === 'buy' ? '#00ff9d' : log.type === 'sell' ? '#ff00e5' : 'var(--text-muted)'
              }}
            >
              <span style={{ opacity: 0.5, marginRight: '1rem' }}>[{log.time}]</span>
              {log.text}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {!isConnected && (
          <div style={{ color: '#ff1744', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <ShieldAlert size={16} /> Waiting for Java Orchestrator (Port 8080)...
          </div>
        )}
      </div>
    </div>
  </div>
);

const OrderBookTab = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const generateBook = () => Array.from({length: 40}, (_, i) => {
      const price = 150.0 - 1.0 + (i * 0.05);
      const bidBase = price <= 150.0 ? 500 - ((150.0 - price) * 400) : null;
      const askBase = price >= 150.0 ? 500 - ((price - 150.0) * 400) : null;
      
      return {
        price: price.toFixed(2),
        bidDepth: bidBase ? Math.floor(bidBase + (Math.random() * 50 - 25)) : null,
        askDepth: askBase ? Math.floor(askBase + (Math.random() * 50 - 25)) : null
      };
    });
    
    setData(generateBook());
    const interval = setInterval(() => setData(generateBook()), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel" style={{ padding: '2rem', minHeight: '500px' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <BarChart3 color="var(--accent-cyan)" /> Level 2 Depth of Market
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Cumulative market depth visualizing liquidity walls.</p>
      <div style={{ width: '100%', height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="price" stroke="var(--text-muted)" />
            <YAxis stroke="var(--text-muted)" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(10, 10, 20, 0.9)', borderColor: 'var(--border-subtle)' }}
              itemStyle={{ color: 'var(--text-main)' }}
            />
            <Area type="stepAfter" dataKey="bidDepth" stroke="#00ff9d" fill="url(#colorBids)" fillOpacity={0.5} connectNulls={false} isAnimationActive={false} />
            <Area type="stepBefore" dataKey="askDepth" stroke="#ff003c" fill="url(#colorAsks)" fillOpacity={0.5} connectNulls={false} isAnimationActive={false} />
            <defs>
              <linearGradient id="colorBids" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00ff9d" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorAsks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff003c" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ff003c" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const BrainTab = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    let episode = 0;
    let reward = -50;
    let entropy = 2.0;
    
    const generateData = () => {
      episode += 100;
      reward = Math.min(100, reward + (Math.random() * 5));
      entropy = Math.max(0.1, entropy - (Math.random() * 0.05));
      
      return { episode, reward, entropy };
    };
    
    const initialData = Array.from({length: 20}, generateData);
    setData(initialData);
    
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1), generateData()];
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel" style={{ padding: '2rem', minHeight: '500px' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Cpu color="var(--accent-cyan)" /> Stable-Baselines3 PPO Analytics
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ height: '300px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Cumulative Reward Curve</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="episode" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(10, 10, 20, 0.9)', borderColor: 'var(--border-subtle)' }} />
              <Area type="monotone" dataKey="reward" stroke="#00ff9d" fill="#00ff9d" fillOpacity={0.2} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ height: '300px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Policy Entropy</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="episode" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(10, 10, 20, 0.9)', borderColor: 'var(--border-subtle)' }} />
              <Area type="monotone" dataKey="entropy" stroke="#ff00e5" fill="#ff00e5" fillOpacity={0.2} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const EngineTab = ({ latency }) => (
  <div className="glass-panel" style={{ padding: '2rem', minHeight: '500px' }}>
    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Zap color="var(--accent-cyan)" /> C++ Execution Core Diagnostics
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>System Latency Breakdown</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[['Network Tx (TCPDirect)', `${latency} ms`, '#007bff'],
            ['Order Book Rebuild', '1.20 us', '#007bff'],
            ['Zero-Copy Panama Read', '0.08 us', '#007bff'],
            ['ONNX GPU Inference', '120.5 us', '#ff003c']].map(([label, val, color]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
              <span>{label}</span>
              <strong style={{ color }}>{val}</strong>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>ZGC Memory Pipeline</h3>
        <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
          <p style={{ marginBottom: '0.5rem' }}><strong>Arena.ofShared()</strong> mapped correctly</p>
          <p style={{ marginBottom: '0.5rem' }}><strong>LOB Memory Footprint:</strong> 16.0 KB</p>
          <p style={{ marginBottom: '0.5rem' }}><strong>JVM ZGC Pause Time:</strong> ~0.01 ms</p>
          <div style={{ marginTop: '1rem', height: '4px', background: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '15%', background: 'var(--accent-cyan)' }}></div>
          </div>
          <p style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>15% Allocated</p>
        </div>
      </div>
    </div>
  </div>
);

const RiskTab = ({ onPanic, isPanic }) => {
  const [maxInv, setMaxInv] = useState(5000);
  const [stopLoss, setStopLoss] = useState(25000);

  return (
    <div className="glass-panel" style={{ padding: '2rem', minHeight: '500px' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ShieldAlert color={isPanic ? "#ff003c" : "var(--accent-cyan)"} /> Risk Management Controls
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '600px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--text-muted)' }}>Max Net Inventory (Shares)</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input type="number" value={maxInv} onChange={(e) => setMaxInv(e.target.value)} className="search-bar" style={{ flex: 1, padding: '0.75rem', background: 'rgba(0,0,0,0.2)' }} disabled={isPanic} />
            <button className="btn-primary" disabled={isPanic}>Apply</button>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--text-muted)' }}>Daily Stop Loss ($)</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input type="number" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} className="search-bar" style={{ flex: 1, padding: '0.75rem', background: 'rgba(0,0,0,0.2)' }} disabled={isPanic} />
            <button className="btn-primary" disabled={isPanic}>Apply</button>
          </div>
        </div>
        
        <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '1rem 0' }}></div>
        
        <button 
          className="btn-primary" 
          disabled={isPanic}
          style={{ 
            padding: '1.5rem', 
            background: isPanic ? 'rgba(255, 0, 60, 0.4)' : 'rgba(255, 0, 60, 0.1)', 
            borderColor: '#ff003c', 
            color: isPanic ? '#fff' : '#ff003c', 
            fontWeight: 'bold', 
            fontSize: '1.2rem', 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '1rem',
            boxShadow: isPanic ? '0 0 30px rgba(255, 0, 60, 0.5)' : 'none',
            cursor: isPanic ? 'not-allowed' : 'pointer'
          }} 
          onClick={onPanic}
        >
          <ShieldAlert size={24} /> 
          {isPanic ? "MARKET DUMP IN PROGRESS..." : "PANIC: FLATTEN ALL POSITIONS"}
        </button>
      </div>
    </div>
  );
};

const DropdownItem = ({ icon, title, desc, color, onClick }) => (
  <div onClick={onClick} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', cursor: 'pointer', borderRadius: '6px', transition: 'background 0.2s ease' }}>
    <div style={{ marginTop: '2px', color: color || 'var(--text-muted)' }}>{icon}</div>
    <div>
      <div style={{ fontSize: '0.9rem', fontWeight: '500', color: color || 'var(--text-main)', marginBottom: desc ? '4px' : '0' }}>{title}</div>
      {desc && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{desc}</div>}
    </div>
  </div>
);

const ToggleSetting = ({ label, desc, isOn, onToggle, color = 'var(--accent-cyan)' }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-dark)', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border-subtle)' }} onClick={onToggle}>
    <div>
      <div style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: '500' }}>{label}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{desc}</div>
    </div>
    <div style={{ color: isOn ? color : 'var(--text-muted)', transition: 'color 0.2s' }}>
      {isOn ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
    </div>
  </div>
);

const GlobalModal = ({ isOpen, onClose, type, theme, setTheme }) => {
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(true);
  const [toggle3, setToggle3] = useState(false);

  if (!isOpen) return null;

  const contentMap = {
    preferences: {
      icon: <Settings size={28} color="var(--accent-cyan)" />,
      title: "Global Preferences",
      desc: "Configure your interface layout and theming",
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: '500' }}>UI Theme</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Select your preferred visual style</div>
            </div>
            <select 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              style={{ padding: '8px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px', cursor: 'pointer', outline: 'none' }}
            >
              <option value="dark">Dark Mode (Default)</option>
              <option value="light">Light Mode</option>
              <option value="amoled">AMOLED Pitch Black</option>
              <option value="cyberpunk">Cyberpunk Neon</option>
            </select>
          </div>
          <ToggleSetting label="Compact Dashboard Layout" desc="Increase data density on charts" isOn={toggle1} onToggle={() => setToggle1(!toggle1)} />
          <ToggleSetting label="Haptic Feedback (Mobile)" desc="Vibrate on orchestrator state change" isOn={toggle2} onToggle={() => setToggle2(!toggle2)} />
          <ToggleSetting label="UI Sound Effects" desc="Enable sonic feedback for interactions" isOn={toggle3} onToggle={() => setToggle3(!toggle3)} />
        </div>
      )
    },
    performance: {
      icon: <Activity size={28} color="var(--accent-magenta)" />,
      title: "Performance Tuning",
      desc: "Hardware acceleration & WebGL settings",
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
          <ToggleSetting label="Hardware Acceleration (WebGL)" desc="Offload Recharts compute to GPU" isOn={toggle1} onToggle={() => setToggle1(!toggle1)} color="var(--accent-magenta)" />
          <ToggleSetting label="60FPS WebSocket Rendering" desc="Smooth out the UDP latency strings" isOn={toggle2} onToggle={() => setToggle2(!toggle2)} color="var(--accent-magenta)" />
          <ToggleSetting label="Background Thread Processing" desc="Allow buffer arrays to calculate off-screen" isOn={toggle3} onToggle={() => setToggle3(!toggle3)} color="var(--accent-magenta)" />
        </div>
      )
    },
    profile: {
      icon: <User size={28} color="#00ff9d" />,
      title: "Admin Profile",
      desc: "Manage your credentials and security",
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(138, 43, 226, 0.4)' }}>
              <Shield size={32} color="white" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>Vikas T.</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Level 4 Clearance • Last login: 2 min ago</p>
            </div>
          </div>
          <ToggleSetting label="Two-Factor Authentication" desc="Require Yubikey for HFT core modifications" isOn={toggle1} onToggle={() => setToggle1(!toggle1)} color="#00ff9d" />
        </div>
      )
    },
    billing: {
      icon: <CreditCard size={28} color="var(--accent-cyan)" />,
      title: "Billing & Plans",
      desc: "FinOps overview and usage limits",
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
          <div style={{ padding: '1.5rem', background: 'var(--bg-dark)', border: '1px solid var(--accent-cyan)', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
            <motion.div 
              animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', top: '-50%', right: '-20%', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, transparent 70%)' }}
            />
            <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} /> Enterprise Quant Plan Active
            </h3>
            <p style={{ color: 'var(--text-main)' }}>Unlimited Order Book Rebuilds</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Renews in 14 days</p>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Monthly Exchange Data Fees</span>
            <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>$1,200.00</span>
          </div>
        </div>
      )
    }
  };

  const config = contentMap[type] || contentMap.preferences;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(15px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-panel"
          style={{ width: '90%', maxWidth: '500px', padding: '2.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-active)', boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(0, 240, 255, 0.15)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                {config.icon}
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>{config.title}</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{config.desc}</p>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px' }}>
              <X size={24} />
            </button>
          </div>
          
          <div style={{ height: '1px', background: 'var(--border-subtle)', width: '100%', marginBottom: '1.5rem' }}></div>

          {config.render()}

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="btn-primary" onClick={onClose}
            >
              Done
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('telemetry');
  const [logs, setLogs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [pnl, setPnl] = useState(10000.00);
  const [inventory, setInventory] = useState(0);
  const [confidence, setConfidence] = useState(94.2);
  const [latency, setLatency] = useState("0.14");
  
  // Theme State
  const [theme, setTheme] = useState('cyberpunk');

  // TopNav States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState('');
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('preferences');

  // Panic State
  const [isPanic, setIsPanic] = useState(false);

  const navRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsAlertsOpen(false);
        setIsSettingsOpen(false);
        setIsAdminOpen(false);
        setIsSearching(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dynamic Confidence & Latency Simulator (Fix for NaN issue via parseFloat)
  useEffect(() => {
    const interval = setInterval(() => {
      setConfidence(prev => Math.min(99.9, Math.max(85.0, prev + (Math.random() * 2 - 1))));
      setLatency(prev => (Math.max(0.10, parseFloat(prev) + (Math.random() * 0.04 - 0.02))).toFixed(2));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Connect to Java Spring Boot WebSocket Server
  useEffect(() => {
    const connectWS = () => {
      const ws = new WebSocket('ws://localhost:8080/ws');
      
      ws.onopen = () => setIsConnected(true);
      ws.onclose = () => {
        setIsConnected(false);
        setTimeout(connectWS, 2000);
      };
      
      ws.onmessage = (event) => {
        const data = event.data;
        const newLog = {
          id: Date.now() + Math.random(),
          time: new Date().toISOString().split('T')[1].slice(0, -1),
          text: data,
          type: data.includes('SELL') ? 'sell' : data.includes('BUY') ? 'buy' : 'info'
        };
        
        setLogs(prev => [...prev.slice(-49), newLog]);

        if (isPanic) return; // Halt automated trading if panic is active

        if (data.includes('BUY')) {
          setInventory(prev => prev + 100);
          setPnl(prev => prev - 15.50);
        } else if (data.includes('SELL')) {
          setInventory(prev => prev - 100);
          setPnl(prev => prev + 18.25);
        }
      };
      return ws;
    };

    const ws = connectWS();
    return () => ws.close();
  }, [isPanic]);

  // Theme setup
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      setIsSearching(true);
      setGeminiResponse('');
      
      const targetResponse = "Analyzing execution logs... No latency anomalies detected. The Java Panama FFM zero-copy buffer is perfectly aligned with the C++ LOB.";
      
      setGeminiResponse(targetResponse.charAt(0));
      let i = 1;
      const interval = setInterval(() => {
        setGeminiResponse(prev => targetResponse.substring(0, i + 1));
        i++;
        if (i >= targetResponse.length) {
          clearInterval(interval);
        }
      }, 30);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
    setIsSettingsOpen(false);
    setIsAdminOpen(false);
    setIsAlertsOpen(false);
  };

  const triggerPanic = () => {
    setIsPanic(true);
    setInventory(0);
    setLogs(prev => [...prev.slice(-49), { id: Date.now(), time: new Date().toISOString().split('T')[1].slice(0, -1), text: "🚨 PANIC: ALL POSITIONS FLATTENED. TRADING HALTED. 🚨", type: 'sell' }]);
    setTimeout(() => {
      alert("Emergency Risk Mitigation Successful. Inventory is 0. Trading Engine is locked.");
    }, 500);
  };

  // --- RENDER ---

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar" style={{ width: '250px', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
          <Activity color="var(--accent-cyan)" size={28} />
          <h2 style={{ fontSize: '1.2rem', margin: 0 }} className="gradient-text">Quant Core</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { id: 'telemetry', icon: Terminal, label: 'Live Telemetry' },
            { id: 'orderbook', icon: BarChart3, label: 'Order Book' },
            { id: 'brain', icon: Cpu, label: 'DRL Brain' },
            { id: 'engine', icon: Zap, label: 'C++ Engine' },
            { id: 'risk', icon: ShieldAlert, label: 'Risk Limits' },
          ].map(tab => (
            <button 
              key={tab.id}
              className="btn-primary" 
              onClick={() => setActiveTab(tab.id)}
              style={{ 
                justifyContent: 'flex-start', 
                background: activeTab === tab.id ? 'rgba(0, 240, 255, 0.1)' : 'transparent', 
                borderColor: activeTab === tab.id ? 'var(--accent-cyan)' : 'transparent', 
                color: activeTab === tab.id ? 'var(--accent-cyan)' : 'var(--text-muted)' 
              }}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <div className={`status-dot ${isConnected ? 'status-active' : 'status-error'}`} />
            {isConnected ? 'IPC Link Active' : 'Connecting...'}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        
        {/* Dynamic TopNav based on AI Studio */}
        <header className="topnav" ref={navRef} style={{ zIndex: 100 }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              className="search-bar" 
              placeholder="Ask Gemini Lite..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              style={{ width: '300px', transition: 'width 0.3s ease' }}
              onFocus={(e) => e.target.style.width = '400px'}
              onBlur={(e) => e.target.style.width = '300px'}
            />
            <Sparkles size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-cyan)' }} />
            
            <AnimatePresence>
              {isSearching && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="glass-panel"
                  style={{ 
                    position: 'absolute', top: '50px', left: 0, width: '400px', 
                    padding: '1.5rem', zIndex: 100, border: '1px solid var(--accent-cyan)' 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={16} /> Gemini Lite (Fast)
                    </h3>
                    <button onClick={() => setIsSearching(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <X size={16} />
                    </button>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                    {geminiResponse}
                    <span className="blink-cursor">|</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="glass-panel" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                Latency: <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{latency} ms</span>
              </div>
            </div>
            
            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => { setIsAlertsOpen(!isAlertsOpen); setIsSettingsOpen(false); setIsAdminOpen(false); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', position: 'relative' }}
              >
                <Bell size={20} />
                <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: 'var(--accent-magenta)', borderRadius: '50%' }}></span>
              </button>
              <AnimatePresence>
                {isAlertsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="glass-panel" style={{ position: 'absolute', top: '40px', right: '-50px', width: '250px', padding: '0.5rem', zIndex: 100 }}
                  >
                    <DropdownItem icon={<CheckCircle2 color="#00ff9d" size={16} />} title="System Online" desc="ZGC properly initialized." />
                    <DropdownItem icon={<ShieldAlert color="#ff003c" size={16} />} title="Risk Alert" desc="Inventory approaching 5000." />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Settings */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => { setIsSettingsOpen(!isSettingsOpen); setIsAlertsOpen(false); setIsAdminOpen(false); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
              >
                <Settings size={20} />
              </button>
              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="glass-panel" style={{ position: 'absolute', top: '40px', right: '-50px', width: '250px', padding: '0.5rem', zIndex: 100 }}
                  >
                    <DropdownItem icon={<Settings size={16} />} title="Preferences" desc="App layout & styling" onClick={() => openModal('preferences')} />
                    <DropdownItem icon={<Activity size={16} />} title="Performance" desc="Toggle WebGL acceleration" onClick={() => openModal('performance')} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }}></div>
            
            {/* Admin Menu */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => { setIsAdminOpen(!isAdminOpen); setIsSettingsOpen(false); setIsAlertsOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', background: 'transparent', border: 'none', color: 'var(--text-main)' }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} color="#fff" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Vikas T.</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Admin</span>
                </div>
              </button>
              <AnimatePresence>
                {isAdminOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="glass-panel" style={{ position: 'absolute', top: '50px', right: 0, width: '200px', padding: '0.5rem', zIndex: 100 }}
                  >
                    <DropdownItem icon={<User size={16} />} title="My Profile" onClick={() => openModal('profile')} />
                    <DropdownItem icon={<CreditCard size={16} />} title="Billing & Plans" onClick={() => openModal('billing')} />
                    <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }}></div>
                    <DropdownItem icon={<LogOut size={16} color="#ff003c" />} title="Logout" color="#ff003c" onClick={() => alert("System shutdown initiated.")} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Connection Warning Banner */}
        {!isConnected && (
          <div style={{ background: 'rgba(255, 0, 60, 0.1)', borderBottom: '1px solid rgba(255, 0, 60, 0.3)', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ff003c', fontSize: '0.9rem' }}>
            <ServerOff size={16} /> 
            <strong>Backend Offline:</strong> Telemetry WebSocket disconnected. Please execute <code>./run_system.sh</code> in your terminal to start the C++ Execution Engine and Java Orchestrator.
          </div>
        )}

        {/* Emergency Panic Banner */}
        <AnimatePresence>
          {isPanic && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }} 
              className="glass-panel"
              style={{ background: 'rgba(255, 0, 60, 0.2)', borderLeft: '4px solid #ff003c', borderRadius: 0, padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#ff003c' }}
            >
              <ShieldAlert size={24} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>SYSTEM HALTED: PANIC MODE ACTIVE</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)' }}>All active strategies have been suspended. Inventory has been aggressively flattened to 0. Manual intervention required to unlock execution core.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="content-area">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'telemetry' && <TelemetryTab pnl={pnl} inventory={inventory} logs={logs} isConnected={isConnected} confidence={confidence} />}
              {activeTab === 'orderbook' && <OrderBookTab />}
              {activeTab === 'brain' && <BrainTab />}
              {activeTab === 'engine' && <EngineTab latency={latency} />}
              {activeTab === 'risk' && <RiskTab onPanic={triggerPanic} isPanic={isPanic} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      <GlobalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} type={modalType} theme={theme} setTheme={setTheme} />
    </div>
  );
}

export default App;
