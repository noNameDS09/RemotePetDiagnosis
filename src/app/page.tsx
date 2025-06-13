import { AppLayout } from "@/components/layout/app-layout";

import VideoFeed from "@/components/video/Video";

export default function PetConnectDashboard() {
  return (
    <AppLayout>
      <div className="flex justify-center items-center flex-col gap-6">
        <div className="flex justify-center items-center">
          <VideoFeed />
        </div>
      </div>
    </AppLayout>
  );
}
