'use client'
import React, { useRef } from 'react';
// import FullscreenIcon from '@mui/icons-material/Fullscreen';

interface CameraProps {
  View: string;
  cameraUrl: string;
}

const CameraFeed: React.FC<CameraProps> = ({ View, cameraUrl }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if ((videoRef.current as any).webkitRequestFullscreen) {
        (videoRef.current as any).webkitRequestFullscreen();
      } else if ((videoRef.current as any).mozRequestFullScreen) {
        (videoRef.current as any).mozRequestFullScreen();
      } else if ((videoRef.current as any).msRequestFullscreen) {
        (videoRef.current as any).msRequestFullscreen();
      }
    }
  };

  return (
    <div className='relative w-full h-full rounded-lg bg-white ring-1 ring-gray-300 p-2'>
      <div className='font-semibold text-[16px] h-8 text-center'>{View}</div>

      <video
        ref={videoRef}
        src={cameraUrl}
        className='w-full h-auto rounded-b-lg'
        autoPlay
        loop
        muted
        playsInline
        controls={false}
      />

      {/* Fullscreen Button - bottom right */}
      <button
        onClick={handleFullscreen}
        className='absolute bottom-2 right-2 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 shadow-md'
        aria-label="Fullscreen"
      >
        {/* <FullscreenIcon fontSize="small" /> */}
        FS
      </button>
    </div>
  );
};

export default CameraFeed;
