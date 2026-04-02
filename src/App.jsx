import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Terminal as TerminalIcon, 
  Fingerprint, 
  Eye, 
  Mail, 
  Linkedin, 
  Github, 
  Radio, 
  ShieldAlert, 
  Cpu,
  Code,
  Info,
  X,
  Radar,
  Crosshair,
  Globe,
  Briefcase,
  ChevronRight,
  Target,
  Search,
  Activity,
  Shield,
  BookOpen,
  Satellite,
  Sparkles,
  Zap,
  AlertTriangle,
  Terminal,
  FileCode,
  Layout,
  Server,
  Database
} from 'lucide-react';

// --- API Utilities ---
const apiKey = ""; // Environment handles this

const callGemini = async (prompt, systemInstruction = "") => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
  };

  let delay = 1000;
  for (let i = 0; i < 5; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
    } catch (err) {
      if (i === 4) throw err;
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
};

// --- Typewriter Hook ---
const useTypewriter = (text, speed = 15, delay = 0) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setIsComplete(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayedText, isComplete };
};

// --- Text Scramble Hook ---
const useScramble = (text, active = true, speed = 40) => {
  const [display, setDisplay] = useState(text);
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  
  useEffect(() => {
    if (!active) return;
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(prev => 
        text.split("").map((char, index) => {
          if (index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1/3;
    }, speed);
    return () => clearInterval(interval);
  }, [text, active]);

  return display;
};

// --- Components ---
const ScrambleText = ({ text, className }) => {
  const [trigger, setTrigger] = useState(false);
  const scrambled = useScramble(text, trigger);
  return (
    <span 
      className={className} 
      onMouseEnter={() => setTrigger(true)}
      onMouseLeave={() => setTrigger(false)}
      onTouchStart={() => setTrigger(true)}
    >
      {trigger ? scrambled : text}
    </span>
  );
};

const LoadingScreen = ({ onComplete }) => {
  const [percent, setPercent] = useState(0);
  const [status, setStatus] = useState("INITIALIZING BOOT_SEQUENCE...");
  
  useEffect(() => {
    const statuses = [
      "ESTABLISHING SECURE_TUNNEL...",
      "DECRYPTING ASSET_LEDGER...",
      "LOADING TELEMETRY_GRID...",
      "BYPASSING FIREWALL...",
      "ACCESS_GRANTED: VIVEK_PATEL"
    ];
    
    const interval = setInterval(() => {
      setPercent(prev => {
        const next = prev + Math.floor(Math.random() * 15) + 1;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return 100;
        }
        setStatus(statuses[Math.floor((next / 100) * statuses.length)]);
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#010302] z-[999] flex flex-col items-center justify-center font-mono p-6">
      <div className="w-full max-w-xs space-y-4">
        <div className="flex justify-between text-[10px] text-emerald-500 font-black tracking-widest">
          <span className="animate-pulse">DECRYPTING_IDENTITY</span>
          <span>{percent}%</span>
        </div>
        <div className="h-1 w-full bg-emerald-950 overflow-hidden relative border border-emerald-900/30">
          <div 
            className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981] transition-all duration-300 ease-out" 
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="text-[8px] text-emerald-800 font-bold uppercase tracking-[0.2em] h-4 text-center">
          {status}
        </div>
      </div>
      <div className="absolute inset-0 bg-scanline opacity-5 pointer-events-none" />
    </div>
  );
};

const INTEL_DB = {
  "Wireshark": "Network protocol analyzer used for deep-packet inspection and traffic forensics.",
  "Python": "High-level language used for automation, log parsing, and custom security tooling.",
  "MITRE ATT&CK": "A globally-accessible knowledge base of adversary tactics and techniques based on real-world observations.",
  "SIEM": "Security Information and Event Management; central hub for log aggregation and alert correlation.",
  "MS Defender XDR": "Extended Detection and Response platform for unified endpoint and identity security."
};

const IntelLink = ({ name }) => {
  const [show, setShow] = useState(false);
  const intel = INTEL_DB[name] || "Technical asset analyzed in security operations.";

  return (
    <div className="relative inline-block group" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onClick={() => setShow(!show)}>
      <span className="text-emerald-400 font-bold underline decoration-emerald-500/30 decoration-dashed underline-offset-4 cursor-help transition-colors hover:text-emerald-300">
        {name}
      </span>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 sm:w-48 z-[60] animate-intel-pop pointer-events-none">
          <div className="bg-[#051109] border border-emerald-500/50 p-2 rounded shadow-[0_0_20px_rgba(16,185,129,0.2)] backdrop-blur-md">
            <div className="flex items-center gap-1.5 mb-1 border-b border-emerald-500/20 pb-1">
              <Info size={10} className="text-emerald-500" />
              <span className="text-[8px] font-black uppercase text-emerald-500 tracking-widest">Intel_Brief</span>
            </div>
            <div className="text-[9px] text-emerald-100/80 italic leading-tight normal-case font-normal">
              {intel}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const KaliTerminal = ({ onClose }) => {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef(null);

  const initialMsg = `
  \x1b[38;5;46m[SYSTEM_BOOT_SUCCESS]\x1b[0m
  LOAD_MODULE: DEFENSIVE_GRID_v4.2
  LOAD_MODULE: NETWORK_TELEMETRY_ENGINE
  
  Status: \x1b[38;5;46mLISTENING_ON_ALL_INTERFACES\x1b[0m
  Type 'help' for operational commands.
  Type '✨ ask <question>' to query the Security Intelligence.
  `;

  useEffect(() => {
    setHistory([initialMsg]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const processCommand = async (cmd) => {
    const cleanCmd = cmd.toLowerCase().trim();
    if (!cleanCmd) return;
    setHistory(prev => [...prev, `\n\x1b[38;5;46m➜\x1b[0m \x1b[1m/root\x1b[0m $ ${cmd}`]);
    setIsProcessing(true);

    if (cleanCmd.startsWith('ask ') || cleanCmd.startsWith('✨')) {
      const query = cleanCmd.replace(/^ask |^✨/, '').trim();
      try {
        const response = await callGemini(query, "You are a helpful cybersecurity SOC analyst terminal assistant. Provide concise, technical answers suitable for a terminal output.");
        setHistory(prev => [...prev, `\n\x1b[38;5;46m[INTELLIGENCE_CORE]:\x1b[0m\n${response}`]);
      } catch (err) {
        setHistory(prev => [...prev, `\x1b[31m[!] Error connecting to intelligence core.\x1b[0m`]);
      }
    } else {
      switch (cleanCmd) {
        case 'help':
          setHistory(prev => [...prev, "DEFENSIVE_TOOLKIT:\n  status     - System health check\n  clear      - Reset buffer\n  ask <txt>  - ✨ AI Security Assistant"]);
          break;
        case 'status':
          setHistory(prev => [...prev, "SYSTEM_UPTIME: 14h 22m\nTELEMETRY_STATUS: CONNECTED\nACTIVE_THREATS: 0"]);
          break;
        case 'clear':
          setHistory([initialMsg]);
          break;
        default:
          setHistory(prev => [...prev, `\x1b[31m[!] Error: Command '${cleanCmd}' not recognized.\x1b[0m`]);
      }
    }
    setIsProcessing(false);
    setInput("");
  };

  return (
    <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 sm:left-auto sm:right-0 sm:w-[500px] bg-[#020503] border-t-2 border-emerald-900/50 h-[50vh] sm:h-[450px] flex flex-col font-mono text-[11px] z-[150] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] animate-slide-up overflow-hidden">
      <div className="px-4 py-2 bg-[#051109] border-b border-emerald-500/10 flex justify-between items-center">
        <div className="flex items-center gap-4">
           <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
           </div>
           <span className="text-emerald-500/80 font-black text-[9px] tracking-widest flex items-center gap-2">
             <TerminalIcon size={12}/> SECURE_SHELL@VIVEK_SOC
           </span>
        </div>
        <button onClick={onClose} className="hover:text-red-500 text-emerald-500/20 transition-colors"><X size={14}/></button>
      </div>
      
      <div className="flex flex-1 min-h-0">
        <div ref={scrollRef} className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar text-emerald-400/90 leading-relaxed bg-[#020402]">
          {history.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap">
              {line.split('\x1b').map((part, pi) => {
                if (pi === 0) return part;
                if (part.startsWith('[31m')) return <span key={pi} className="text-red-500">{part.slice(4)}</span>;
                if (part.startsWith('[38;5;46m')) return <span key={pi} className="text-emerald-400 font-bold">{part.split('m')[1]}</span>;
                if (part.startsWith('[0m')) return part.split('m')[1];
                return part;
              })}
            </div>
          ))}
          {!isProcessing && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-emerald-500 font-black">➜</span>
              <span className="text-emerald-500 font-black">$</span>
              <input 
                className="bg-transparent border-none outline-none text-emerald-100 flex-1 caret-emerald-500 font-bold" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && processCommand(input)} 
                autoFocus 
              />
            </div>
          )}
          {isProcessing && <div className="text-emerald-500 animate-pulse mt-2">PROCESSING_REQUEST...</div>}
        </div>
      </div>
    </div>
  );
};

const WindowFrame = ({ title, children, active, subtitle }) => (
  <div className={`relative bg-[#030704]/90 backdrop-blur-md border ${active ? 'border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.05)]' : 'border-emerald-900/20'} flex flex-col h-full rounded-sm overflow-hidden transition-all duration-500 animate-reveal`}>
    <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.03] z-50" />
    <div className="flex justify-between items-center px-4 py-1.5 bg-emerald-950/40 border-b border-emerald-900/30">
      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-500/80 font-black flex items-center gap-2">
        <div className={`w-1 h-1 rounded-full ${active ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-900'}`} />
        <ScrambleText text={title} />
      </span>
      {subtitle && <span className="hidden sm:inline text-[8px] text-emerald-700 font-bold uppercase">{subtitle}</span>}
    </div>
    <div className="relative flex-1 p-4 sm:p-6 overflow-visible">{children}</div>
  </div>
);

const ThreatAnalyzer = () => {
  const [logInput, setLogInput] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeThreat = async () => {
    if (!logInput.trim()) return;
    setLoading(true);
    setAnalysis("");
    try {
      const response = await callGemini(
        logInput,
        "You are an expert SOC Level 2 Analyst. The user will provide a log snippet or a description of a security event. Analyze it technically: identify potential tactics/techniques (referencing MITRE ATT&CK if possible), assess risk level (Low/Medium/High/Critical), and provide 3 clear remediation steps. Keep formatting clean and use bullet points."
      );
      setAnalysis(response);
    } catch (err) {
      setAnalysis("Error: Failed to connect to Analysis Engine. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          value={logInput}
          onChange={(e) => setLogInput(e.target.value)}
          placeholder="Paste log snippet or security observation here..."
          className="w-full h-24 bg-[#010302] border border-emerald-700/50 rounded p-3 text-[11px] text-emerald-100 placeholder:text-emerald-700/50 focus:border-emerald-500/50 outline-none resize-none custom-scrollbar"
        />
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
           <button 
             onClick={analyzeThreat}
             disabled={loading || !logInput}
             className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded text-emerald-500 font-black text-[9px] uppercase tracking-widest disabled:opacity-30 transition-all"
           >
             {loading ? <Zap size={12} className="animate-spin" /> : <Sparkles size={12} />}
             ✨ Run Analysis
           </button>
        </div>
      </div>

      {(analysis || loading) && (
        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded animate-reveal">
          <div className="flex items-center gap-2 mb-3 border-b border-emerald-500/10 pb-2">
            <AlertTriangle size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Analysis_Report</span>
          </div>
          <div className="text-[11px] text-emerald-100/70 whitespace-pre-wrap leading-relaxed">
            {analysis || "INITIALIZING THREAT_ENGINE..."}
          </div>
        </div>
      )}
    </div>
  );
};

const Overview = () => {
  const bio = "I am a cybersecurity-focused Computer Science student specializing in defensive security, threat detection, and incident response. I work with security telemetry from endpoints, networks, and identity systems to detect malicious activity, investigate alerts, and improve organizational security posture. My work is centered around SOC operations, not offensive hacking.";
  const { displayedText: typedBio } = useTypewriter(bio, 10, 300);

  return (
    <div className="flex flex-col gap-6 pb-6">
      <WindowFrame title="01_OPERATIONAL_STATUS" active={true} subtitle="Core_Identity">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-tight overflow-hidden">
                 <span className="inline-block px-1 animate-slide-up-reveal">
                   <span className="text-emerald-500">Hello, I'm Vivek</span>
                 </span>
              </h2>
              <div className="text-emerald-400 font-bold text-[10px] sm:text-xs tracking-widest uppercase flex items-center gap-2">
                <div className="h-[2px] w-4 bg-emerald-500 animate-ping" />
                <ScrambleText text="3rd Year B.Tech CSE // Defensive Security Specialist" />
              </div>
            </div>
            
            <div className="flex gap-4">
              {[Linkedin, Github, Mail].map((Icon, i) => (
                <a key={i} href="#" className="p-2 border border-emerald-700/30 rounded text-emerald-700 hover:text-emerald-500 hover:border-emerald-500/50 transition-all bg-emerald-500/5">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          
          <div className="text-emerald-100/70 text-sm md:text-base leading-relaxed border-l-2 border-emerald-500/30 pl-4 md:pl-5 min-h-[4rem] font-medium max-w-4xl">
            {typedBio}
            <span className="inline-block w-2 h-4 bg-emerald-500 ml-1 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 animate-reveal" style={{ animationDelay: '800ms' }}>
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded group hover:bg-emerald-500/10 transition-all duration-300">
              <h4 className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2"><Shield size={14} className="group-hover:rotate-12 transition-transform" /> Defensive Security & SOC</h4>
              <div className="text-xs text-emerald-100/40 leading-relaxed mb-3">
                I primarily work with <IntelLink name="SIEM" /> platforms and <IntelLink name="MS Defender XDR" /> to monitor, analyze, and respond to security events. 
                My focus is on understanding attacker behavior, correlating events across systems, and reducing noise so real threats are detected early.
              </div>
            </div>
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded group hover:bg-emerald-500/10 transition-all duration-300">
              <h4 className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2"><Cpu size={14} className="group-hover:animate-spin-slow" /> Other Skills</h4>
              <div className="space-y-3">
                <div className="text-xs text-emerald-100/40 leading-tight">
                  Working knowledge that allows me to adapt across security environments:
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-emerald-100/50 font-bold uppercase">
                  <span>• Linux/Windows Logging</span>
                  <span>• <IntelLink name="Wireshark" /> Analysis</span>
                  <span>• <IntelLink name="MITRE ATT&CK" /></span>
                  <span>• <IntelLink name="Python" /> (Log Parsing)</span>
                  <span>• Basic Cloud (AWS)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </WindowFrame>

      <WindowFrame title="02_INTELLIGENCE_CENTER" active={false} subtitle="Active_Investigation">
         <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded border border-emerald-500/20">
                <Sparkles size={20} className="text-emerald-500" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-widest italic">Live Threat Investigator</h3>
                <p className="text-[10px] text-emerald-500/60 font-bold uppercase tracking-tighter mt-1">Simulate SOC analysis with real-time logic</p>
              </div>
            </div>
            <ThreatAnalyzer />
         </div>
      </WindowFrame>

      <WindowFrame title="03_RESEARCH_TRACK" subtitle="Current_Focus">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <Target size={14} /> Currently Working On
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { t: "SOC Detection Lab", d: "Simulated enterprise environment; ingesting logs into SIEM, creating rules, and documenting workflows." },
                  { t: "Incident Response Simulation", d: "Simulating phishing/malware incidents to practice structured response and remediation." },
                  { t: "Log Correlation Practice", d: "Identifying multi-stage attacks and abnormal behavior through correlation scripts." }
                ].map((item, idx) => (
                  <div key={idx} className="border-l border-emerald-900 pl-4 py-1 group/item animate-reveal" style={{ animationDelay: `${idx * 200 + 1000}ms` }}>
                    <div className="text-[10px] text-emerald-400 font-black uppercase group-hover/item:text-emerald-300 transition-colors">{item.t}</div>
                    <div className="text-[10px] text-emerald-100/40 leading-tight mt-1">{item.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6 animate-reveal" style={{ animationDelay: '1500ms' }}>
            <div className="space-y-4">
              <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <BookOpen size={14} /> Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Threat Intel", "Detection Eng", "IR & Forensics", "Scale Monitoring"].map(interest => (
                  <span key={interest} className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded text-emerald-100/60 font-bold uppercase hover:border-emerald-500/40 transition-colors">{interest}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </WindowFrame>
    </div>
  );
};

const Experience = () => {
  const experiences = [
    {
      year: "2026 – Present",
      title: "Advanced SOC & Detection Practice",
      desc: [
        "Actively practicing alert investigation and incident analysis using SIEM platforms and Microsoft Defender XDR.",
        "Correlating endpoint, identity, and network telemetry to detect multi-stage attack behavior.",
        "Mapping detected activity to the MITRE ATT&CK framework and documenting attack chains.",
        "Improving detection quality by tuning rules and reducing false positives.",
        "Writing structured incident reports including timeline, impact, root cause, and remediation."
      ]
    },
    {
      year: "2025",
      title: "Hands-on Security Practice — SOC & Detection",
      desc: [
        "Gained hands-on experience with SIEM tools and Microsoft Defender XDR for monitoring and investigation.",
        "Analyzed logs for brute-force attempts, phishing behavior, malware execution, and abnormal access patterns.",
        "Practiced triage and investigation workflows for security alerts.",
        "Simulated incident response processes including containment and recovery.",
        "Built small scripts and queries to support log analysis."
      ]
    },
    {
      year: "2024",
      title: "Academic & Laboratory Work — Cybersecurity & Networking",
      desc: [
        "Completed coursework and labs in computer networks, operating systems, and cybersecurity fundamentals.",
        "Performed packet analysis using Wireshark.",
        "Studied system logging, authentication mechanisms, and access control models.",
        "Built basic Linux and Windows lab environments for security experimentation."
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-6 pb-6">
      <WindowFrame title="CHRONOLOGICAL_EXPERIENCE_LOG" subtitle="Service_History">
        <div className="space-y-12 py-4">
          {experiences.map((exp, i) => (
            <div key={i} className="relative pl-6 sm:pl-8 border-l border-emerald-900/30 group animate-reveal" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="absolute -left-1.5 top-0 w-3 h-3 bg-[#030704] border border-emerald-500 rounded-full group-hover:scale-150 group-hover:bg-emerald-500 transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0)] group-hover:shadow-[0_0_10px_rgba(16,185,129,1)]" />
              <div className="flex flex-col mb-2">
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded tracking-tighter w-fit mb-2">{exp.year}</span>
                <h4 className="text-emerald-100 font-bold text-sm sm:text-lg tracking-tight uppercase italic group-hover:text-emerald-400 transition-colors">{exp.title}</h4>
              </div>
              <ul className="space-y-1.5">
                {exp.desc.map((line, li) => (
                  <li key={li} className="text-emerald-100/40 text-[10px] sm:text-xs leading-relaxed max-w-4xl flex gap-2">
                    <span className="text-emerald-700 font-bold shrink-0">»</span> {line}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </WindowFrame>
    </div>
  );
};

const SecurityLab = () => {
  const labs = [
    {
      id: "LAB-001",
      name: "SOC Detection Lab",
      status: "Active",
      desc: "Simulated enterprise environment with SIEM integration. Practicing alert triage, detection rule creation, and incident investigation using synthetic attack data.",
      tools: ["Splunk", "Sysmon", "Windows Event Logs", "Sigma Rules"],
      metrics: { alerts: "1,247", detections: "98.2%", fpRate: "4.3%" }
    },
    {
      id: "LAB-002",
      name: "Malware Analysis Sandbox",
      status: "In Progress",
      desc: "Isolated environment for static and dynamic malware analysis. Practicing behavioral analysis, IOC extraction, and report generation.",
      tools: ["REMnux", "FlareVM", "Wireshark", "YARA"],
      metrics: { samples: "23", signatures: "12", reports: "8" }
    },
    {
      id: "LAB-003",
      name: "Network Forensics Lab",
      status: "Active",
      desc: "Packet capture and network traffic analysis environment. Practicing protocol analysis, anomaly detection, and lateral movement identification.",
      tools: ["Zeek", "Suricata", "Wireshark", "NetworkMiner"],
      metrics: { pcaps: "156", flows: "2.4M", threats: "47" }
    }
  ];

  return (
    <div className="flex flex-col gap-6 pb-6">
      <WindowFrame title="SECURITY_LAB_ENVIRONMENT" active={true} subtitle="Active_Sandboxes">
        <div className="space-y-6">
          <div className="text-xs text-emerald-100/60 leading-relaxed border-l-2 border-emerald-500/30 pl-4">
            Hands-on security laboratories for practicing defensive operations, threat detection, and incident response in controlled environments.
          </div>
          
          <div className="grid gap-4">
            {labs.map((lab, i) => (
              <div key={lab.id} className="border border-emerald-900/30 rounded bg-emerald-950/10 overflow-hidden animate-reveal" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="flex items-center justify-between p-4 border-b border-emerald-900/20 bg-emerald-500/5">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black text-emerald-700">{lab.id}</span>
                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider">{lab.name}</h4>
                    <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase ${lab.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {lab.status}
                    </span>
                  </div>
                  <ShieldAlert size={16} className="text-emerald-600" />
                </div>
                
                <div className="p-4 space-y-4">
                  <p className="text-xs text-emerald-100/50 leading-relaxed">{lab.desc}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {lab.tools.map(tool => (
                      <span key={tool} className="text-[8px] px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-500/70 font-bold uppercase">
                        {tool}
                      </span>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-emerald-900/20">
                    {Object.entries(lab.metrics).map(([key, val]) => (
                      <div key={key} className="text-center">
                        <div className="text-lg font-black text-emerald-400">{val}</div>
                        <div className="text-[7px] text-emerald-800 uppercase font-black tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </WindowFrame>

      <WindowFrame title="LAB_OPERATIONS" subtitle="Procedures">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Detection Engineering", desc: "Writing and tuning detection rules for various attack techniques mapped to MITRE ATT&CK framework." },
            { title: "Incident Simulation", desc: "Running purple team exercises to validate detection capabilities and response procedures." },
            { title: "Log Analysis", desc: "Parsing and correlating logs from multiple sources to identify suspicious patterns." },
            { title: "Threat Hunting", desc: "Proactive searches for indicators of compromise and advanced persistent threats." }
          ].map((op, i) => (
            <div key={op.title} className="p-3 border border-emerald-900/20 rounded bg-emerald-500/5 animate-reveal" style={{ animationDelay: `${i * 100}ms` }}>
              <h5 className="text-[10px] font-black text-emerald-400 uppercase mb-1">{op.title}</h5>
              <p className="text-[10px] text-emerald-100/40 leading-tight">{op.desc}</p>
            </div>
          ))}
        </div>
      </WindowFrame>
    </div>
  );
};

const Development = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: "DEV-001",
      name: "AgriConnect",
      type: "E-Commerce Platform",
      desc: "A comprehensive agricultural marketplace connecting farmers to global exporters. Features government schemes, export hub, community forums, and equipment marketplace with multi-language support.",
      tech: ["Next.js", "React", "Tailwind CSS", "Lucide Icons"],
      status: "Live",
      link: "https://agriconnectproject.vercel.app",
      github: "https://github.com/vivek-the-coder/Agriconnect",
      features: ["Government Schemes Directory", "Export Hub", "Community Forums", "Equipment Marketplace", "Multi-language Support", "Responsive Design"]
    },
    {
      id: "DEV-002",
      name: "Colourtex",
      type: "Corporate Website",
      desc: "Professional website for a sustainable textile dyes and specialty chemicals manufacturer. Features company overview, product catalogs, and ZDHC/bluesign certification highlights.",
      tech: ["Vite", "React", "Tailwind CSS", "Schema.org SEO"],
      status: "Live",
      link: "https://colourdye.vercel.app",
      github: "https://github.com/vivek-the-coder/colourdye",
      features: ["Company Overview", "Product Catalogs", "ZDHC/bluesign Certification", "SEO Optimization", "Schema.org Structured Data", "Modern UI/UX"]
    },
    {
      id: "DEV-003",
      name: "SOCIA Agency",
      type: "SaaS Dashboard",
      desc: "Creative marketing intelligence platform for agencies to manage campaigns, track leads, and monitor growth performance in a unified workspace.",
      tech: ["Next.js", "React", "Tailwind CSS", "Analytics API"],
      status: "Live",
      link: "https://socia-agency.vercel.app",
      github: "https://github.com/vivek-the-coder/socia-agency",
      features: ["Campaign Management", "Lead Tracking", "Growth Analytics", "Unified Dashboard", "Real-time Metrics", "Agency Tools"]
    },
    {
      id: "DEV-004",
      name: "SecondSmile",
      type: "Marketplace",
      desc: "Toy rental and resale marketplace promoting sustainability. Families can rent, buy, or sell preloved toys with verified user profiles and community features.",
      tech: ["Next.js", "React", "Tailwind CSS", "Razorpay"],
      status: "Live",
      link: "https://secondsmile.vercel.app",
      github: "https://github.com/vivek-the-coder/secondsmile",
      features: ["Toy Rental System", "Resale Marketplace", "User Profiles", "Razorpay Integration", "Sustainability Focus", "Community Features"]
    },
    {
      id: "DEV-005",
      name: "The Table at Splatter",
      type: "Restaurant Website",
      desc: "Cafe and restaurant website featuring full menu display, coffee culture blog, table reservation system, and location details with contact information.",
      tech: ["Next.js", "React", "Tailwind CSS", "Static Gen"],
      status: "Live",
      link: "https://cafetable.vercel.app",
      github: "https://github.com/vivek-the-coder/cafe-web-design",
      features: ["Full Menu Display", "Coffee Culture Blog", "Table Reservation", "Location Details", "Contact Integration", "Static Generation"]
    },
    {
      id: "DEV-006",
      name: "PawPerfection",
      type: "Pet E-Commerce",
      desc: "Pet products e-commerce platform with integrated Razorpay payment gateway for seamless checkout experience.",
      tech: ["Vite", "React", "Tailwind CSS", "Razorpay SDK"],
      status: "Live",
      link: "https://paw-perfection.vercel.app",
      github: "https://github.com/vivek-the-coder/PawPerfection",
      features: ["Pet Products Catalog", "Razorpay Checkout", "E-commerce Cart", "Product Categories", "Mobile Responsive", "Fast Checkout"]
    },
    {
      id: "DEV-007",
      name: "LuxureDetails",
      type: "Service Website",
      desc: "Luxury car detailing studio website showcasing ceramic coating, PPF protection, and body shop services. Features portfolio gallery and appointment booking.",
      tech: ["Next.js", "React", "Tailwind CSS", "Image Gallery"],
      status: "Live",
      link: "https://cardetailing-eta.vercel.app",
      github: "https://github.com/vivek-the-coder/car-detailing-site",
      features: ["Ceramic Coating Info", "PPF Protection Details", "Portfolio Gallery", "Appointment Booking", "Body Shop Services", "Luxury Branding"]
    }
  ];

  const ProjectModal = ({ project, onClose }) => {
    if (!project) return null;

    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#030704] border border-emerald-500/40 rounded-lg shadow-[0_0_50px_rgba(16,185,129,0.2)]">
          <div className="sticky top-0 bg-[#030704] border-b border-emerald-900/30 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black text-emerald-700">{project.id}</span>
              <h3 className="text-sm font-black text-emerald-400 uppercase tracking-wider">{project.name}</h3>
              <span className="text-[8px] px-2 py-0.5 rounded font-black uppercase bg-emerald-500/20 text-emerald-400">
                {project.status}
              </span>
            </div>
            <button onClick={onClose} className="p-1 hover:text-red-500 text-emerald-500/50 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] text-emerald-700 uppercase font-black">Type:</div>
              <span className="text-sm text-emerald-300 font-bold">{project.type}</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] text-emerald-700 uppercase font-black">Description</h4>
              <p className="text-[12px] text-emerald-100/60 leading-relaxed">{project.desc}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] text-emerald-700 uppercase font-black">Key Features</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-[10px] text-emerald-100/50">
                    <span className="text-emerald-500 mt-0.5">»</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] text-emerald-700 uppercase font-black">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.tech.map(t => (
                  <span key={t} className="text-[9px] px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400/80 font-bold uppercase">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-emerald-900/30">
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded text-emerald-400 font-black text-[10px] uppercase tracking-widest transition-all"
              >
                <Globe size={14} />
                Live Site
              </a>
              <a 
                href={project.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded text-emerald-400 font-black text-[10px] uppercase tracking-widest transition-all"
              >
                <Github size={14} />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      <div className="flex flex-col gap-6 pb-6">
      <WindowFrame title="DEVELOPMENT_PROJECTS" active={true} subtitle="Code_Repository">
        <div className="space-y-6">
          <div className="text-xs text-emerald-100/60 leading-relaxed border-l-2 border-emerald-500/30 pl-4">
            Production web applications built with modern frameworks. Portfolio of client and personal projects spanning e-commerce, corporate sites, SaaS platforms, and service marketplaces.
          </div>
          
          <div className="grid gap-4">
            {projects.map((proj, i) => (
              <div 
                key={proj.id} 
                onClick={() => setSelectedProject(proj)}
                className="cursor-pointer border border-emerald-900/30 rounded bg-emerald-950/10 overflow-hidden animate-reveal hover:border-emerald-500/40 transition-all" 
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="flex items-center justify-between p-4 border-b border-emerald-900/20 bg-emerald-500/5">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black text-emerald-700">{proj.id}</span>
                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider">{proj.name}</h4>
                    <span className="text-[8px] px-2 py-0.5 rounded font-black uppercase bg-emerald-500/20 text-emerald-400">
                      {proj.status}
                    </span>
                  </div>
                  <FileCode size={16} className="text-emerald-600" />
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-emerald-700 uppercase font-black">Type:</span>
                    <span className="text-[10px] text-emerald-300 font-bold">{proj.type}</span>
                  </div>
                  
                  <p className="text-xs text-emerald-100/50 leading-relaxed">{proj.desc}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {proj.tech.map(t => (
                      <span key={t} className="text-[8px] px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-500/70 font-bold uppercase">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </WindowFrame>

      <WindowFrame title="TECH_STACK" subtitle="Capabilities">
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { category: "Frontend", items: ["Next.js", "React", "Vite", "Tailwind CSS"] },
              { category: "Languages", items: ["TypeScript", "JavaScript", "Python", "Go"] },
              { category: "Backend", items: ["Node.js", "REST APIs", "PostgreSQL", "MongoDB"] },
              { category: "Integrations", items: ["Razorpay", "Vercel", "SEO", "Analytics"] }
            ].map((stack) => (
              <div key={stack.category} className="p-3 border border-emerald-900/20 rounded bg-emerald-500/5">
                <h5 className="text-[9px] font-black text-emerald-700 uppercase mb-2">{stack.category}</h5>
                <div className="flex flex-wrap gap-1">
                  {stack.items.map(item => (
                    <span key={item} className="text-[8px] text-emerald-400/70 font-bold">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </WindowFrame>
    </div>
    </>
  );
};

const Contact = () => {
  const message = "ESTABLISHING SECURE CONNECTION TO OPERATOR... PLEASE WAIT FOR ENCRYPTION HANDSHAKE. READY TO TRANSMIT.";
  const { displayedText: typedMsg } = useTypewriter(message, 15, 200);

  return (
    <div className="max-w-xl mx-auto py-8 sm:py-12">
      <WindowFrame title="COMMUNICATION_UPLINK" subtitle="Contact_Protocol">
        <div className="space-y-8 text-center py-6">
          <div className="flex flex-col items-center gap-4 animate-reveal">
             <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 relative">
               <div className="absolute inset-0 rounded-full border border-emerald-500/40 animate-ping opacity-20" />
               <Radio className="text-emerald-500 animate-pulse" size={32} />
             </div>
             <h3 className="text-lg sm:text-xl font-black text-white italic tracking-tighter uppercase">Signal Acquisition</h3>
          </div>
          
          <div className="text-xs text-emerald-500/50 font-mono min-h-[1.5rem] tracking-widest px-4">
            {typedMsg}
          </div>

          <div className="space-y-4 animate-reveal" style={{ animationDelay: '1500ms' }}>
            <a href="mailto:hi@patelvivek.com" className="group flex flex-col items-center gap-1">
               <span className="text-[10px] text-emerald-700 font-black uppercase tracking-[0.3em]">Secure_Email</span>
               <span className="text-emerald-400 font-black text-lg sm:text-xl group-hover:text-white transition-all duration-300">hi@patelvivek.com</span>
            </a>
          </div>
        </div>
      </WindowFrame>
    </div>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');
  const [showTerminal, setShowTerminal] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
  }, [activeTab]);

  if (loading) return <LoadingScreen onComplete={() => setLoading(false)} />;

  const navItems = [
    { id: 'Home', i: Eye, l: 'HOME' },
    { id: 'Work', i: Briefcase, l: 'HISTORY' },
    { id: 'SecurityLab', i: ShieldAlert, l: 'LAB' },
    { id: 'Development', i: Code, l: 'DEV' },
    { id: 'Contact', i: Radio, l: 'COMM' }
  ];

  return (
    <div className="fixed inset-0 bg-[#010302] text-emerald-100/80 flex flex-col sm:flex-row font-mono overflow-hidden selection:bg-emerald-500 selection:text-black">
      {/* Desktop Sidebar */}
      <nav className="hidden sm:flex w-20 border-r border-emerald-900/20 flex-col items-center py-8 bg-[#020503]/80 backdrop-blur-xl z-50">
        <div className="relative group cursor-pointer mb-12">
          <ShieldCheck className="text-emerald-500 w-8 h-8 animate-pulse" />
        </div>
        <div className="flex-1 flex flex-col gap-10">
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`flex flex-col items-center gap-1.5 transition-all group relative ${activeTab === item.id ? 'text-emerald-400' : 'text-emerald-700 hover:text-emerald-600'}`}
            >
              <item.i size={20} className={`${activeTab === item.id ? 'animate-pulse scale-110' : ''}`} />
              <span className="text-[10px] font-black uppercase tracking-tighter">{item.l}</span>
            </button>
          ))}
          <button onClick={() => setShowTerminal(!showTerminal)} className={`flex flex-col items-center gap-1.5 transition-all group ${showTerminal ? 'text-emerald-400' : 'text-emerald-700 hover:text-emerald-600'}`}>
            <TerminalIcon size={20} />
            <span className="text-[10px] font-black uppercase tracking-tighter">SHELL</span>
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0 z-10 relative overflow-hidden">
        <header className="h-14 sm:h-16 border-b border-emerald-900/20 flex items-center justify-between px-4 sm:px-8 bg-[#010302]/60 backdrop-blur-md shrink-0 z-[60]">
           <div className="text-[10px] sm:text-xs font-black text-emerald-800 tracking-widest uppercase flex items-center gap-3">
             <Crosshair size={14} className="text-emerald-500/50 animate-spin-slow shrink-0" /> 
             <div className="truncate max-w-[200px] sm:max-w-none">
                <ScrambleText text={`VIVEK_SOC_OPERATIONS // ${activeTab.toUpperCase()}`} />
             </div>
           </div>
           
           <div className="flex items-center gap-3 sm:gap-6 text-[9px] font-black text-emerald-900 uppercase">
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="hidden xs:inline">Status: Active</span>
             </div>
             <button onClick={() => setShowTerminal(!showTerminal)} className="sm:hidden p-1.5 border border-emerald-900/30 rounded text-emerald-500">
               <TerminalIcon size={14} />
             </button>
           </div>
        </header>

        {/* Scrollable Content Area */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-12 custom-scrollbar touch-pan-y"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="max-w-6xl mx-auto pb-24 sm:pb-0">
            {activeTab === 'Home' && <Overview key="Home" />}
            {activeTab === 'Work' && <Experience key="Work" />}
            {activeTab === 'SecurityLab' && <SecurityLab key="SecurityLab" />}
            {activeTab === 'Development' && <Development key="Development" />}
            {activeTab === 'Contact' && <Contact key="Contact" />}
          </div>
        </div>

        {showTerminal && <KaliTerminal onClose={() => setShowTerminal(false)} />}
        
        <footer className="hidden sm:flex h-8 border-t border-emerald-900/10 bg-[#020503] items-center px-8 text-[10px] font-black text-emerald-700 uppercase tracking-[0.3em] shrink-0">
          DEFENSE_ACTIVE // INTELLIGENCE_CORE_ACTIVE // SESSION_START: {new Date().toLocaleDateString()}
        </footer>

        {/* Mobile Navigation Bar */}
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#020503]/90 border-t border-emerald-900/40 flex items-center justify-around px-4 z-[100] backdrop-blur-lg">
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`flex flex-col items-center gap-1 transition-all ${activeTab === item.id ? 'text-emerald-400' : 'text-emerald-700'}`}
            >
              <item.i size={18} />
              <span className="text-[10px] font-black uppercase tracking-tighter">{item.l}</span>
            </button>
          ))}
        </nav>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');
        
        :root {
          scrollbar-gutter: stable;
        }

        * { 
          box-sizing: border-box; 
          font-family: 'JetBrains Mono', monospace;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        html, body {
          height: 100%;
          width: 100%;
          overflow: hidden;
          position: fixed;
        }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #010302; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #064e3b; border-radius: 10px; }
        
        .bg-scanline { background: linear-gradient(to bottom, transparent 50%, rgba(16, 185, 129, 0.5) 51%, transparent 51%); background-size: 100% 4px; }
        
        @keyframes reveal {
          from { opacity: 0; transform: translateY(20px); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-reveal { animation: reveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
        
        @keyframes slideUpReveal {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up-reveal { animation: slideUpReveal 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        
        @keyframes slideDown {
          from { max-height: 0; opacity: 0; }
          to { max-height: 800px; opacity: 1; }
        }
        .animate-slide-down { animation: slideDown 0.5s ease-out forwards; }
        
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        @keyframes intel-pop {
          from { opacity: 0; transform: translate(-50%, 5px) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
        .animate-intel-pop { animation: intel-pop 0.2s ease-out forwards; }
        
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }

        .smooth-scroll {
          scroll-behavior: smooth;
        }

        .touch-pan-y {
          touch-action: pan-y;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
};

export default App;
