
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
      Please provide a concise and accurate summary of the following YouTube video:
      "${videoTitle}"
      
      Structure the summary with 4-5 paragraphs, covering the main points and key takeaways.
      Each paragraph should focus on a specific aspect or section of the video.
      Be informative and precise, highlighting the most valuable information from the video.
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
          maxOutputTokens: 800,
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
