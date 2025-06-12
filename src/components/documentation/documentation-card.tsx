import { FileText, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const sessionRecords = [
  { id: 1, type: "Session", date: "2024-07-28 (10:30 AM)", details: "Video_20240728_103000.mp4" },
  { id: 2, type: "Snapshot", date: "2024-07-28 (10:32 AM)", details: "Snap_20240728_103215.jpg" },
  { id: 3, type: "Session", date: "2024-07-27 (03:15 PM)", details: "Video_20240727_151500.mp4" },
  { id: 4, type: "Notes", date: "2024-07-27", details: "Consultation_Notes_DrSmith.txt" },
  { id: 5, type: "Report", date: "2024-07-26", details: "BehaviorAnalysis_Report.pdf" },
];

export function DocumentationCard() {
  return (
    <Card className="shadow-lg h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-headline">
          <FileText className="h-6 w-6 text-primary" />
          Session History & Docs
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between h-[calc(100%-theme(spacing.20))]"> {/* Adjust height based on CardHeader */}
        <ScrollArea className="h-[200px] md:h-[250px] pr-3 mb-4">
          <ul className="space-y-2">
            {sessionRecords.map((record) => (
              <li 
                key={record.id} 
                className="text-sm p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer shadow-sm"
                aria-label={`${record.type}: ${record.details} on ${record.date}`}
              >
                <p className="font-medium text-foreground">{record.type}: {record.details}</p>
                <p className="text-xs text-muted-foreground">{record.date}</p>
              </li>
            ))}
          </ul>
        </ScrollArea>
        <div className="mt-auto flex items-start text-xs text-muted-foreground p-3 border border-dashed rounded-md bg-muted/30">
          <ShieldCheck className="h-5 w-5 mr-2 text-green-600 shrink-0 mt-0.5" />
          <span>All data is stored securely and in compliance with current GDPR regulations. Sensitive information is encrypted and access is logged.</span>
        </div>
      </CardContent>
    </Card>
  );
}
