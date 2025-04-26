
import { Youtube } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface VideoInfo {
  title: string;
  thumbnail: string;
  channel: string;
}

interface VideoDisplayProps {
  videoInfo: VideoInfo | null;
}

const VideoDisplay = ({ videoInfo }: VideoDisplayProps) => {
  if (!videoInfo) return null;

  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden shadow-md">
      <div className="relative aspect-video bg-youtube-lightGray">
        {videoInfo.thumbnail ? (
          <img 
            src={videoInfo.thumbnail} 
            alt={videoInfo.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Youtube size={64} className="text-youtube-red opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-youtube-red bg-opacity-80 flex items-center justify-center">
            <Youtube size={32} className="text-white" />
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <h2 className="text-xl font-bold line-clamp-2">{videoInfo.title}</h2>
        <p className="text-youtube-gray mt-1">{videoInfo.channel}</p>
      </CardContent>
    </Card>
  );
};

export default VideoDisplay;
