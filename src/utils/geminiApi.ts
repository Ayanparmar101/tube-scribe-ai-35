
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
      
      Follow this specific format EXACTLY:
      
      ## Introduction [0:00]
      Provide a brief overview of what the video is about.
      
      ## Main Content
      Break down the video content into 4-6 chronological sections with REALISTIC timestamps, for example:
      
      ## [2:15] Topic One
      Summarize this section of the video.
      
      ## [5:30] Topic Two
      Summarize this section of the video.
      
      ## Questions Asked
      If any questions are asked in the video, list them with realistic timestamps and answers.
      Format as: "Q: [10:25] What is the question asked?"
      Include the answer directly below each question.
      
      ## Key Takeaways
      List 3-5 main points or lessons from the video.
      
      IMPORTANT FORMATTING RULES:
      - Use REALISTIC timestamps in [MM:SS] format that progress chronologically through the video
      - For a typical 10-minute video, start with [0:00] and end around [8:00]-[10:00]
      - Space timestamps appropriately throughout the video duration
      - Each main section MUST start with "## " followed by the heading
      - Highlight important points with timestamps
      - Keep paragraphs short and focused
      - Questions MUST be formatted with "Q: " prefix and timestamp
      - Maintain chronological order of content
      - DO NOT SKIP ANY OF THESE SECTIONS
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
          temperature: 0.1, // Lower temperature for more consistent formatting
          maxOutputTokens: 1500, // Increased token limit for more detailed summaries
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
