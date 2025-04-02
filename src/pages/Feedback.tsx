
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Loader2 } from "lucide-react";
import { Feedback as FeedbackType } from "@/lib/types";
import { toast } from "sonner";

// Mock data
const mockFeedbackData: FeedbackType[] = [
  {
    id: "1",
    userName: "John Doe",
    userEmail: "john@example.com",
    companyName: "TechCorp",
    category: "UI/UX",
    sentiment: "positive",
    score: 0.85,
    text: "The new dashboard layout is much more intuitive and easier to navigate.",
    source: "form",
    tags: ["UI", "design", "positive"],
    createdAt: new Date().toISOString(),
    status: "new"
  },
  {
    id: "2",
    userName: "Sarah Johnson",
    userEmail: "sarah@example.com",
    companyName: "DataTech",
    category: "Performance",
    sentiment: "negative",
    score: 0.2,
    text: "The application has been running very slowly lately, especially when generating reports.",
    source: "email",
    tags: ["performance", "speed", "reports"],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: "reviewed"
  },
  {
    id: "3",
    userName: "Michael Smith",
    userEmail: "michael@example.com",
    companyName: "SoftSolutions",
    category: "Features",
    sentiment: "neutral",
    score: 0.5,
    text: "It would be helpful if we could customize the dashboard widgets.",
    source: "form",
    tags: ["feature request", "dashboard", "customization"],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    status: "new"
  },
  {
    id: "4",
    userName: "Emily Chen",
    userEmail: "emily@example.com",
    companyName: "InnovateTech",
    category: "Support",
    sentiment: "positive",
    score: 0.75,
    text: "Customer support was very helpful and resolved my issue quickly.",
    source: "social",
    tags: ["support", "customer service", "issue resolution"],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    status: "responded"
  },
  {
    id: "5",
    userName: "Alex Wong",
    userEmail: "alex@example.com",
    companyName: "CloudWorks",
    category: "Documentation",
    sentiment: "negative",
    score: 0.3,
    text: "The API documentation is outdated and difficult to follow.",
    source: "api",
    tags: ["documentation", "API", "developer experience"],
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    status: "closed"
  },
];

const Feedback = () => {
  const { token } = useAuth();
  const [feedback, setFeedback] = useState<FeedbackType[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<FeedbackType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        // For now, we'll use mock data
        setTimeout(() => {
          setFeedback(mockFeedbackData);
          setFilteredFeedback(mockFeedbackData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        toast.error("Failed to load feedback");
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [token]);

  useEffect(() => {
    let result = [...feedback];

    // Apply tab filter
    if (activeTab !== "all") {
      result = result.filter((item) => item.status === activeTab);
    }

    // Apply sentiment filter
    if (sentimentFilter !== "all") {
      result = result.filter((item) => item.sentiment === sentimentFilter);
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.text.toLowerCase().includes(term) ||
          (item.userName?.toLowerCase() || "").includes(term) ||
          (item.companyName?.toLowerCase() || "").includes(term) ||
          item.category.toLowerCase().includes(term)
      );
    }

    setFilteredFeedback(result);
  }, [feedback, searchTerm, sentimentFilter, activeTab]);

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <Badge className="bg-green-100 text-green-800">Positive</Badge>;
      case "negative":
        return <Badge className="bg-red-100 text-red-800">Negative</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Neutral</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">New</Badge>;
      case "reviewed":
        return <Badge variant="outline" className="border-purple-500 text-purple-500">Reviewed</Badge>;
      case "responded":
        return <Badge variant="outline" className="border-green-500 text-green-500">Responded</Badge>;
      case "closed":
        return <Badge variant="outline" className="border-gray-500 text-gray-500">Closed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Feedback Management</h1>
        <p className="text-muted-foreground">
          View, filter, and respond to customer feedback
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full items-center space-x-2 md:w-1/3">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={sentimentFilter}
              onValueChange={setSentimentFilter}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiments</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
          <TabsTrigger value="responded">Responded</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredFeedback.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <p className="text-lg font-medium">No feedback found</p>
              <p className="text-sm text-muted-foreground">
                Try changing your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Feedback</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeedback.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{item.userName || "Anonymous"}</span>
                          {item.companyName && (
                            <span className="text-xs text-muted-foreground">
                              {item.companyName}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        <p className="truncate">{item.text}</p>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{getSentimentBadge(item.sentiment)}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Feedback;
