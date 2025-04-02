
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Feedback } from "@/lib/types";

interface RecentFeedbackProps {
  feedback: Feedback[];
}

export function RecentFeedback({ feedback }: RecentFeedbackProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Feedback</CardTitle>
        <CardDescription>Latest feedback from your customers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedback.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No recent feedback</p>
          ) : (
            feedback.map((item) => (
              <div key={item.id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between mb-1">
                  <div className="font-medium">{item.userName || "Anonymous"}</div>
                  <Badge variant="outline" className={getSentimentColor(item.sentiment)}>
                    {item.sentiment}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.text}</p>
                <div className="flex items-center justify-between text-xs">
                  <div className="text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                  <Badge variant="outline">{item.category}</Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
