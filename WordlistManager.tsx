import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export default function WordlistManager({ onToast }: { onToast?: (msg: string, type: 'info' | 'success' | 'warning' | 'error') => void }) {
  const [entropyBars, setEntropyBars] = useState([
    { targetWidth: 15, currentWidth: 0, opacity: 10, left: 0 },
    { targetWidth: 25, currentWidth: 0, opacity: 20, left: 15 },
    { targetWidth: 20, currentWidth: 0, opacity: 40, left: 40 },
    { targetWidth: 30, currentWidth: 0, opacity: 20, left: 60 },
    { targetWidth: 10, currentWidth: 0, opacity: 10, left: 90 },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEntropyBars(bars => bars.map(bar => ({ ...bar, currentWidth: bar.targetWidth })));
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      <div className="scanline"></div>
      
      {/* Grid Layout for Entropy & Wordlists */}
      <div className="grid grid-cols-12 gap-4 md:gap-6 max-w-[1440px] mx-auto pb-12">
        {/* Headline Row */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="col-span-12 mb-4"
        >
          <div className="flex items-end gap-2 border-b-2 border-primary-container pb-2 w-fit">
            <h2 className="font-headline-md text-[28px] uppercase tracking-tighter text-on-surface">Entropy_Manager</h2>
            <span className="font-code-block text-primary-container mb-1 text-[12px]">v4.0.2</span>
          </div>
        </motion.div>

        {/* Left Column: Data Visualizations */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="col-span-12 lg:col-span-8 space-y-4 md:space-y-6"
        >
          {/* Large Entropy Chart Container */}
          <section className="bg-surface-elevation-1 border border-outline-variant p-6 relative overflow-hidden">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="font-headline-md text-[20px] text-primary-fixed-dim uppercase">Entropy Distribution</h3>
                <p className="font-body-md text-[14px] text-on-surface-variant">Bits of entropy across synthetic dataset [N=1.2M]</p>
              </div>
              <div className="text-right">
                <span className="font-code-block text-[10px] uppercase text-on-surface-variant tracking-widest">MODE: RADAR_SCAN</span>
              </div>
            </div>

            {/* Synthetic Radar/Bar Chart Visualization */}
            <div className="h-64 flex items-end justify-between gap-1 px-4 relative">
              {/* Background Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                <div className="border-t border-on-surface w-full"></div>
                <div className="border-t border-on-surface w-full"></div>
                <div className="border-t border-on-surface w-full"></div>
                <div className="border-t border-on-surface w-full"></div>
              </div>

              {/* Bars representing entropy levels */}
              {entropyBars.map((bar, i) => (
                <div 
                  key={i}
                  className={`h-48 bg-primary-container absolute bottom-0 entropy-bar`} 
                  style={{ width: `${bar.currentWidth}%`, opacity: bar.opacity / 100, left: `${bar.left}%`, height: `${48 + (i % 2 === 0 ? -16 : 16 + i * 8)}px` }}
                ></div>
              ))}

              {/* Data Points Overlay */}
              <div className="absolute inset-0 flex items-center justify-around pointer-events-none">
                <div className="w-2 h-2 bg-primary-container glow-primary rotate-45"></div>
                <div className="w-2 h-2 bg-primary-container glow-primary rotate-45 translate-y-[-20px]"></div>
                <div className="w-2 h-2 bg-primary-container glow-primary rotate-45 translate-y-[-60px]"></div>
                <div className="w-2 h-2 bg-primary-container glow-primary rotate-45 translate-y-[-10px]"></div>
                <div className="w-2 h-2 bg-primary-container glow-primary rotate-45 translate-y-[30px]"></div>
              </div>

              {/* X-Axis Labels */}
              <div className="absolute bottom-[-24px] w-full flex justify-between font-code-block text-[10px] text-on-surface-variant">
                <span>0 bits</span>
                <span>32 bits</span>
                <span>64 bits</span>
                <span>96 bits</span>
                <span>128+ bits</span>
              </div>
            </div>

            <div className="mt-12 flex gap-8">
              <div className="flex items-center gap-3">
                <div className="p-2 border border-primary-container text-primary-container">
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
                <div>
                  <p className="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-widest">Mean Entropy</p>
                  <p className="font-code-block text-[18px] text-primary-container font-bold">42.82 bits</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 border border-secondary-fixed-dim text-secondary-fixed-dim">
                  <span className="material-symbols-outlined">analytics</span>
                </div>
                <div>
                  <p className="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-widest">Standard Dev</p>
                  <p className="font-code-block text-[18px] text-secondary-fixed-dim font-bold">12.1 σ</p>
                </div>
              </div>
            </div>
          </section>

          {/* Wordlist Management Table */}
          <section className="bg-surface-elevation-1 border border-outline-variant overflow-hidden">
            <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h3 className="font-label-caps text-[12px] font-bold uppercase tracking-widest text-on-surface">Active_Wordlists</h3>
              <div className="flex gap-2">
                <button onClick={() => onToast && onToast('Importing external list via secure tunnel...', 'info')} className="px-3 py-1 bg-surface-container-high border border-outline-variant font-code-block text-[11px] hover:border-primary-container transition-all outline-none focus:outline-none">IMPORT_LIST</button>
                <button onClick={() => onToast && onToast('Merge operation queued.', 'success')} className="px-3 py-1 bg-surface-container-high border border-outline-variant font-code-block text-[11px] hover:border-primary-container transition-all outline-none focus:outline-none">MERGE_LST</button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left font-code-block text-[12px]">
                <thead>
                  <tr className="bg-surface-container-lowest text-on-surface-variant border-b border-outline-variant">
                    <th className="px-4 py-3 font-bold uppercase tracking-widest">LIST_IDENTIFIER</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-widest">COUNT</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-widest">COVERAGE %</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-widest">HIT_RATE</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-widest text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  <tr className="hover:bg-surface-container-highest transition-colors group">
                    <td className="px-4 py-4 flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary-fixed-dim text-[16px]">terminal</span>
                      <span className="text-on-surface">rockyou.txt</span>
                    </td>
                    <td className="px-4 py-4 opacity-70">14,344,392</td>
                    <td className="px-4 py-4">
                      <div className="w-24 md:w-32 h-2 bg-surface-container-high border border-outline-variant flex items-stretch">
                        <div className="bg-primary-container" style={{ width: '88%' }}></div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-primary-container">12.4%</td>
                    <td className="px-4 py-4 text-right">
                      <span className="inline-block px-2 py-0.5 border border-primary-container text-[10px] text-primary-container font-bold tracking-widest">READY</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-highest transition-colors group">
                    <td className="px-4 py-4 flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary-fixed-dim text-[16px]">terminal</span>
                      <span className="text-on-surface">custom_leaks_2024.lst</span>
                    </td>
                    <td className="px-4 py-4 opacity-70">2,105,983</td>
                    <td className="px-4 py-4">
                      <div className="w-24 md:w-32 h-2 bg-surface-container-high border border-outline-variant flex items-stretch">
                        <div className="bg-primary-container" style={{ width: '42%' }}></div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-primary-container">35.9%</td>
                    <td className="px-4 py-4 text-right">
                      <span className="inline-block px-2 py-0.5 border border-primary-container text-[10px] text-primary-container font-bold tracking-widest">READY</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-highest transition-colors group">
                    <td className="px-4 py-4 flex items-center gap-3">
                      <span className="material-symbols-outlined text-vulnerability-red text-[16px]">warning</span>
                      <span className="text-on-surface">prob_dictionary_v2</span>
                    </td>
                    <td className="px-4 py-4 opacity-70">504,221</td>
                    <td className="px-4 py-4">
                      <div className="w-24 md:w-32 h-2 bg-surface-container-high border border-outline-variant flex items-stretch">
                        <div className="bg-vulnerability-red" style={{ width: '15%' }}></div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-vulnerability-red">0.2%</td>
                    <td className="px-4 py-4 text-right">
                      <span className="inline-block px-2 py-0.5 border border-vulnerability-red text-[10px] text-vulnerability-red font-bold tracking-widest">LOW_VAL</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-highest transition-colors group">
                    <td className="px-4 py-4 flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary-container text-[16px]">cached</span>
                      <span className="text-on-surface">dynamic_generator</span>
                    </td>
                    <td className="px-4 py-4 opacity-70">GEN_REALTIME</td>
                    <td className="px-4 py-4">
                      <div className="w-24 md:w-32 h-2 bg-surface-container-high border border-outline-variant flex items-stretch">
                        <div className="bg-secondary-fixed-dim animate-pulse" style={{ width: '100%' }}></div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-secondary-fixed-dim">COMPUTING...</td>
                    <td className="px-4 py-4 text-right">
                      <span className="inline-block px-2 py-0.5 border border-secondary-fixed-dim text-[10px] text-secondary-fixed-dim font-bold tracking-widest animate-pulse">ACTIVE</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </motion.div>

        {/* Right Column: Sidebar & Predictability Comparison */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="col-span-12 lg:col-span-4 space-y-4 md:space-y-6"
        >
          {/* Technical Sidebar Stats */}
          <section className="bg-surface-container border border-outline-variant p-5 space-y-6">
            <div className="flex items-center gap-2 border-l-2 border-primary-container pl-3">
              <span className="font-label-caps text-[12px] font-bold text-on-surface tracking-widest">SESSION_SUMMARY</span>
            </div>
            
            <div className="space-y-4">
              <div className="bg-terminal-black border border-outline-variant p-4">
                <p className="text-[10px] font-label-caps text-on-surface-variant mb-1 tracking-widest">INGESTED CREDENTIALS</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline-md text-[32px] text-primary-container font-bold">4.8M</span>
                  <span className="text-[10px] font-code-block text-on-primary-container bg-primary-container/20 px-1">+12.4%</span>
                </div>
              </div>

              <div className="bg-terminal-black border border-outline-variant p-4">
                <p className="text-[10px] font-label-caps text-on-surface-variant mb-1 tracking-widest">UNIQUE PATTERNS DETECTED</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline-md text-[24px] text-secondary-fixed-dim font-bold">12,402</span>
                  <span className="material-symbols-outlined text-[16px] text-secondary-fixed-dim">fingerprint</span>
                </div>
              </div>

              <div className="bg-terminal-black border border-outline-variant p-4">
                <p className="text-[10px] font-label-caps text-on-surface-variant mb-1 tracking-widest">HASHING_OVERHEAD</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline-md text-[24px] text-on-surface font-bold">0.04</span>
                  <span className="text-[10px] font-code-block text-on-surface-variant">ms/hash</span>
                </div>
              </div>
            </div>

            <div className="pt-4 pb-2">
              <img 
                className="w-full h-32 object-cover border border-outline-variant grayscale contrast-125 opacity-80" 
                alt="A technical visualization showing multiple scrolling system resource graphs on a dark, charcoal background." 
                src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=600&h=300"
              />
            </div>
          </section>

          {/* Comparison: User vs Predictability */}
          <section className="bg-surface-elevation-1 border border-outline-variant p-5">
            <h3 className="font-label-caps text-[12px] font-bold text-on-surface mb-6 uppercase tracking-widest">Predictability_Model</h3>
            
            <div className="space-y-8">
              {/* Comparator 1 */}
              <div className="relative pt-2">
                <div className="flex justify-between font-code-block text-[11px] mb-2 uppercase">
                  <span className="text-on-surface">Input Entropy</span>
                  <span className="text-primary-container font-bold">84.2 bits</span>
                </div>
                <div className="h-4 bg-surface-container-highest border border-outline-variant">
                  <div className="h-full bg-primary-container glow-primary" style={{ width: '84.2%' }}></div>
                </div>
                <p className="mt-2 font-body-md text-[12px] text-on-surface-variant italic">Significantly above average dictionary predictability.</p>
              </div>

              {/* Comparator 2 */}
              <div className="relative pt-4 border-t border-outline-variant/30">
                <div className="flex justify-between font-code-block text-[11px] mb-2 uppercase">
                  <span className="text-on-surface">Dict Predictability</span>
                  <span className="text-vulnerability-red font-bold">12.5 bits</span>
                </div>
                <div className="h-4 bg-surface-container-highest border border-outline-variant">
                  <div className="h-full bg-vulnerability-red" style={{ width: '12.5%' }}></div>
                </div>
                <p className="mt-2 font-body-md text-[12px] text-on-surface-variant italic">Vulnerable to standard rockyou.txt frequency attacks.</p>
              </div>

              {/* Analysis Terminal */}
              <div className="bg-terminal-black p-4 border border-outline-variant font-code-block text-[12px] text-primary-container/80 leading-relaxed overflow-hidden">
                <div className="flex gap-2 mb-1">
                  <span className="text-on-surface-variant">[09:24:12]</span>
                  <span>ANALYSIS_START: model_entropy_v4</span>
                </div>
                <div className="flex gap-2 mb-1">
                  <span className="text-on-surface-variant">[09:24:13]</span>
                  <span>CROSS_REF: top_100k_common_pw</span>
                </div>
                <div className="flex gap-2 text-on-surface">
                  <span className="text-on-surface-variant">[09:24:13]</span>
                  <span>RESULT: SUCCESS (MATCH_FAIL)</span>
                </div>
                <div className="mt-4 text-on-surface">
                  &gt; SYSTEM SECURE <span className="blinking-cursor"></span>
                </div>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
