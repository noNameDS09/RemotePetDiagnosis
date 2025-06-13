import { AlertTriangle, Bot, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';

export function AiAlertsCard() {
  return (
    <Card className="shadow-lg h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-headline">
          <Bot className='h-6 w-6 text-gray-700'/>
          AI-Powered Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] md:h-[250px] pr-3">
          <div className="space-y-3">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-semibold">Unusual Pacing Detected</AlertTitle>
              <AlertDescription>
                Your pet has been pacing consistently for the last 15 minutes. This could indicate anxiety or discomfort.
              </AlertDescription>
            </Alert>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle className="font-semibold">Excessive Barking</AlertTitle>
              <AlertDescription>
                Continuous barking was detected for over 5 minutes at 10:45 AM. Possible distress or reaction to an external trigger.
              </AlertDescription>
            </Alert>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle className="font-semibold">Potential Lethargy</AlertTitle>
              <AlertDescription>
                Reduced activity levels observed compared to baseline. Monitor for other symptoms.
              </AlertDescription>
            </Alert>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
