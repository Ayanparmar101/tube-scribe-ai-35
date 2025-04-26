
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
    return (
      <Card className="w-full max-w-3xl mx-auto mt-6 border-red-200">
        <CardHeader className="text-red-500">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle size={18} />
            Summary Error
          </CardTitle>
          <Separator className="bg-red-200" />
        </CardHeader>
        <CardContent className="text-red-500">
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!summary) return null;

  return (
    <Card className="w-full max-w-3xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>Video Summary</CardTitle>
        <Separator />
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          {summary.split('\n').map((paragraph, idx) => (
            <p key={idx} className="mb-3">{paragraph}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryDisplay;
