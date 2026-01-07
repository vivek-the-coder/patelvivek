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
  Info,
  X,
  Radar,
  Database,
  Crosshair,
  Globe,
  Briefcase,
  ChevronRight,
  Target,
  Search, // Replaced Telescope with Search to fix the build error
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

// --- Scramble Text Component ---
const ScrambleText = ({ text, delay = 0 }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = "!@#$%^&*()_+[]{};:,.<>?/\\|";

  useEffect(() => {
    let timeout;
    const startScramble = () => {
      let iteration = 0;
      const interval = setInterval(() => {
        setDisplayText(prev => 
          text.split("").map((char, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          }).join("")
        );
        iteration += 1/3;
        if (iteration >= text.length) clearInterval(interval);
      }, 30);
    };

    timeout = setTimeout(startScramble, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return <span className="font-mono">{displayText}</span>;
};

// --- Loading Screen Component ---
const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("INITIALIZING BOOT_SEQUENCE");

  const statuses = [
    "LOADING SECURE_KERNEL...",
    "ESTABLISHING ENCRYPTED_TUNNEL...",
    "BYPASSING FIREWALL...",
    "DECRYPTING ASSET_LEDGER...",
    "MOUNTING SOC_DASHBOARD...",
    "ACCESS_GRANTED"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        const next = prev + Math.random() * 15;
        setStatus(statuses[Math.floor((next / 100) * (statuses.length - 1))]);
        return Math.min(next, 100);
      });
    }, 200);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#010302] flex flex-col items-center justify-center z-50 font-mono p-4">
      <div className="w-full max-w-md border border-emerald-900/50 p-6 bg-black/40 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent animate-pulse" />
        <div className="flex justify-between mb-4 text-xs text-emerald-500/70">
          <span>{status}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1 w-full bg-emerald-950/50 overflow-hidden rounded-full">
          <div 
            className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-8 grid grid-cols-4 gap-2 opacity-20">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-1 bg-emerald-500 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Kali Terminal Component ---
