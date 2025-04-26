import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import VideoUrlInput from "@/components/VideoUrlInput";
import VideoDisplay from "@/components/VideoDisplay";
import SummaryDisplay from "@/components/SummaryDisplay";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateSummaryWithGemini } from "@/utils/geminiApi";

interface VideoInfo {
  title: string;
  thumbnail: string;
  channel: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    return savedKey || "";
  });

  const handleSubmit = async (url: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Extract video ID
      const videoId = extractVideoId(url);
      if (!videoId) {
        throw new Error("Could not extract video ID from URL");
      }

      // Fetch video info from YouTube oEmbed API
      const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      const oEmbedResponse = await fetch(oEmbedUrl);
      
      if (!oEmbedResponse.ok) {
        throw new Error("Failed to fetch video information");
      }
      
      const videoData = await oEmbedResponse.json();
      
      // Update video info
      setVideoInfo({
        title: videoData.title,
        thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "",
        channel: videoData.author_name || "YouTube Channel"
      });

      // Generate summary using Gemini
      const summaryText = await generateSummaryWithGemini(videoData.title, apiKey);
      
      if (summaryText) {
        setSummary(summaryText);
        toast({
          title: "Success!",
          description: "Video summary generated successfully",
        });
      } else {
        throw new Error("Failed to generate summary");
      }
    } catch (error) {
      console.error("Error processing video:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      toast({
        title: "Error",
        description: "Failed to process the video. Please try again.",
        variant: "destructive",
      });
      // Keep any previous summary if there was an error
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save API key to localStorage when it changes
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    localStorage.setItem("gemini_api_key", newKey);
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
          
          <div className="mb-6 max-w-md mx-auto">
            <Label htmlFor="api-key" className="text-left block mb-2">
              Gemini API Key <span className="text-xs text-youtube-gray">(required)</span>
            </Label>
            <Input 
              id="api-key" 
              type="password"
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="Enter your Gemini API key"
              className="mb-2"
            />
            <p className="text-xs text-left text-youtube-gray">
              Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-youtube-red hover:underline">Google AI Studio</a>
            </p>
          </div>
          
          <VideoUrlInput onSubmit={handleSubmit} isLoading={isLoading} />
        </section>
        
        {(videoInfo || isLoading) && (
          <section className="mt-8">
            <VideoDisplay videoInfo={videoInfo} />
            <SummaryDisplay summary={summary} isLoading={isLoading} error={error} />
          </section>
        )}
      </main>
      
      <footer className="border-t border-gray-200 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-youtube-gray">
          <p>© 2025 TubeScribe AI. Not affiliated with YouTube.</p>
          <p className="mt-1">This app uses the Gemini API to generate video summaries.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
