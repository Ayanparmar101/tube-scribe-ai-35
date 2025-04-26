
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";

interface SummaryDisplayProps {
  summary: string | null;
  isLoading: boolean;
  error?: string | null;
}

const SummaryDisplay = ({ summary, isLoading, error }: SummaryDisplayProps) => {
  if (isLoading) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse-light"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="h-4 bg-gray-200 rounded animate-pulse-light"
              style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
            ></div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    const isApiVersionError = error.includes("models/gemini") || error.includes("API version") || error.includes("not found");
    
    return (
      <Card className="w-full max-w-3xl mx-auto mt-6 border-red-200">
        <CardHeader className="text-red-500">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle size={18} />
            Summary Error
          </CardTitle>
          <Separator className="bg-red-200" />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-red-500">{error}</p>
          
          {isApiVersionError && (
            <div className="text-sm bg-red-50 p-3 rounded-md border border-red-100">
              <p className="font-medium mb-1">Troubleshooting tips:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Verify that your API key is correct and has access to the Gemini API</li>
                <li>Make sure your API key has the appropriate permissions for Gemini models</li>
                <li>We're now using the gemini-1.5-pro model which is the latest version</li>
                <li>Check if there are any regional restrictions for your API key</li>
                <li>Ensure your API key has billing enabled in Google AI Studio</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!summary) return null;

  // Function to process the summary text and render it with proper formatting
  const renderFormattedSummary = () => {
    // Split the summary by new lines
    const lines = summary.split('\n');
    const formattedContent = [];
    
    let currentSection = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line === '') continue;
      
      // Check if the line is a heading (either starts with ## or has timestamps)
      const isHeading = line.startsWith('##') || 
                        line.match(/^\[(\d+:\d+)\]/) || 
                        line.match(/^(\d+:\d+)/) ||
                        (line.length < 80 && (line.endsWith(':') || line.toUpperCase() === line));
      
      if (isHeading) {
        // Add the current section if it exists
        if (currentSection) {
          formattedContent.push(currentSection);
        }
        
        // Create a new section
        currentSection = {
          heading: line.replace(/^##\s*/, ''),
          paragraphs: []
        };
      } else if (line.startsWith('Q:') || line.startsWith('Question:')) {
        // Handle questions specifically
        if (!currentSection) {
          currentSection = {
            heading: "Questions from the Video",
            paragraphs: []
          };
        }
        formattedContent.push({
          heading: "Question",
          paragraphs: [line]
        });
      } else if (currentSection) {
        // Add the line to the current section
        currentSection.paragraphs.push(line);
      } else {
        // If there's no current section, create a default one
        currentSection = {
          heading: "Summary",
          paragraphs: [line]
        };
      }
    }
    
    // Add the last section if it exists
    if (currentSection) {
      formattedContent.push(currentSection);
    }
    
    return formattedContent.map((section, index) => (
      <div key={index} className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-youtube-dark">{section.heading}</h3>
        {section.paragraphs.map((paragraph, pIdx) => (
          <p key={pIdx} className="mb-3">{paragraph}</p>
        ))}
      </div>
    ));
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>Video Summary</CardTitle>
        <Separator />
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          {renderFormattedSummary()}
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryDisplay;
