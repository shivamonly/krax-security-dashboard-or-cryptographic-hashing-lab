import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export default function Benchmarks() {
  const [logs, setLogs] = useState<string[]>([
    "[SUCCESS] 192.168.1.12:80 -> user:guest pass:password123 (MD5)",
    "[INFO] Benchmarking cycle completed in 1.4s.",
    "[SUCCESS] 10.0.0.45:22 -> user:root pass:!admin2023 (SHA-1)",
    "[INFO] Hashcat switching to GPU_0 partition 2.",
    "[SUCCESS] internal_app_v2 -> user:sysop pass:shadow_mask_88 (NTLM)",
    "[ALERT] Entropy threshold exceeded on SHA-512 target.",
    "[SUCCESS] dev_server_3 -> user:jenkins pass:P@ssword! (MD5)",
  ]);

  const simulatedMessages = [
    "[SUCCESS] database_prod -> user:hr_admin pass:SecureKey99 (SHA-256)",
    "[INFO] Rotation of wordlist partition complete.",
    "[SUCCESS] wifi_office_guest -> pass:Welcome2024! (WPA2)",
    "[ALERT] Decryption buffer overflow warning - reallocating VRAM",
    "[SUCCESS] cloud_backup_01 -> user:admin pass:admin_vault_A1 (SHA-1)"
  ];

  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const msg = simulatedMessages[Math.floor(Math.random() * simulatedMessages.length)];
      setLogs(prev => [...prev, msg].slice(-50)); // Keep last 50 logs
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="relative flex flex-col h-full space-y-4 md:space-y-6 max-w-[1440px] mx-auto pb-12 w-full">
      <div className="scanline"></div>
      
      {/* Top row */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Live Command Center Progress */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="col-span-12 lg:col-span-8 bg-surface-elevation-1 border border-outline-variant p-4 md:p-6 flex flex-col gap-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="font-label-caps text-[14px] md:text-[16px] text-primary-fixed-dim font-bold tracking-widest">LIVE_EXPLOITATION_FEED</h2>
            <span className="flex items-center gap-2 text-[10px] md:text-[12px] text-primary-fixed-dim font-bold tracking-widest uppercase">
              <span className="w-2 h-2 bg-primary-container rounded-full animate-pulse"></span>
              SYSTEM_ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 flex-grow">
            {/* John the Ripper */}
            <div className="bg-terminal-black border border-outline-variant p-4 flex flex-col shadow-lg">
              <div className="flex justify-between mb-4">
                <span className="font-code-block text-[14px] text-secondary-fixed-dim font-bold">JOHN_THE_RIPPER</span>
                <span className="font-code-block text-[14px] text-secondary-fixed-dim font-bold">74.2%</span>
              </div>
              <div className="w-full bg-surface-container h-4 mb-4 border border-outline-variant overflow-hidden">
                <div className="h-full bg-secondary-container glow-secondary flex gap-[2px] p-[2px]">
                  <div className="h-full w-4 bg-secondary"></div>
                  <div className="h-full w-4 bg-secondary"></div>
                  <div className="h-full w-4 bg-secondary"></div>
                  <div className="h-full w-4 bg-secondary"></div>
                  <div className="h-full w-4 bg-secondary"></div>
                  <div className="h-full w-4 bg-secondary"></div>
                  <div className="h-full w-4 bg-secondary"></div>
                  <div className="h-full w-12 bg-secondary/40 animate-pulse"></div>
                </div>
              </div>
              <div className="flex-grow font-code-block text-[12px] text-on-surface-variant overflow-hidden space-y-2">
                <p>&gt; Loading wordlist: rockyou.txt</p>
                <p>&gt; Rule: Single crack mode</p>
                <p className="text-secondary-fixed-dim font-bold">&gt; User: admin... found!</p>
                <p>&gt; ETA: 00:04:12</p>
              </div>
            </div>

            {/* Hashcat */}
            <div className="bg-terminal-black border border-outline-variant p-4 flex flex-col shadow-lg">
              <div className="flex justify-between mb-4">
                <span className="font-code-block text-[14px] text-primary-container font-bold">HASHCAT_V6.2</span>
                <span className="font-code-block text-[14px] text-primary-container font-bold">42.8%</span>
              </div>
              <div className="w-full bg-surface-container h-4 mb-4 border border-outline-variant overflow-hidden">
                <div className="h-full bg-primary-container glow-primary flex gap-[2px] p-[2px]">
                  <div className="h-full w-4 bg-primary"></div>
                  <div className="h-full w-4 bg-primary"></div>
                  <div className="h-full w-4 bg-primary"></div>
                  <div className="h-full w-4 bg-primary"></div>
                  <div className="h-full w-16 bg-primary/40 animate-pulse"></div>
                </div>
              </div>
              <div className="flex-grow font-code-block text-[12px] text-on-surface-variant overflow-hidden space-y-2">
                <p>&gt; Attack Mode: Brute-force (?a?a?a?a)</p>
                <p>&gt; Device: GPU_0 (NVIDIA RTX 4090)</p>
                <p>&gt; Speed: 84.5 GH/s</p>
                <p className="text-vulnerability-red font-bold">&gt; Warning: Temp threshold 78C</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Hardware Gauges */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="col-span-12 lg:col-span-4 flex flex-col gap-4 md:gap-6"
        >
          <div className="bg-surface-elevation-1 border border-outline-variant p-4 md:p-6 shadow-inner">
            <h2 className="font-label-caps text-[14px] md:text-[16px] text-primary tracking-widest font-bold mb-6">SYSTEM_UTILIZATION</h2>
            <div className="space-y-6">
              {/* GPU Gauge */}
              <div>
                <div className="flex justify-between font-code-block text-[12px] mb-2">
                  <span className="text-on-surface-variant">GPU_CLUSTER_LOAD</span>
                  <span className="text-secondary-fixed-dim font-bold">98.4%</span>
                </div>
                <div className="relative h-2 bg-surface-container border border-outline-variant">
                  <div className="absolute inset-y-0 left-0 bg-secondary-fixed-dim glow-secondary" style={{ width: '98.4%' }}></div>
                </div>
              </div>
              {/* CPU Gauge */}
              <div>
                <div className="flex justify-between font-code-block text-[12px] mb-2">
                  <span className="text-on-surface-variant">CPU_TOTAL_CORES</span>
                  <span className="text-primary-fixed-dim font-bold">34.1%</span>
                </div>
                <div className="relative h-2 bg-surface-container border border-outline-variant">
                  <div className="absolute inset-y-0 left-0 bg-primary-fixed-dim glow-primary" style={{ width: '34.1%' }}></div>
                </div>
              </div>
              {/* RAM Gauge */}
              <div>
                <div className="flex justify-between font-code-block text-[12px] mb-2">
                  <span className="text-on-surface-variant">VRAM_POOL</span>
                  <span className="text-tertiary-fixed-dim font-bold">14.2 GB / 24 GB</span>
                </div>
                <div className="relative h-2 bg-surface-container border border-outline-variant">
                  <div className="absolute inset-y-0 left-0 bg-tertiary-fixed-dim" style={{ width: '59%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Time-to-Crack Visualization */}
          <div className="bg-surface-elevation-1 border border-outline-variant p-4 md:p-6 flex-grow shadow-inner">
            <h2 className="font-label-caps text-[14px] md:text-[16px] text-primary tracking-widest font-bold mb-6">ENTITY_DEGRADATION_ESTIMATES</h2>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <span className="w-16 font-code-block text-[12px] text-on-surface-variant">MD5</span>
                <div className="flex-grow h-6 bg-surface-container border border-outline-variant flex items-center px-2">
                  <span className="text-[12px] font-code-block text-primary-container font-bold">&lt; 1s</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-16 font-code-block text-[12px] text-on-surface-variant">SHA-256</span>
                <div className="flex-grow h-6 bg-surface-container border border-outline-variant flex items-center relative overflow-hidden">
                  <div className="absolute left-0 h-full w-[15%] bg-primary-container/20 border-r border-primary-container"></div>
                  <span className="relative z-10 pl-2 text-[12px] font-code-block text-primary-container font-bold">7m 42s</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-16 font-code-block text-[12px] text-on-surface-variant">BCRYPT</span>
                <div className="flex-grow h-8 bg-surface-elevation-1 border border-vulnerability-red flex items-center px-4 hover:bg-vulnerability-red/5 transition-colors">
                  <span className="text-[13px] font-code-block text-vulnerability-red animate-pulse font-bold">4.2 YEARS</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Terminal Log Scrolling */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
          className="col-span-12 bg-terminal-black border border-outline-variant h-64 flex flex-col mt-2"
        >
          <div className="px-6 py-3 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
            <span className="font-label-caps text-[12px] text-primary tracking-widest font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]" data-icon="terminal">terminal</span>
              OUTPUT_BUFFER::CRACKED_CREDENTIALS
            </span>
            <span className="text-[10px] font-code-block text-on-surface-variant tracking-widest uppercase">LOGS_ENABLED: TRUE</span>
          </div>
          <div 
            ref={logContainerRef}
            className="flex-grow p-4 md:p-6 font-code-block text-[13px] text-on-surface-variant overflow-y-auto space-y-[6px] terminal-scroll"
          >
            {logs.map((log, index) => {
              let className = "opacity-80";
              if (log.includes("[SUCCESS]")) {
                className = "text-[#ccffda] font-medium";
              } else if (log.includes("[ALERT]")) {
                className = "text-vulnerability-red font-bold";
              } else if (log.includes("[INFO]")) {
                className = "opacity-50";
              }

              return (
                <p key={index} className={className}>{log}</p>
              )
            })}
            <p className="text-[#8ae18a] mt-2 font-bold animate-pulse">
              [CRITICAL] Monitoring parallel decryption... <span className="blinking-cursor"></span>
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
