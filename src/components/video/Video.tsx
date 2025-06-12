'use client';
import React, { useState } from "react";
import "../video/style.css";
import CameraFeed from "./CameraFeed";
import Button from '@mui/material/Button';

interface VideoProps {
  id: string;
  name: string;
  url: string;
}

const videoUrl1 = '/video.mp4';
const videoUrl2 = '/video2.mp4';
const videoUrl3 = '/video3.mp4';
const videoUrl4 = '/video4.mp4';

const Cameras: VideoProps[] = [
  { id: "FRONT", name: "FRONT", url: videoUrl4 },
  { id: "TOP", name: "TOP", url: videoUrl1 },
  { id: "LHS", name: "LHS", url: videoUrl3 },
  { id: "RHS", name: "RHS", url: videoUrl4 },
];

const VideoFeed = () => {
  const [mainCamera, setMainCamera] = useState<VideoProps>(Cameras[0]);

  return (
    <div className="md:h-[100vh] w-screen md:p-4 flex flex-col lg:flex-row gap-4 justify-center text-center">
      <div className="lg:w-[60%] bg-gray-100 rounded-xl lg:p-6 lg:px-8">
        <div className="md:h-fit mb-6 ring-1 rounded-lg ring-gray-300 bg-white">
          <CameraFeed cameraUrl={mainCamera.url} View={mainCamera.name} />
        </div>
        <div className="lg:flex lg:flex-row lg:gap-4 lg:justify-center lg:items-center four hidden lg:h-fit">
          {Cameras.map((camera) => (
            <CameraFeed key={camera.id} cameraUrl={camera.url} View={camera.name} />
          ))}
        </div>
      </div>
      <div className="lg:w-[20%] bg-gray-200 rounded-xl flex flex-col justify-start items-center md:pt-10 py-6 md:py-0">
        <div className="">Controls</div>
        <div className="pt-4 space-x-2 flex flex-row md:flex-row flex-wrap gap-y-2 justify-center items-center">
          {Cameras.map((camera) => (
            <Button
              variant="outlined"
              key={camera.id}
              onClick={() => setMainCamera(camera)}
            >
              {camera.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoFeed;
