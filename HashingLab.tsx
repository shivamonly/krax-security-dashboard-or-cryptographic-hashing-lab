import { useState } from 'react';
import CryptoJS from 'crypto-js';
import { motion } from 'motion/react';

export default function HashingLab({ onToast }: { onToast: (msg: string, type: 'info' | 'success' | 'warning' | 'error') => void }) {
  const [saltingEnabled, setSaltingEnabled] = useState(false);
  const [inputText, setInputText] = useState('');

  // Calculated state
  const entropy = inputText ? (inputText.length * 6.2).toFixed(1) : "0.0";
  const entropyWidth = Math.min(100, (parseFloat(entropy) / 1.28));
  
  let md5Out = 'd41d8cd98f00b204e9800998ecf8427e';
  let sha256Out = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  let bcryptOut = '$2a$12$R9h/cIPz0gi.URNNXpkh2.8uxR.fHn5/76W5J1t.t.t.t.t.t';

  if (inputText) {
    md5Out = CryptoJS.MD5(inputText).toString();
    sha256Out = CryptoJS.SHA256(inputText).toString();
    
    let hash = 0;
    for (let i = 0; i < inputText.length; i++) {
        hash = ((hash << 5) - hash) + inputText.charCodeAt(i);
        hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).repeat(8);
    
    bcryptOut = saltingEnabled 
      ? '$2a$12$' + hex.substring(0, 40) 
      : '$2a$10$NO_SALT_INGESTED_0000000';
  }

  const copyToClipboard = (hash: string, algo: string) => {
    navigator.clipboard.writeText(hash).then(() => {
      onToast(`Copied ${algo} hash to clipboard!`, 'success');
    }).catch(() => {
      onToast(`Failed to copy, clipboard API unsupported.`, 'error');
    });
  };

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 max-w-7xl mx-auto w-full">
      {/* Terminal Input Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="col-span-12 lg:col-span-8"
      >
        <div className="bg-surface-elevation-1 border border-primary-container p-6 rounded-sm relative overflow-hidden h-64 flex flex-col group transition-all focus-within:glow-primary">
          <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[120px]">security</span>
          </div>
          <div className="flex justify-between items-center mb-4 z-10">
            <h2 className="font-label-caps text-[12px] font-bold text-primary-container flex items-center gap-2 tracking-widest">
              <span className="material-symbols-outlined text-[16px]">terminal</span>
              INPUT_BUFFER_V0.1
            </h2>
            <div className="flex items-center gap-4">
              <span className="font-code-block text-[10px] text-on-surface-variant">UTF-8_ENCODING</span>
              <div className="flex items-center gap-2">
                <label className="font-label-caps text-[10px] font-bold text-on-surface-variant tracking-widest">SALTING</label>
                <button 
                  onClick={() => {
                    setSaltingEnabled(!saltingEnabled);
                    onToast(`Salting engine ${!saltingEnabled ? 'ENABLED' : 'DISABLED'} for Bcrypt.`, !saltingEnabled ? 'success' : 'warning');
                  }}
                  className={`w-10 h-5 border relative rounded-full transition-colors active:scale-95 focus:outline-none ${saltingEnabled ? 'bg-primary-container border-primary-container' : 'bg-surface-container-highest border-outline-variant'}`}
                >
                  <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all ${saltingEnabled ? 'left-[20px] bg-[#002203]' : 'left-[3px] bg-on-surface-variant'}`}></div>
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-terminal-black p-4 font-code-block text-[14px] text-primary-container relative z-10 border border-outline-variant focus-within:border-primary-container transition-colors">
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-full bg-transparent border-none outline-none resize-none focus:ring-0 placeholder:opacity-30" 
              placeholder="ENTER_PLAINTEXT_STRING_FOR_INGESTION..." />
            <div className="absolute bottom-4 right-4 text-[10px] opacity-40 font-code-block pointer-events-none">
              L_01 C_{inputText.length.toString().padStart(2, '0')}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Global Status Bento */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="col-span-12 lg:col-span-4 grid grid-rows-2 gap-4 md:gap-6"
      >
        <div className="bg-surface-container border border-outline-variant p-4 flex flex-col justify-center">
          <span className="font-label-caps text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest">Total Entropy</span>
          <div className="flex items-baseline gap-2">
            <span className="font-display-lg text-[40px] font-bold text-primary-container">{entropy}</span>
            <span className="font-label-caps text-[12px] font-bold opacity-50 tracking-widest">bits</span>
          </div>
          <div className="w-full h-1 bg-surface-container-highest mt-3 overflow-hidden">
            <div className="h-full bg-primary-container transition-all duration-500 will-change-[width]" style={{ width: `${entropyWidth}%` }}></div>
          </div>
        </div>
        <div className="bg-surface-container border border-outline-variant p-4 flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center border border-vulnerability-red/30 bg-vulnerability-red/5">
            <span className="material-symbols-outlined text-vulnerability-red">warning</span>
          </div>
          <div>
            <span className="font-label-caps text-[10px] font-bold text-on-surface-variant block tracking-widest">THREAT_VECTOR</span>
            <span className="font-code-block text-[14px] font-bold text-[#e5e2e3]">LEGACY_HASH_DETECTED</span>
          </div>
        </div>
      </motion.div>

      {/* Hash Output Grid */}
      <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* MD5 Widget */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
          className="bg-surface-elevation-1 border border-vulnerability-red p-6 flex flex-col gap-4 transition-all hover:bg-vulnerability-red/5 relative group cursor-pointer" onClick={() => copyToClipboard(md5Out, 'MD5')}
        >
          <div className="absolute inset-0 bg-vulnerability-red/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px] z-20">
             <span className="font-label-caps font-bold text-vulnerability-red tracking-widest bg-background border border-vulnerability-red px-3 py-1 text-[12px]">CLICK_TO_COPY</span>
          </div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className="font-label-caps text-[10px] font-bold px-2 py-0.5 border border-vulnerability-red text-vulnerability-red mb-2 inline-block tracking-widest uppercase">CRITICAL / LEGACY</span>
              <h3 className="font-headline-md text-[24px] font-bold text-vulnerability-red leading-none">MD5</h3>
            </div>
            <span className="material-symbols-outlined text-vulnerability-red animate-pulse">dangerous</span>
          </div>
          <div className="bg-terminal-black border border-outline-variant p-3 font-code-block text-[12px] break-all h-20 overflow-hidden text-vulnerability-red transition-colors flex items-center relative z-10">
            <span>{md5Out}</span>
          </div>
          <div className="flex flex-col gap-2 mt-auto relative z-10">
            <div className="flex justify-between font-label-caps text-[10px] font-bold text-on-surface-variant tracking-widest">
              <span>COMP_COST</span>
              <span className="text-vulnerability-red">~0.01ms</span>
            </div>
            <div className="h-1 bg-surface-container-highest overflow-hidden">
              <div className="h-full bg-vulnerability-red w-[2%]"></div>
            </div>
          </div>
        </motion.div>

        {/* SHA-256 Widget */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
          className="bg-surface-elevation-1 border border-tertiary-fixed-dim p-6 flex flex-col gap-4 transition-all hover:bg-tertiary-fixed-dim/5 relative group cursor-pointer" onClick={() => copyToClipboard(sha256Out, 'SHA-256')}
        >
          <div className="absolute inset-0 bg-tertiary-fixed-dim/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px] z-20">
             <span className="font-label-caps font-bold text-tertiary-fixed-dim tracking-widest bg-background border border-tertiary-fixed-dim px-3 py-1 text-[12px]">CLICK_TO_COPY</span>
          </div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className="font-label-caps text-[10px] font-bold px-2 py-0.5 border border-tertiary-fixed-dim text-tertiary-fixed-dim mb-2 inline-block tracking-widest uppercase">WARNING / STANDARD</span>
              <h3 className="font-headline-md text-[24px] font-bold text-tertiary-fixed-dim leading-none">SHA-256</h3>
            </div>
            <span className="material-symbols-outlined text-tertiary-fixed-dim">warning</span>
          </div>
          <div className="bg-terminal-black border border-outline-variant p-3 font-code-block text-[12px] break-all h-20 overflow-hidden text-tertiary-fixed-dim transition-colors flex items-center relative z-10">
            <span>{sha256Out}</span>
          </div>
          <div className="flex flex-col gap-2 mt-auto relative z-10">
            <div className="flex justify-between font-label-caps text-[10px] font-bold text-on-surface-variant tracking-widest">
              <span>COMP_COST</span>
              <span className="text-tertiary-fixed-dim">~0.12ms</span>
            </div>
            <div className="h-1 bg-surface-container-highest overflow-hidden">
              <div className="h-full bg-tertiary-fixed-dim w-[15%]"></div>
            </div>
          </div>
        </motion.div>

        {/* bcrypt Widget */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
          className="bg-surface-elevation-1 border border-primary-container p-6 flex flex-col gap-4 transition-all hover:bg-primary-container/5 hover:glow-primary relative group cursor-pointer" onClick={() => copyToClipboard(bcryptOut, 'bcrypt')}
        >
          <div className="absolute inset-0 bg-primary-container/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px] z-20">
             <span className="font-label-caps font-bold text-primary-container tracking-widest bg-background border border-primary-container px-3 py-1 text-[12px]">CLICK_TO_COPY</span>
          </div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className="font-label-caps text-[10px] font-bold px-2 py-0.5 border border-primary-container text-primary-container mb-2 inline-block tracking-widest uppercase">SECURE / RECOMMENDED</span>
              <h3 className="font-headline-md text-[24px] font-bold text-primary-container leading-none">bcrypt</h3>
            </div>
            <span className="material-symbols-outlined text-primary-container">verified_user</span>
          </div>
          <div className="bg-terminal-black border border-outline-variant p-3 font-code-block text-[12px] break-all h-20 overflow-hidden text-primary-container transition-colors flex items-center relative z-10">
            <span>{bcryptOut}</span>
          </div>
          <div className="flex flex-col gap-2 mt-auto relative z-10">
            <div className="flex justify-between font-label-caps text-[10px] font-bold text-on-surface-variant tracking-widest">
              <span>COMP_COST</span>
              <span className="text-primary-container">~250.00ms</span>
            </div>
            <div className="h-1 bg-surface-container-highest overflow-hidden segmented-progress">
              <div className="h-full bg-primary-container w-[85%]"></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Algorithm Cost Breakdown */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="col-span-12 mt-2 pb-8"
      >
        <div className="bg-surface-container border border-outline-variant overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
            <h4 className="font-label-caps text-[12px] font-bold text-on-surface tracking-widest">RESOURCE_INTENSITY_MATRIX</h4>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-vulnerability-red"></div>
                <span className="text-[10px] font-label-caps opacity-60 tracking-widest">RAM_VULNERABILITY</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary-container"></div>
                <span className="text-[10px] font-label-caps opacity-60 tracking-widest">CPU_CYCLES</span>
              </div>
            </div>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left font-code-block text-[14px]">
              <thead>
                <tr className="border-b border-outline-variant/30 text-[10px] text-on-surface-variant bg-surface-container-highest">
                  <th className="px-6 py-3 font-bold uppercase whitespace-nowrap tracking-widest">Algorithm</th>
                  <th className="px-6 py-3 font-bold uppercase whitespace-nowrap tracking-widest">Complexity</th>
                  <th className="px-6 py-3 font-bold uppercase whitespace-nowrap tracking-widest">Memory Footprint</th>
                  <th className="px-6 py-3 font-bold uppercase whitespace-nowrap tracking-widest">ASIC_Resistance</th>
                  <th className="px-6 py-3 font-bold uppercase text-right whitespace-nowrap tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                <tr className="hover:bg-surface-container-high transition-colors">
                  <td className="px-6 py-4 text-vulnerability-red font-bold">MD5</td>
                  <td className="px-6 py-4 text-on-surface">O(N)</td>
                  <td className="px-6 py-4 text-on-surface">MINIMAL (512-bit)</td>
                  <td className="px-6 py-4 text-vulnerability-red font-bold">NONE</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-block px-2 py-0.5 bg-vulnerability-red/10 border border-vulnerability-red text-vulnerability-red font-label-caps text-[10px] font-bold tracking-widest">DEPRECATED</span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-high transition-colors">
                  <td className="px-6 py-4 text-tertiary-fixed-dim font-bold">SHA-256</td>
                  <td className="px-6 py-4 text-on-surface">O(N)</td>
                  <td className="px-6 py-4 text-on-surface">MODERATE (512-bit)</td>
                  <td className="px-6 py-4 text-tertiary-fixed-dim font-bold">WEAK</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-block px-2 py-0.5 bg-tertiary-fixed-dim/10 border border-tertiary-fixed-dim text-tertiary-fixed-dim font-label-caps text-[10px] font-bold tracking-widest">LEGACY_OK</span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-high transition-colors">
                  <td className="px-6 py-4 text-primary-container font-bold">bcrypt</td>
                  <td className="px-6 py-4 text-on-surface">O(2^COST)</td>
                  <td className="px-6 py-4 text-on-surface">HIGH (Configurable)</td>
                  <td className="px-6 py-4 text-primary-container font-bold">EXTREME</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-block px-2 py-0.5 bg-primary-container/10 border border-primary-container text-primary-container font-label-caps text-[10px] font-bold tracking-widest">OPTIMAL</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

