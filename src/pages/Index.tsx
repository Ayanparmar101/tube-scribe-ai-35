
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import VideoUrlInput from "@/components/VideoUrlInput";
import VideoDisplay from "@/components/VideoDisplay";
import SummaryDisplay from "@/components/SummaryDisplay";

interface VideoInfo {
  title: string;
  thumbnail: string;
  channel: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  const handleSubmit = async (url: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, we would fetch video data and summary from an API
      // For now, we'll simulate this with a timeout and dummy data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulated video info
      const videoId = extractVideoId(url);
      setVideoInfo({
        title: "How to Build a YouTube Summarizer with React",
        thumbnail: videoId 
          ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` 
          : "",
        channel: "TubeScribe AI Channel"
      });
      
      // Simulated summary
      setSummary(
        "This video explains how to build a YouTube video summarizer using React and modern web technologies.\n\n" +
        "The presenter first explains the architecture of the application, highlighting the frontend built with React and Tailwind CSS.\n\n" +
        "Next, they demonstrate how to integrate with YouTube's API to fetch video metadata and transcripts.\n\n" +
        "The video then shows how to use natural language processing techniques to generate concise summaries from video transcripts.\n\n" +
        "Finally, they cover deployment options and potential enhancements like adding user accounts and saving favorite summaries."
      );
      
      toast({
        title: "Success!",
        description: "Video summary generated successfully",
      });
    } catch (error) {
      console.error("Error processing video:", error);
      toast({
        title: "Error",
        description: "Failed to process the video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Simple function to extract video ID from YouTube URL
  const extractVideoId = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        return urlObj.searchParams.get('v');
      } else if (urlObj.hostname.includes('youtu.be')) {
        return urlObj.pathname.substring(1);
      }
    } catch (e) {
      // Invalid URL, try regex as fallback
      const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(regex);
      return match ? match[1] : null;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 py-4 px-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-youtube-red rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">TS</span>
            </div>
            <h1 className="text-xl font-bold">TubeScribe AI</h1>
          </div>
          <div className="text-sm text-youtube-gray">
            YouTube Video Summarizer
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <section className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Summarize Any YouTube Video</h2>
          <p className="text-youtube-gray mb-6">
            TubeScribe AI analyzes YouTube videos and creates concise summaries 
            so you can quickly get the key points without watching the entire video.
          </p>
          
          <VideoUrlInput onSubmit={handleSubmit} isLoading={isLoading} />
        </section>
        
        {(videoInfo || isLoading) && (
          <section className="mt-8">
            <VideoDisplay videoInfo={videoInfo} />
            <SummaryDisplay summary={summary} isLoading={isLoading} />
          </section>
        )}
      </main>
      
      <footer className="border-t border-gray-200 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-youtube-gray">
          <p>© 2025 TubeScribe AI. Not affiliated with YouTube.</p>
          <p className="mt-1">This is a demo application and does not process real YouTube videos.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
