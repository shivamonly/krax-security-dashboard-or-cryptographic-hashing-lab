import { useState, useRef, useEffect } from 'react';
import CountUp from './CountUp';

export default function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'video' | 'blank'>('video');
  const [videoDuration, setVideoDuration] = useState<number>(3); // fallback duration
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (phase === 'blank') {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  const handleVideoEnd = () => {
    setPhase('blank');
  };

  const handleVideoError = () => {
    // If the video fails to load, gracefully degradation to blank screen
    setPhase('blank');
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      // Ensure we have a valid positive duration
      const duration = videoRef.current.duration;
      if (duration && duration > 0 && Number.isFinite(duration)) {
        setVideoDuration(duration);
      }
    }
    setIsVideoLoaded(true);
  };

  if (phase === 'blank') {
    return <div className="fixed inset-0 bg-black z-[9999]"></div>;
  }

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        onError={handleVideoError}
        onLoadedMetadata={handleLoadedMetadata}
        // To use your specific video, upload it to the 'public' directory in the files tab, 
        // name it 'intro.mp4', and change this src to: src="/intro.mp4"
        src="/my-intro.mp4"
        className="w-full h-full object-cover"
      >
      </video>

      {/* Overlay Counter in place of skip button */}
      {isVideoLoaded && (
        <div className="absolute bottom-8 right-8 flex items-end pointer-events-none z-10">
          <div className="text-white font-mono text-2xl sm:text-3xl font-bold tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] leading-none">
            <CountUp
              from={0}
              to={100}
              separator=","
              direction="up"
              duration={videoDuration}
              className="count-up-text"
              delay={0}
            />
            <span className="text-lg sm:text-xl text-white/70 ml-1">%</span>
          </div>
        </div>
      )}
    </div>
  );
}
