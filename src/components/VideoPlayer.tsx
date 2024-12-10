import { useRef, useEffect } from 'react';

interface VideoPlayerProps {
  url: string;
  onEnded?: () => void;
  autoPlay?: boolean;
}

export default function VideoPlayer({ url, onEnded, autoPlay = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = url;
      if (autoPlay) {
        videoRef.current.play();
      }
    }
  }, [url, autoPlay]);

  return (
    <div className="relative w-full aspect-w-16 aspect-h-9">
      <video
        ref={videoRef}
        className="w-full h-full rounded-lg object-cover"
        controls
        onEnded={onEnded}
      />
    </div>
  );
} 