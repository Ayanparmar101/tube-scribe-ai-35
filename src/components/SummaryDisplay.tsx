
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      
      // Enhanced heading detection - more strict patterns
      const headingPattern = /^## (\[\d+:\d+\])?\s*(.+)$/; // Matches "## [MM:SS] Heading" or "## Heading"
      const standaloneTimestampPattern = /^\[\d+:\d+\]\s*(.+)$/; // Matches "[MM:SS] Content"
      const questionPattern = /^Q:\s*\[\d+:\d+\]\s*(.+)$/; // Matches "Q: [MM:SS] Question"
      
      const isHeading = headingPattern.test(line);
      const isStandaloneTimestamp = standaloneTimestampPattern.test(line);
      const isQuestion = questionPattern.test(line);
      
      // Extract timestamp if present in the line
      const timestampMatch = line.match(/\[(\d+:\d+)\]/);
      const timestamp = timestampMatch ? timestampMatch[1] : null;
      
      if (isHeading) {
        // Add the current section if it exists
        if (currentSection) {
          formattedContent.push(currentSection);
        }
        
        // Extract heading and timestamp
        const headingMatch = line.match(headingPattern);
        const headingText = headingMatch ? headingMatch[2] : line.replace("##", "").trim();
        
        // Create a new section
        currentSection = {
          heading: headingText,
          timestamp: timestamp,
          paragraphs: []
        };
      } else if (isQuestion) {
        // Handle questions specifically
        if (currentSection && currentSection.heading.includes("Questions")) {
          // Add to existing question section
          currentSection.paragraphs.push({
            text: line,
            timestamp: timestamp
          });
        } else {
          // Create new question section if needed
          if (currentSection) {
            formattedContent.push(currentSection);
          }
          
          currentSection = {
            heading: "Questions Asked",
            timestamp: null,
            paragraphs: [{
              text: line,
              timestamp: timestamp
            }]
          };
        }
      } else if (isStandaloneTimestamp && currentSection) {
        // Handle lines that start with timestamps but aren't headings
        currentSection.paragraphs.push({
          text: line.replace(/^\[\d+:\d+\]\s*/, ""),
          timestamp: timestamp
        });
      } else if (currentSection) {
        // Check for inline timestamps
        const inlineTimestampMatch = line.match(/\[(\d+:\d+)\]/);
        
        // Add the line to the current section
        currentSection.paragraphs.push({
          text: line,
          timestamp: inlineTimestampMatch ? inlineTimestampMatch[1] : null
        });
      } else {
        // If there's no current section, create a default one
        currentSection = {
          heading: "Summary",
          timestamp: timestamp,
          paragraphs: [{
            text: line,
            timestamp: timestamp
          }]
        };
      }
    }
    
    // Add the last section if it exists
    if (currentSection) {
      formattedContent.push(currentSection);
    }
    
    return formattedContent.map((section, index) => (
      <div key={index} className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-youtube-dark flex items-center gap-2">
          {section.timestamp ? (
            <Badge variant="outline" className="bg-youtube-red text-white border-none">
              {section.timestamp}
            </Badge>
          ) : null}
          <span>{section.heading}</span>
        </h3>
        {section.paragraphs.map((paragraph, pIdx) => {
          if (typeof paragraph === 'string') {
            // Handle legacy string paragraphs for backward compatibility
            return <p key={pIdx} className="mb-3">{paragraph}</p>;
          }
          
          // Handle question formatting
          if (paragraph.text.startsWith("Q:")) {
            return (
              <div key={pIdx} className="mb-4">
                <p className="font-medium flex items-center gap-2">
                  {paragraph.timestamp && (
                    <Badge variant="outline" className="bg-gray-200 text-gray-700 border-none">
                      {paragraph.timestamp}
                    </Badge>
                  )}
                  <span>{paragraph.text.replace(/\[\d+:\d+\]/, "").trim()}</span>
                </p>
                {/* If next item is the answer */}
                {section.paragraphs[pIdx + 1] && !section.paragraphs[pIdx + 1].text?.startsWith("Q:") && (
                  <p key={`answer-${pIdx}`} className="pl-6 mt-1 text-gray-700">
                    {typeof section.paragraphs[pIdx + 1] === 'string' 
                      ? section.paragraphs[pIdx + 1]
                      : section.paragraphs[pIdx + 1].text
                    }
                  </p>
                )}
              </div>
            );
          }
          
          // Handle paragraphs with timestamps
          if (paragraph.timestamp) {
            return (
              <div key={pIdx} className="mb-3 flex items-start gap-2">
                <Badge variant="outline" className="bg-gray-200 text-gray-700 border-none mt-0.5">
                  {paragraph.timestamp}
                </Badge>
                <p>{paragraph.text.replace(/\[\d+:\d+\]/, "").trim()}</p>
              </div>
            );
          }
          
          // Handle regular paragraphs
          // Check for inline timestamps
          const inlineTimestampMatch = paragraph.text.match(/\[(\d+:\d+)\]/);
          if (inlineTimestampMatch) {
            const parts = paragraph.text.split(/(\[\d+:\d+\])/);
            return (
              <p key={pIdx} className="mb-3">
                {parts.map((part, partIdx) => {
                  if (part.match(/\[\d+:\d+\]/)) {
                    return (
                      <Badge key={partIdx} variant="outline" className="bg-gray-200 text-gray-700 border-none mx-1">
                        {part.replace(/[\[\]]/g, '')}
                      </Badge>
                    );
                  }
                  return <span key={partIdx}>{part}</span>;
                })}
              </p>
            );
          }
          
          return <p key={pIdx} className="mb-3">{paragraph.text}</p>;
        })}
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
