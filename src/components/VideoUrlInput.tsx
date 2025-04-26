
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

interface VideoUrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const VideoUrlInput = ({ onSubmit, isLoading }: VideoUrlInputProps) => {
  const [url, setUrl] = useState("");

  const isValidYouTubeUrl = (url: string) => {
    // Basic validation for YouTube URLs
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return regex.test(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a YouTube URL",
        variant: "destructive",
      });
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      toast({
        title: "Error",
        description: "Please enter a valid YouTube URL",
        variant: "destructive",
      });
      return;
    }

    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="text"
          placeholder="Paste YouTube URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-youtube-red hover:bg-red-600 text-white transition-colors"
        >
          {isLoading ? "Processing..." : "Summarize"}
        </Button>
      </div>
      <p className="text-xs text-youtube-gray text-center">
        Enter any YouTube video URL to get a quick summary
      </p>
    </form>
  );
};

export default VideoUrlInput;
