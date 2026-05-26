import { useState, useEffect } from 'react';

export default function HardwareStats({ type }: { type: 'gpu' | 'cpu' }) {
  const isGpu = type === 'gpu';
  const name = isGpu ? 'GPU_CLUSTER_0' : 'CPU_NODE_POOL';
  const nodesCount = isGpu ? 4 : 8;
  const unit = isGpu ? 'TFLOPS' : 'GHZ';
  const totalPower = isGpu ? '184.2' : '480.0';

  const [activeNodes, setActiveNodes] = useState(nodesCount);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveNodes(Math.max(nodesCount - Math.floor(Math.random() * 2), 0));
    }, 3000);
    return () => clearInterval(t);
  }, [nodesCount]);

  return (
    <div className="max-w-[1440px] mx-auto pb-12 w-full space-y-6">
      <div className="flex items-end gap-2 border-b-2 border-primary-container pb-2 w-fit">
        <h2 className="font-headline-md text-[28px] uppercase tracking-tighter text-on-surface">{name} Monitor</h2>
        <span className="font-code-block text-primary-container mb-1 text-[12px] animate-pulse glow-text shadow-primary">ONLINE</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(nodesCount)].map((_, i) => (
          <div key={i} className="bg-surface-elevation-1 border border-outline-variant p-4 hover:border-primary-container transition-colors group">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-label-caps text-[12px] text-primary-fixed-dim uppercase tracking-widest">NODE_{i.toString().padStart(2, '0')}</h3>
              {i < activeNodes ? (
                <span className="w-2 h-2 rounded-full bg-primary-container shadow-[0_0_8px_#00ff41]"></span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-vulnerability-red"></span>
              )}
            </div>
            
            <div className="relative h-2 bg-surface-container border border-outline-variant mb-2 overflow-hidden">
              <div 
                className={`absolute inset-y-0 left-0 transition-all duration-1000 ${i < activeNodes ? 'bg-primary-container glow-primary' : 'bg-surface-variant'}`} 
                style={{ width: `${i < activeNodes ? Math.random() * 40 + 60 : 0}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between font-code-block text-[10px] text-on-surface-variant">
              <span>LOAD</span>
              <span>{i < activeNodes ? Math.round(Math.random() * 40 + 60) : 0}%</span>
            </div>
            
            <div className="mt-4 flex justify-between font-code-block text-[10px] text-on-surface-variant">
              <span>TEMP</span>
              <span className={i < activeNodes && Math.random() > 0.8 ? "text-vulnerability-red font-bold" : ""}>
                {i < activeNodes ? Math.round(50 + Math.random() * 40) : 25}°C
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-terminal-black border border-outline-variant p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary-container glow-primary"></div>
        <h3 className="font-label-caps text-[12px] text-on-surface uppercase tracking-widest mb-4">AGGREGATE_THROUGHPUT</h3>
        <div className="flex items-baseline gap-4 relative z-10">
          <span className="font-headline-md text-[48px] text-primary-container font-bold">{totalPower}</span>
          <span className="font-code-block text-[18px] text-on-surface-variant">{unit}</span>
        </div>
        <div className="absolute top-1/2 right-6 -translate-y-1/2 opacity-20 pointer-events-none">
           <span className="material-symbols-outlined text-[120px] text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isGpu ? 'memory' : 'developer_board'}
           </span>
        </div>
      </div>
    </div>
  );
}