const KaliTerminal = () => {
  const [history, setHistory] = useState([
    { type: 'sys', content: '[SYSTEM_BOOT_SUCCESS]' },
    { type: 'sys', content: 'INITIALIZING_SECURE_SHELL v4.2.0-stable' },
    { type: 'sys', content: 'AUTHENTICATED: SECURE_USER@VIVEK_SOC' },
    { type: 'sys', content: 'Type "help" for a list of available commands.' }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const commands = {
    help: () => "Available commands: bio, skills, targets, status, contact, clear, help",
    bio: () => "SOC Analyst with deep specialization in incident response, threat detection, and cloud security architectures.",
    skills: () => "TECHNICAL_STACK: SIEM (Splunk/Sentinel), MS Defender XDR, Wireshark, Python, Linux Forensics",
    targets: () => "CURRENT_PROJECTS: [1] SOC Automation Lab [2] Threat Hunting Simulation [3] Malware Analysis Sandbox",
    status: () => "SYSTEM_STATUS: NOMINAL | SECURITY_LEVEL: HIGH | NETWORK: PROTECTED",
    contact: () => "ENDPOINT: patelvivek11vp@gmail.com",
    clear: () => { setHistory([]); return null; }
  };

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.toLowerCase().trim();
      const newHistory = [...history, { type: 'cmd', content: `vivek@soc:~$ ${input}` }];
      
      if (commands[cmd]) {
        const result = commands[cmd]();
        if (result) newHistory.push({ type: 'res', content: result });
      } else if (cmd !== "") {
        newHistory.push({ type: 'res', content: `Command not found: ${cmd}. Type "help" for assistance.` });
      }
      
      setHistory(newHistory);
      setInput("");
    }
  };

  return (
    <div className="bg-[#020504] border border-emerald-900/50 rounded-lg overflow-hidden shadow-2xl font-mono text-sm group">
      <div className="bg-emerald-950/20 border-b border-emerald-900/30 px-4 py-2 flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-900/50 border border-red-500/30" />
          <div className="w-3 h-3 rounded-full bg-yellow-900/50 border border-yellow-500/30" />
          <div className="w-3 h-3 rounded-full bg-emerald-900/50 border border-emerald-500/30" />
        </div>
        <div className="text-[10px] text-emerald-500/50 uppercase tracking-widest font-bold">Secure Terminal Session</div>
        <TerminalIcon size={14} className="text-emerald-500/50" />
      </div>
      <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-emerald-900/50 scrollbar-track-transparent">
        {history.map((line, i) => (
          <div key={i} className={`${
            line.type === 'cmd' ? 'text-emerald-400' : 
            line.type === 'sys' ? 'text-emerald-500/60 italic' : 
            'text-emerald-500'
          }`}>
            {line.content}
          </div>
        ))}
        <div className="flex items-center text-emerald-400">
          <span className="mr-2">vivek@soc:~$</span>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="bg-transparent border-none outline-none flex-1 text-emerald-400 caret-emerald-500"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

// --- IntelLink Component ---
const INTEL_DB = {
  Wireshark: "Advanced network protocol analyzer for deep packet inspection and traffic analysis.",
  SIEM: "Security Information and Event Management - providing real-time analysis of security alerts.",
  "MS Defender XDR": "Unified pre- and post-breach enterprise defense suite that coordinates detection across endpoints.",
  Python: "High-level programming used extensively for security automation and scripting.",
  "SOC Detection Lab": "Isolated environment for testing detection rules and simulating cyber attacks safely."
};

const IntelLink = ({ term }) => {
  const [show, setShow] = useState(false);
  return (
    <span 
      className="relative inline-block text-emerald-400 cursor-help border-b border-emerald-400/30 hover:border-emerald-400 transition-colors"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {term}
      {show && INTEL_DB[term] && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-black/95 border border-emerald-500/50 text-[10px] text-emerald-300 leading-relaxed z-50 rounded shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md animate-reveal">
          <span className="block text-emerald-500 font-bold mb-1 uppercase tracking-tighter text-[9px] opacity-70 border-b border-emerald-900/30 pb-1">Intel_Brief: {term}</span>
          {INTEL_DB[term]}
        </span>
      )}
    </span>
  );
};

// --- Main Application ---
const App = () => {
  const [loading, setLoading] = useState(true);
  const { displayedText: bioText } = useTypewriter(
    "Security professional focused on threat hunting, infrastructure hardening, and defensive operations. Dedicated to building resilient security postures through data-driven analysis.",
    20, 1000
  );

  if (loading) return <LoadingScreen onComplete={() => setLoading(false)} />;

  return (
    <div className="min-h-screen bg-[#010302] text-emerald-500 selection:bg-emerald-500/30 selection:text-emerald-200">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        {/* Header Section */}
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-emerald-950/50 pb-12 relative overflow-hidden group">
          <div className="absolute -left-20 -top-20 w-64 h-64 bg-emerald-500/5 blur-[120px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-1000" />
          <div>
            <div className="flex items-center gap-3 mb-4 opacity-70 animate-reveal">
              <ShieldCheck className="text-emerald-500" size={20} />
              <span className="text-xs font-mono uppercase tracking-[0.4em] font-bold">VIVEK_SOC_OPERATIONS</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 relative animate-reveal">
              VIVEK <br /> <span className="text-emerald-900/40 outline-text">PATEL</span>
            </h1>
            <p className="max-w-xl text-emerald-500/80 font-mono text-sm leading-relaxed animate-reveal [animation-delay:200ms]">
              {bioText}
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-6 animate-reveal [animation-delay:400ms]">
             <div className="flex gap-4">
              <a href="#" className="p-3 border border-emerald-900/50 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all group/link">
                <Github size={20} className="group-hover/link:scale-110 transition-transform" />
              </a>
              <a href="#" className="p-3 border border-emerald-900/50 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all group/link">
                <Linkedin size={20} className="group-hover/link:scale-110 transition-transform" />
              </a>
              <a href="mailto:patelvivek11vp@gmail.com" className="p-3 border border-emerald-900/50 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all group/link">
                <Mail size={20} className="group-hover/link:scale-110 transition-transform" />
              </a>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-emerald-950/20 border border-emerald-900/30 rounded-full group/status">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold opacity-80 group-hover/status:opacity-100 transition-opacity">Active / In_Field</span>
            </div>
          </div>
        </header>

        {/* Intelligence Ledger Section */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-10 overflow-hidden">
            <h2 className="text-xs font-mono uppercase tracking-[0.5em] font-bold text-emerald-900/60 whitespace-nowrap">
              TECHNICAL_LEDGER
            </h2>
            <div className="h-[1px] w-full bg-emerald-950/50" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4 animate-reveal [animation-delay:600ms]">
              {[
                { label: "Role", value: "SOC Analyst / Defense Engineer" },
                { label: "Spec", value: "Threat Intelligence & Detection" },
                { label: "Region", value: "Surat, India" },
                { label: "Availability", value: "Hiring_Enabled" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-emerald-950 hover:border-emerald-900/50 bg-emerald-950/10 transition-all group/row">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-900 group-hover/row:text-emerald-700 transition-colors">{item.label}</span>
                  <span className="text-sm font-mono font-bold text-emerald-500/90">{item.value}</span>
                </div>
              ))}
            </div>
            
            <div className="animate-reveal [animation-delay:800ms]">
              <KaliTerminal />
            </div>
          </div>
        </section>

        {/* Asset Inventory (Projects) Section */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-12 overflow-hidden">
            <h2 className="text-xs font-mono uppercase tracking-[0.5em] font-bold text-emerald-900/60 whitespace-nowrap">
              ASSET_INVENTORY
            </h2>
            <div className="h-[1px] w-full bg-emerald-950/50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 px-1 bg-emerald-950/30 animate-reveal [animation-delay:1000ms]">
            {[
              { 
                id: "PRJ-01", 
                title: "SOC Detection Lab", 
                desc: "Home lab for active threat simulation using SIEM and XDR tools.", 
                tools: ["SIEM", "MS Defender XDR"] 
              },
              { 
                id: "PRJ-02", 
                title: "Packet Analysis Protocol", 
                desc: "Incident response workflow using Wireshark for deep traffic inspection.", 
                tools: ["Wireshark", "Python"] 
              },
              { 
                id: "PRJ-03", 
                title: "Vulnerability Recon", 
                desc: "Infrastructure scanning and hardening project for local network endpoints.", 
                tools: ["Python", "Linux Forensics"] 
              },
              { 
                id: "PRJ-04", 
                title: "Automation Scripts", 
                desc: "Automated alert triage scripts for repetitive SOC workflow patterns.", 
                tools: ["Python", "Shell Scripting"] 
              }
            ].map((prj, i) => (
              <div key={i} className="bg-[#010302] p-8 hover:bg-emerald-950/10 transition-all group/asset relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/asset:opacity-30 transition-opacity">
                  <Search size={40} className="text-emerald-500" />
                </div>
                <div className="text-[10px] font-mono text-emerald-900 mb-4 group-hover/asset:text-emerald-700 transition-colors">#{prj.id}</div>
                <h3 className="text-2xl font-bold mb-4 tracking-tighter group-hover/asset:text-emerald-400 transition-colors underline decoration-emerald-900/30 group-hover/asset:decoration-emerald-500/50 underline-offset-8">
                  {prj.title}
                </h3>
                <p className="text-sm text-emerald-700/80 mb-8 font-mono leading-relaxed h-12 overflow-hidden">
                  Incident Response Simulation: {prj.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {prj.tools.map((tool, ti) => (
                    <IntelLink key={ti} term={tool} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-emerald-950/50 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 hover:opacity-100 transition-opacity duration-700">
          <div className="flex items-center gap-4 grayscale">
            <ShieldCheck size={24} />
            <div className="text-[10px] font-mono leading-tight">
              VERIFIED_SOC_ANALYST<br />
              HASH_ID: V4781-992
            </div>
          </div>
          <div className="text-[10px] font-mono uppercase tracking-[0.3em]">
            © 2024 VIVEK_PATEL / END_OF_TRANSMISSION
          </div>
        </footer>
      </main>

      {/* Global CSS for text effects */}
      <style dangerouslySetInnerHTML={{ __html: `
        .outline-text {
          -webkit-text-stroke: 1px rgba(16, 185, 129, 0.15);
          text-shadow: 0 0 30px rgba(16, 185, 129, 0.05);
        }
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
      `}} />
    </div>
  );
};

export default App;
