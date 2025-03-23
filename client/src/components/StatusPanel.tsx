import { VideoIcon, Mic, Languages } from 'lucide-react';
import { PlayerStatus, RecognitionStatus, TranslationStatus } from '@/types';
import { getPlayerStatusText, getRecognitionStatusText, getTranslationStatusText } from '@/lib/utils';

interface StatusPanelProps {
  playerStatus: PlayerStatus;
  recognitionStatus: RecognitionStatus;
  translationStatus: TranslationStatus;
}

interface StatusCardProps {
  icon: React.ReactNode;
  title: string;
  status: string;
}

function StatusCard({ icon, title, status }: StatusCardProps) {
  return (
    <div className="bg-muted p-3 rounded-md">
      <div className="flex items-center">
        <div className="text-muted-foreground mr-2">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{status}</p>
        </div>
      </div>
    </div>
  );
}

export default function StatusPanel({
  playerStatus,
  recognitionStatus,
  translationStatus,
}: StatusPanelProps) {
  return (
    <section className="mb-6">
      <div className="bg-card text-card-foreground rounded-lg shadow-md p-4">
        <h2 className="text-lg font-medium mb-2">Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatusCard
            icon={<VideoIcon className="h-5 w-5" />}
            title="Video Player"
            status={getPlayerStatusText(playerStatus)}
          />
          
          <StatusCard
            icon={<Mic className="h-5 w-5" />}
            title="Speech Recognition"
            status={getRecognitionStatusText(recognitionStatus)}
          />
          
          <StatusCard
            icon={<Languages className="h-5 w-5" />}
            title="Translation"
            status={getTranslationStatusText(translationStatus)}
          />
        </div>
      </div>
    </section>
  );
}
