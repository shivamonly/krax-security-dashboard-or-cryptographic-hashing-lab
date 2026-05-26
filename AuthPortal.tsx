import { useState, useEffect, useRef } from 'react';

export default function AuthPortal({ onLogin }: { onLogin: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const letters = "01010101010101ABCDEF";
    const fontSize = 14;
    let columns = width / fontSize;
    let drops: number[] = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    let animationFrameId: number;
    let lastDrawTime = 0;

    const drawMatrix = (timestamp: number) => {
      // throttle to ~60fps equivalent or 1000/60 ~ 16ms, original was 60ms which is 16fps
      if (timestamp - lastDrawTime > 60) {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#00ff41"; 
        ctx.font = fontSize + "px 'JetBrains Mono', monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = letters.charAt(Math.floor(Math.random() * letters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        lastDrawTime = timestamp;
      }
      animationFrameId = requestAnimationFrame(drawMatrix);
    };

    animationFrameId = requestAnimationFrame(drawMatrix);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = width / fontSize;
      drops = [];
      for (let i = 0; i < columns; i++) {
          drops[i] = 1;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="bg-background text-on-background font-body-md overflow-hidden min-h-screen flex items-center justify-center selection:bg-primary-container selection:text-on-primary-container w-full relative">
      {/* Background Layer (Retro Desk) */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-terminal-black">
        <img 
          alt="Retro hacker desk" 
          className="w-full h-full object-cover grayscale-[0.2] brightness-[0.7] animate-[video-fade-in_1.5s_ease-out_forwards]" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtZnqIHWpYMOQBeki3-LNSe91_LpSxOM6QVps8ycUSISbNzEM9azqEoobHPlso5b-TIeAdMvTjrTaKqvMfVPHk5RrAKLYcb9Bp7FERrAdteRcaq6F-21zOdBFKDaSdqBaQZKd8nwD7o6x7heQZbtPdTwJT5jHtXouxne7iUIUPHWRluxcTP91wg9jZ3uDci1R6S4joWFbm5DjZCnAUB1LjCIUuG2YXIr6dVsvqVyKbXE9dROVsmXpUuNgwniHfhQf8FY2vuYk2XQ"
        />
        {/* Dark overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/60 z-[1]"></div>
        {/* CRT effects */}
        <div className="absolute inset-0 crt-overlay opacity-40 z-[2]"></div>
        <div className="scanline"></div>
      </div>

      {/* Matrix Rain Canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-10 opacity-[0.08] pointer-events-none animate-[flicker_0.1s_infinite]" 
        style={{ maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)' }}
      ></canvas>

      {/* Main Login Container */}
      <main className="relative z-20 w-full max-w-lg px-6">
        {/* Header Branding */}
        <div className="flex flex-col items-center mb-10 space-y-2">
          <div className="flex items-center space-y-1 flex-col">
            <span className="font-headline-md text-[24px] font-black text-primary-container tracking-tighter glow-text shadow-primary">CRYPT_VAL_FRAMEWORK</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-[pulse-fast_1.5s_cubic-bezier(0.4,0,0.6,1)_infinite] shadow-[0_0_8px_#00ff41]"></span>
              <span className="font-label-caps text-[12px] text-on-surface-variant tracking-widest font-bold">LOGIN_PORTAL_V1</span>
            </div>
          </div>
        </div>

        {/* Terminal Card */}
        <div className="bg-surface-container-lowest/90 backdrop-blur-md border border-outline-variant glow-primary relative overflow-hidden">
          {/* Header Bar */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-outline-variant bg-surface-container-low/80">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary-container opacity-100" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
              <span className="font-label-caps text-[12px] font-bold text-on-surface tracking-widest">AUTH_REQUIRED</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-code-block text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">LEVEL: 0x04</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-on-surface-variant/20"></div>
                <div className="w-2 h-2 bg-on-surface-variant/20"></div>
                <div className="w-2 h-2 bg-primary-container animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8 space-y-8">
            <div className="border-l-2 border-primary-container bg-gradient-to-r from-primary-container/5 to-transparent p-4 space-y-2">
              <p className="font-code-block text-[14px] text-on-surface-variant italic">
                  &gt; ACCESS_LEVEL_4 detected...<br/>
                  &gt; CREDENTIAL_HANDSHAKE_INITIATED...
              </p>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px] text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                <span className="font-label-caps text-[10px] text-primary-container font-bold uppercase tracking-widest">ENCRYPTION_ACTIVE</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* GitHub Auth Button */}
              <button 
                onClick={onLogin}
                className="group w-full flex items-center justify-between p-4 border border-outline-variant bg-surface-container/60 hover:bg-primary-container transition-all duration-200 active:scale-[0.98] outline-none"
              >
                <div className="flex items-center gap-4">
                  <img alt="GitHub Logo" className="w-6 h-6 invert dark:invert-0 group-hover:invert group-hover:brightness-0 transition-all duration-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhBYMUFu0mfgt4oV5aoA4trsDslmSJxOZKwT-ppzrr9cwolja6XKZuE2xebQYRKo8jNSO3_AueK20dKRy4nQ-C4TDwRVXkOFYCPE0xy9wpi1hIdEPdaYnJh8BHM6cKV2YELJY-_7o6t624uVk1hp1ok4CcaizVzhSIBHoxTyY16llYa9uLN7fZLkKflXC9yBP4xD3xLcji8idsQplnMjXfHDRIZpMLGidyGocR5rsz284OgS1_xeXbcrTFuQtys1sHzf8xlnfEvg"/>
                  <span className="font-code-block text-[16px] font-bold text-on-surface group-hover:text-on-primary transition-all duration-200">CONTINUE_WITH_GITHUB</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-primary transition-all duration-200">terminal</span>
              </button>
              
              {/* Google Auth Button */}
              <button 
                onClick={onLogin}
                className="group w-full flex items-center justify-between p-4 border border-outline-variant bg-surface-container/60 hover:bg-primary-container transition-all duration-200 active:scale-[0.98] outline-none"
              >
                <div className="flex items-center gap-4">
                  <img alt="Google Logo" className="w-6 h-6 group-hover:brightness-0 group-hover:invert transition-all duration-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpk2EgOEyB3DPXgsaX5vtBIThYxWUsPwI0SKM64aWhQI_aRq7gLs4erK3xg8MywQtQDG0ldIsJA3p3kfiYN4HiiRp2836Iihz1GdG3s687lGAkGB8uugRa28WYiG0PgoacGadCjHS9d01gQG0uMJEPKjH-9kpX-2l_YNFNzr62zuBib6pMJWQGDPHGSVAzZu4afjvtW1Lqg-LyQZgbT5dHDJJmbITSe4Ke5mua3dHMaChvOUyEQns9CzUFcPT6mz-tlv3Z3cZftQ"/>
                  <span className="font-code-block text-[16px] font-bold text-on-surface group-hover:text-on-primary transition-all duration-200">CONTINUE_WITH_GOOGLE</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-primary transition-all duration-200">key</span>
              </button>
            </div>

            <div className="pt-4 flex flex-col items-center gap-3">
              <p className="font-label-caps text-[11px] text-on-surface-variant text-center tracking-widest font-bold">
                  UNAUTHORIZED ACCESS IS PROHIBITED UNDER PROTOCOL 0x8F-22A
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-surface-container-high/60 border border-outline-variant font-code-block text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">AES_256</span>
                <span className="px-2 py-1 bg-surface-container-high/60 border border-outline-variant font-code-block text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">RSA_4096</span>
                <span className="px-2 py-1 bg-surface-container-high/60 border border-outline-variant font-code-block text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">TLS_1.3</span>
              </div>
            </div>
          </div>

          {/* Footer Progress Bar */}
          <div className="h-1 bg-surface-container-high w-full">
            <div className="h-full bg-primary-container w-1/3 shadow-[0_0_10px_#00ff41] animate-pulse"></div>
          </div>
        </div>

        {/* Footer Meta Info */}
        <div className="mt-8 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="font-label-caps text-[10px] text-on-surface-variant font-bold tracking-widest">NODE_LOC</span>
            <span className="font-code-block text-[12px] text-primary-container font-bold uppercase tracking-widest mt-1">0x8F-CENTRAL-ALPHA</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-label-caps text-[10px] text-on-surface-variant font-bold tracking-widest">SYS_STABILITY</span>
            <span className="font-code-block text-[12px] text-primary-container font-bold uppercase tracking-widest mt-1">99.982%_STABLE</span>
          </div>
        </div>
      </main>

      {/* Overlay HUD Elements */}
      <div className="fixed top-6 left-6 pointer-events-none hidden md:block z-30">
        <div className="font-code-block text-[10px] text-primary-container/60 space-y-1 font-bold uppercase tracking-widest">
            <p>LATENCY: 12ms</p>
            <p>UPLINK: 4.2GBPS</p>
            <p>PACKETS: VALIDATED</p>
        </div>
      </div>
      <div className="fixed bottom-6 right-6 pointer-events-none hidden md:block z-30">
        <div className="font-code-block text-[10px] text-primary-container/60 flex flex-col items-end space-y-1 font-bold tracking-widest">
            <p>© 2024 CYBER_OPS_INTEL</p>
            <p>ALL_RIGHTS_RESERVED</p>
        </div>
      </div>
    </div>
  );
}
