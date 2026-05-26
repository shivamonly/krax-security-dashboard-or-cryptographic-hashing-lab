import { useState, useRef, useEffect } from 'react';
import InitializationTerminal from './components/InitializationTerminal';
import Workspace from './components/Workspace';
import AuthPortal from './components/AuthPortal';
import IntroSequence from './components/IntroSequence';

export default function App() {
  const [appState, setAppState] = useState<'intro' | 'init' | 'workspace'>('intro');
  const [isAudioPlaying, setIsAudioPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.play().catch(e => {
          console.warn('Autoplay blocked, requires user interaction', e);
          setIsAudioPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (isAudioPlaying && audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    };
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [isAudioPlaying]);

  return (
    <>
      {/* Background Audio Player */}
      <audio 
        ref={audioRef}
        src="/song.info).mp3" 
        loop
      />
      {/* Global Audio Toggle Button */}
      <button 
        onClick={() => setIsAudioPlaying(!isAudioPlaying)}
        className="fixed bottom-6 right-6 z-[999] w-[50px] h-[50px] rounded-full bg-surface-container-highest border border-primary-container/30 shadow-[0_0_15px_rgba(0,255,65,0.2)] hover:bg-surface-variant hover:border-primary-container hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] transition-all flex items-center justify-center group focus:outline-none cursor-pointer"
        title="Toggle Background Music"
      >
        {isAudioPlaying ? (
          <div className="w-[16px] h-[24px] overflow-hidden flex items-center justify-start pointer-events-none">
            <svg width="48" height="24" viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-wave-slide shrink-0 -ml-[4px] text-primary-container group-hover:text-primary transition-colors">
              <path d="M0 12l4-5 4 8 4-8 4 8 4-8 4 8 4-8 4 8 4-8 4 5" />
            </svg>
          </div>
        ) : (
          <div className="w-[16px] h-[3px] bg-primary-container group-hover:bg-primary transition-colors rounded-full pointer-events-none"></div>
        )}
      </button>

      {appState === 'intro' && <IntroSequence onComplete={() => setAppState('init')} />}
      {appState === 'init' && <InitializationTerminal onEnter={() => setAppState('workspace')} />}
      {appState === 'workspace' && <Workspace />}
    </>
  );
}
