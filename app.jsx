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
  Telescope,
  Info,
  X,
  Radar,
  Database,
  Crosshair,
  Globe,
  Briefcase,
  ChevronRight,
  Target,
  Search,
  Activity,
  Shield,
  BookOpen
} from 'lucide-react';

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

// --- Text Scramble Hook (Hover effect) ---
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
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#010302] z-[999] flex flex-col items-center justify-center font-mono">
      <div className="w-64 space-y-4">
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
        <div className="text-[8px] text-emerald-800 font-bold uppercase tracking-[0.2em] h-4">
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
    <div className="relative inline-block group" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span className="text-emerald-400 font-bold underline decoration-emerald-500/30 decoration-dashed underline-offset-4 cursor-help transition-colors hover:text-emerald-300">
        {name}
      </span>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 z-[60] animate-intel-pop pointer-events-none">
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

    switch (cleanCmd) {
      case 'help':
        setHistory(prev => [...prev, "DEFENSIVE_TOOLKIT:\n  status     - System health check\n  clear      - Reset buffer"]);
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
    setIsProcessing(false);
  };

  return (
    <div className="bg-[#020503] border-t-2 border-emerald-900/50 h-[400px] flex flex-col font-mono text-[11px] z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] animate-slide-up overflow-hidden">
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
        <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto custom-scrollbar text-emerald-400/90 leading-relaxed bg-[#020402]">
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
              <input className="bg-transparent border-none outline-none text-emerald-100 flex-1 caret-emerald-500 font-bold" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && processCommand(input) && setInput("")} autoFocus />
            </div>
          )}
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
      {subtitle && <span className="text-[8px] text-emerald-900 font-bold uppercase">{subtitle}</span>}
    </div>
    <div className="relative flex-1 p-6 overflow-y-auto custom-scrollbar">{children}</div>
  </div>
);

