
import { toast } from "@/components/ui/use-toast";

// API endpoint for Gemini
const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent";

export interface GeminiRequestOptions {
  apiKey: string;
  prompt: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export const generateSummaryWithGemini = async (
  videoTitle: string,
  apiKey: string
): Promise<string | null> => {
  try {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key in the settings",
        variant: "destructive",
      });
      return null;
    }

    const prompt = `
      Please provide a comprehensive summary of the following YouTube video:
      "${videoTitle}"
      
      Follow this specific format:
      
      ## Introduction [0:00]
      Provide a brief overview of what the video is about.
      
      ## Main Content
      Break down the video content into clear sections with timestamps, for example:
      
      ## [2:15] Topic One
      Summarize this section of the video.
      
      ## [5:30] Topic Two
      Summarize this section of the video.
      
      IMPORTANT - Questions Asked:
      - If any questions are asked in the video, include them with their timestamps and answers.
      - Format questions as: "Q: [10:25] What is the question asked?"
      - Include the answer below each question.
      
      ## Key Takeaways
      List 3-5 main points or lessons from the video.
      
      Note:
      - Use timestamps in the [MM:SS] format when possible
      - Break long paragraphs into smaller ones for readability
      - Maintain chronological order
      - Remember to include any important questions asked in the video
      - Be informative and precise
    `;

    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1000,
          topP: 0.8,
          topK: 40,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`API error: ${response.status} - ${errorData?.error?.message || "Unknown error"}`);
    }

    const data = await response.json();
    const summaryText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!summaryText) {
      throw new Error("No summary generated");
    }

    return summaryText;
  } catch (error) {
    console.error("Error generating summary:", error);
    toast({
      title: "Summary Generation Failed",
      description: error instanceof Error ? error.message : "Failed to generate summary",
      variant: "destructive",
    });
    return null;
  }
};
