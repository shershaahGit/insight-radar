import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { StatCard } from "@/components/dashboard/StatCard";
import { FeedbackChart } from "@/components/dashboard/FeedbackChart";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { RecentFeedback } from "@/components/dashboard/RecentFeedback";
import { BarChart, MessageSquare, Clock, ThumbsUp } from "lucide-react";
import { DashboardStats, Feedback } from "@/lib/types";
import { toast } from "sonner";

// Mock data for the initial render
const mockChartData = [
  { name: "Mon", positive: 40, neutral: 24, negative: 10 },
  { name: "Tue", positive: 30, neutral: 20, negative: 15 },
  { name: "Wed", positive: 20, neutral: 30, negative: 20 },
  { name: "Thu", positive: 35, neutral: 25, negative: 15 },
  { name: "Fri", positive: 45, neutral: 15, negative: 10 },
  { name: "Sat", positive: 25, neutral: 20, negative: 5 },
  { name: "Sun", positive: 15, neutral: 10, negative: 5 },
];

const mockCategoryData = [
  { name: "UI/UX", value: 30 },
  { name: "Performance", value: 25 },
  { name: "Features", value: 20 },
  { name: "Support", value: 15 },
  { name: "Documentation", value: 10 },
];

const mockFeedback: Feedback[] = [
  {
    id: "1",
    userName: "John Doe",
    category: "UI/UX",
    sentiment: "positive",
    score: 0.8,
    text: "The new dashboard layout is much more intuitive and easier to navigate.",
    source: "form",
    tags: ["UI", "design", "positive"],
    createdAt: new Date().toISOString(),
    status: "new"
  },
  {
    id: "2",
    userName: "Sarah Johnson",
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
    category: "Features",
    sentiment: "neutral",
    score: 0.5,
    text: "It would be helpful if we could customize the dashboard widgets.",
    source: "form",
    tags: ["feature request", "dashboard", "customization"],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    status: "new"
  },
];

const Dashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    total: 120,
    positive: 80,
    neutral: 30,
    negative: 10,
    responseRate: 85,
    avgResponseTime: 4.2,
    categories: {
      "UI/UX": 35,
      "Performance": 28,
      "Features": 24,
      "Support": 18,
      "Documentation": 15
    },
    topTags: [
      { tag: "performance", count: 28 },
      { tag: "ui", count: 24 },
      { tag: "feature request", count: 20 },
      { tag: "bug", count: 16 },
      { tag: "documentation", count: 12 }
    ],
    topCategories: [
      { category: "UI/UX", count: 35 },
      { category: "Performance", count: 28 },
      { category: "Features", count: 24 },
      { category: "Support", count: 18 },
      { category: "Documentation", count: 15 }
    ],
    trend: []
  });
  const [recentFeedback, setRecentFeedback] = useState<Feedback[]>(mockFeedback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        
        // In a real app, these would be actual API calls
        // For now, we'll simulate a network delay
        
        // setTimeout(() => {
        //   setStats(/* data from API */);
        //   setRecentFeedback(/* data from API */);
        //   setLoading(false);
        // }, 1000);
        
        // Keeping the mock data for now
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        toast.error("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">
          Here's an overview of your customer feedback analytics
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-[120px] animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Feedback"
              value={stats.total}
              icon={<MessageSquare className="h-4 w-4" />}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Positive Sentiment"
              value={`${Math.round((stats.positive / stats.total) * 100)}%`}
              icon={<ThumbsUp className="h-4 w-4" />}
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Response Rate"
              value={`${stats.responseRate}%`}
              icon={<BarChart className="h-4 w-4" />}
              trend={{ value: 5, isPositive: true }}
            />
            <StatCard
              title="Avg. Response Time"
              value={`${stats.avgResponseTime} hrs`}
              icon={<Clock className="h-4 w-4" />}
              trend={{ value: 10, isPositive: false }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FeedbackChart
              data={mockChartData}
              title="Feedback Trends"
              description="Sentiment analysis over time"
            />
            <CategoryPieChart
              data={mockCategoryData}
              title="Feedback Categories"
              description="Distribution by category"
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <RecentFeedback feedback={recentFeedback} />
          </div>
        </>
      )}
    </div>
  );
};

// Helper component for skeleton placeholder
const Card = ({ className }: { className?: string }) => {
  return <div className={`bg-muted rounded-lg ${className}`}></div>;
};

export default Dashboard;
