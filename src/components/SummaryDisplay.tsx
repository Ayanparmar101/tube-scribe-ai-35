import React from 'react';
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

  const renderFormattedSummary = () => {
    const lines = summary ? summary.split('\n') : [];
    const formattedContent = [];
    
    let currentSection = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line === '') continue;
      
      const headingPattern = /^## (.+)$/;
      
      if (headingPattern.test(line)) {
        if (currentSection) {
          formattedContent.push(currentSection);
        }
        
        currentSection = {
          heading: line.replace("##", "").trim(),
          paragraphs: []
        };
      } else if (currentSection) {
        const cleanedLine = line
          .replace(/\[\d+:\d+\]/g, '')
          .replace(/^Q:\s*/g, '')
          .trim();
        
        if (cleanedLine) {
          currentSection.paragraphs.push(cleanedLine);
        }
      }
    }
    
    if (currentSection) {
      formattedContent.push(currentSection);
    }
    
    return formattedContent.map((section, index) => (
      <div key={index} className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-youtube-dark">
          {section.heading}
        </h3>
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
