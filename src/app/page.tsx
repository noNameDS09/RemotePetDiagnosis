import { AppLayout } from "@/components/layout/app-layout";

import { AiAlertsCard } from "@/components/alerts/ai-alerts-card";
import { DocumentationCard } from "@/components/documentation/documentation-card";
import VideoFeed from "@/components/video/Video";

export default function PetConnectDashboard() {
  return (
    <AppLayout>
      <div className="flex justify-center items-center flex-col gap-6">
        <div className="flex justify-center items-center">
          <VideoFeed />

        </div>
        <div></div>

        <div className="flex gap-6">
          <AiAlertsCard />d
          <DocumentationCard />
        </div>
      </div>
    </AppLayout>
  );
}