const Overview = () => {
  const bio = "I am a cybersecurity-focused Computer Science student specializing in defensive security, threat detection, and incident response. I work with security telemetry from endpoints, networks, and identity systems to detect malicious activity, investigate alerts, and improve organizational security posture. My work is centered around SOC operations, not offensive hacking.";
  const { displayedText: typedBio } = useTypewriter(bio, 10, 300);

  return (
    <div className="grid grid-cols-12 gap-6 pb-12">
      <div className="col-span-12 space-y-6">
        <WindowFrame title="01_OPERATIONAL_STATUS" active={true} subtitle="Core_Identity">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-2">
                {/* Fixed visibility for 'k' by adding horizontal padding to account for italic tilt */}
                <h2 className="text-5xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none overflow-hidden">
                   <span className="inline-block px-1 animate-slide-up-reveal">
                     <span className="text-emerald-500">Hello, I'm Vivek</span>
                   </span>
                </h2>
                <div className="text-emerald-400 font-bold text-xs tracking-widest uppercase flex items-center gap-2">
                  <div className="h-[2px] w-4 bg-emerald-500 animate-ping" />
                  <ScrambleText text="3rd Year B.Tech CSE // Defensive Security Specialist" />
                </div>
              </div>
              
              <div className="flex gap-4">
                {[Linkedin, Github, Mail].map((Icon, i) => (
                  <a key={i} href="#" className="p-2 border border-emerald-900/30 rounded text-emerald-900 hover:text-emerald-500 hover:border-emerald-500/50 transition-all bg-emerald-500/5">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
            
            <div className="text-emerald-100/70 text-base leading-relaxed border-l-2 border-emerald-500/30 pl-5 min-h-[4rem] font-medium max-w-4xl">
              {typedBio}
              <span className="inline-block w-2 h-4 bg-emerald-500 ml-1 animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 animate-reveal" style={{ animationDelay: '800ms' }}>
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded group hover:bg-emerald-500/10 transition-all duration-300">
                <h4 className="text-emerald-400 font-black text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2"><Shield size={14} className="group-hover:rotate-12 transition-transform" /> Defensive Security & SOC</h4>
                <div className="text-[11px] text-emerald-100/40 leading-relaxed mb-3">
                  I primarily work with <IntelLink name="SIEM" /> platforms and <IntelLink name="MS Defender XDR" /> to monitor, analyze, and respond to security events. 
                  My focus is on understanding attacker behavior, correlating events across systems, and reducing noise so real threats are detected early.
                </div>
              </div>
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded group hover:bg-emerald-500/10 transition-all duration-300">
                <h4 className="text-emerald-400 font-black text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2"><Cpu size={14} className="group-hover:animate-spin-slow" /> Other Skills</h4>
                <div className="space-y-3">
                  <div className="text-[10px] text-emerald-100/40 leading-tight">
                    Working knowledge that allows me to adapt across security environments:
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-emerald-100/50 font-bold uppercase">
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

        <WindowFrame title="02_RESEARCH_TRACK" subtitle="Current_Focus">
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
                      <div className="text-[9px] text-emerald-100/40 leading-tight mt-1">{item.d}</div>
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
                    <span key={interest} className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded text-emerald-100/60 font-bold uppercase hover:border-emerald-500/40 transition-colors">{interest}</span>
                  ))}
                </div>
                <div className="pt-2">
                  <div className="text-[8px] text-emerald-900 font-black uppercase tracking-[0.3em] mb-2 border-b border-emerald-900/20 pb-1">External</div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[9px] text-emerald-100/30">
                      <Telescope size={12} className="text-emerald-900" /> Astronomy
                    </div>
                    <div className="flex items-center gap-2 text-[9px] text-emerald-100/30">
                      <Globe size={12} className="text-emerald-900" /> Space Science
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </WindowFrame>
      </div>
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
    },
    {
      year: "2023",
      title: "Independent Learning — Cybersecurity Foundations",
      desc: [
        "Self-studied core cybersecurity concepts: networking, Linux, security basics, and threat models.",
        "Learned fundamentals of logs, telemetry, and system monitoring.",
        "Followed public breach reports and incident analyses to understand real-world attacks.",
        "Practiced basic scripting and automation to support security tasks."
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-6 pb-12">
      <WindowFrame title="CHRONOLOGICAL_EXPERIENCE_LOG" subtitle="Service_History">
        <div className="space-y-12 py-4">
          {experiences.map((exp, i) => (
            <div key={i} className="relative pl-8 border-l border-emerald-900/30 group animate-reveal" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="absolute -left-1.5 top-0 w-3 h-3 bg-[#030704] border border-emerald-500 rounded-full group-hover:scale-150 group-hover:bg-emerald-500 transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0)] group-hover:shadow-[0_0_10px_rgba(16,185,129,1)]" />
              <div className="flex flex-col mb-2">
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded tracking-tighter w-fit mb-2">{exp.year}</span>
                <h4 className="text-emerald-100 font-bold text-lg tracking-tight uppercase italic group-hover:text-emerald-400 transition-colors">{exp.title}</h4>
              </div>
              <ul className="space-y-1.5">
                {exp.desc.map((line, li) => (
                  <li key={li} className="text-emerald-100/40 text-xs leading-relaxed max-w-4xl flex gap-2">
                    <span className="text-emerald-700 font-bold">»</span> {line}
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

const Inventory = () => {
  const assets = [
    { 
      id: "INV-001", 
      name: "SOC Detection Lab", 
      type: "Lab Environment", 
      focus: "Threat detection & alert analysis", 
      desc: "A simulated enterprise environment where I ingest endpoint and authentication logs, write detection rules, and analyze alerts for suspicious activity such as brute force, malware execution, and abnormal login behavior.", 
      tools: ["SIEM", "MS Defender XDR", "Sysmon", "Windows Logs"] 
    },
    { 
      id: "INV-002", 
      name: "Incident Response Simulation", 
      type: "Simulation", 
      focus: "Incident response", 
      desc: "Simulated phishing and malware incidents, performed triage, containment, eradication, and recovery, and documented timelines and remediation steps.", 
      tools: ["Elastic SIEM", "VirusTotal", "MITRE ATT&CK"] 
    },
    { 
      id: "INV-003", 
      name: "Log Correlation Scripts", 
      type: "Scripts", 
      focus: "Log correlation & investigation", 
      desc: "Scripts to parse and correlate logs across multiple sources to identify multi-stage attack behavior and anomalies.", 
      tools: ["Python", "Wazuh", "ELK"] 
    },
    { 
      id: "INV-004", 
      name: "Threat Intel Tracker", 
      type: "Mini Tool", 
      focus: "Threat intelligence", 
      desc: "A small system to track indicators of compromise and correlate them with detection alerts.", 
      tools: ["VirusTotal", "AbuseIPDB"] 
    }
  ];

  return (
    <div className="grid grid-cols-12 gap-6 pb-12">
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <WindowFrame title="ASSET_SPECIFICATIONS" subtitle="Inventory_Summary">
          <div className="space-y-4">
             <div className="text-[10px] text-emerald-100/40 italic leading-tight mb-4">
               A structured record of my security work, labs, and practice environments.
             </div>
             <div className="grid grid-cols-2 gap-4">
                {[["Lab Environments", "02"], ["Detection Rules", "06"], ["Incident Playbooks", "02"], ["Analysis Scripts", "03"]].map(([l, v], i) => (
                  <div key={l} className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded text-center animate-reveal" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="text-[8px] text-emerald-900 font-black uppercase mb-1">{l}</div>
                    <div className="text-2xl font-black text-emerald-400 leading-none tracking-tighter">{v}</div>
                  </div>
                ))}
             </div>
          </div>
        </WindowFrame>
      </div>
      <div className="col-span-12 lg:col-span-8">
        <WindowFrame title="INVENTORY_LIST" subtitle="Technical_Ledger">
          <div className="space-y-4">
            {assets.map((item, i) => (
              <details key={item.id} className="group border border-emerald-900/20 rounded bg-emerald-950/10 transition-all hover:border-emerald-500/30 animate-reveal" style={{ animationDelay: `${i * 150}ms` }}>
                <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                  <div className="flex items-center gap-4">
                    <span className="text-[9px] font-black text-emerald-900 group-hover:text-emerald-500 transition-colors">{item.id}</span>
                    <h5 className="text-xs font-black text-emerald-400 uppercase tracking-widest">{item.name}</h5>
                  </div>
                  <div className="text-emerald-900 transition-transform duration-500 group-open:rotate-180 group-open:text-emerald-500"><ChevronRight size={14} /></div>
                </summary>
                <div className="p-4 pt-0 border-t border-emerald-900/10 space-y-4 overflow-hidden animate-slide-down">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                     <div>
                       <div className="text-[8px] text-emerald-900 font-black uppercase mb-1">Type</div>
                       <div className="text-[10px] text-emerald-300 font-bold uppercase">{item.type}</div>
                     </div>
                     <div>
                       <div className="text-[8px] text-emerald-900 font-black uppercase mb-1">Focus</div>
                       <div className="text-[10px] text-emerald-300 font-bold uppercase">{item.focus}</div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] text-emerald-500 font-black uppercase tracking-widest">Tools:</span>
                    <div className="flex flex-wrap gap-2">
                      {item.tools.map(t => <span key={t} className="text-[8px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500/70 border border-emerald-500/20 rounded uppercase font-bold">{t}</span>)}
                    </div>
                  </div>
                  <div className="text-[11px] text-emerald-100/60 leading-relaxed border-l border-emerald-500/20 pl-4 py-1 italic">{item.desc}</div>
                </div>
              </details>
            ))}
          </div>
        </WindowFrame>
      </div>
    </div>
  );
};

const Contact = () => {
  const message = "ESTABLISHING SECURE CONNECTION TO OPERATOR... PLEASE WAIT FOR ENCRYPTION HANDSHAKE. READY TO TRANSMIT.";
  const { displayedText: typedMsg } = useTypewriter(message, 15, 200);

  return (
    <div className="max-w-xl mx-auto py-12">
      <WindowFrame title="COMMUNICATION_UPLINK" subtitle="Contact_Protocol">
        <div className="space-y-8 text-center py-6">
          <div className="flex flex-col items-center gap-4 animate-reveal">
             <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 relative">
               <div className="absolute inset-0 rounded-full border border-emerald-500/40 animate-ping opacity-20" />
               <Radio className="text-emerald-500 animate-pulse" size={32} />
             </div>
             <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Signal Acquisition</h3>
          </div>
          
          <div className="text-[9px] text-emerald-500/50 font-mono min-h-[1.5rem] tracking-widest px-4">
            {typedMsg}
          </div>

          <div className="space-y-4 animate-reveal" style={{ animationDelay: '1500ms' }}>
            <a href="mailto:hi@patelvivek.com" className="group flex flex-col items-center gap-1">
               <span className="text-[8px] text-emerald-900 font-black uppercase tracking-[0.3em]">Secure_Email</span>
               <span className="text-emerald-400 font-black text-xl group-hover:text-white transition-all duration-300">hi@patelvivek.com</span>
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

  if (loading) return <LoadingScreen onComplete={() => setLoading(false)} />;

  return (
    <div className="fixed inset-0 bg-[#010302] text-emerald-100/80 flex font-mono overflow-hidden selection:bg-emerald-500 selection:text-black">
      <nav className="w-20 border-r border-emerald-900/20 flex flex-col items-center py-8 bg-[#020503]/80 backdrop-blur-xl z-50">
        <div className="relative group cursor-pointer mb-12">
          <ShieldCheck className="text-emerald-500 w-8 h-8 animate-pulse" />
        </div>
        <div className="flex-1 flex flex-col gap-10">
          {[
            { id: 'Home', i: Eye, l: 'HOME' },
            { id: 'Work', i: Briefcase, l: 'HISTORY' },
            { id: 'Inventory', i: Database, l: 'ASSETS' },
            { id: 'Contact', i: Radio, l: 'COMM' }
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`flex flex-col items-center gap-1.5 transition-all group relative ${activeTab === item.id ? 'text-emerald-400' : 'text-emerald-900 hover:text-emerald-600'}`}
            >
              <item.i size={20} className={`${activeTab === item.id ? 'animate-pulse scale-110' : ''}`} />
              <span className="text-[7px] font-black uppercase tracking-tighter">{item.l}</span>
            </button>
          ))}
          <button onClick={() => setShowTerminal(!showTerminal)} className={`flex flex-col items-center gap-1.5 transition-all group ${showTerminal ? 'text-emerald-400' : 'text-emerald-900 hover:text-emerald-600'}`}>
            <TerminalIcon size={20} />
            <span className="text-[7px] font-black uppercase tracking-tighter">SHELL</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col min-w-0 z-10 relative">
        <header className="h-16 border-b border-emerald-900/20 flex items-center justify-between px-8 bg-[#010302]/60 backdrop-blur-md">
           <div className="text-xs font-black text-emerald-800 tracking-widest uppercase flex items-center gap-3">
             <Crosshair size={14} className="text-emerald-500/50 animate-spin-slow" /> 
             <ScrambleText text={`VIVEK_SOC_OPERATIONS_CENTER // ${activeTab.toUpperCase()}`} />
           </div>
           <div className="flex gap-6 text-[9px] font-black text-emerald-900 uppercase">
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span>Status: Active</span>
             </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar smooth-scroll">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'Home' && <Overview key="Home" />}
            {activeTab === 'Work' && <Experience key="Work" />}
            {activeTab === 'Inventory' && <Inventory key="Inventory" />}
            {activeTab === 'Contact' && <Contact key="Contact" />}
          </div>
        </div>

        {showTerminal && <KaliTerminal onClose={() => setShowTerminal(false)} />}
        
        <footer className="h-8 border-t border-emerald-900/10 bg-[#020503] flex items-center px-8 text-[7px] font-black text-emerald-900 uppercase tracking-[0.3em]">
          DEFENSE_ACTIVE // SESSION_START: {new Date().toLocaleDateString()}
        </footer>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');
        * { box-sizing: border-box; font-family: 'JetBrains Mono', monospace; scroll-behavior: smooth; }
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
        @keyframes fadeInBlur {
          from { opacity: 0; filter: blur(5px); }
          to { opacity: 1; filter: blur(0); }
        }
        .animate-fade-in-blur { animation: fadeInBlur 1.5s ease-out forwards; }
        @keyframes slideDown {
          from { max-height: 0; opacity: 0; }
          to { max-height: 500px; opacity: 1; }
        }
        .animate-slide-down { animation: slideDown 0.5s ease-out forwards; }
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes intel-pop {
          from { opacity: 0; transform: translate(-50%, 5px) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
        .animate-intel-pop { animation: intel-pop 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;