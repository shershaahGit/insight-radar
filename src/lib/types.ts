
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "analyst";
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Feedback {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  companyName?: string;
  category: string;
  sentiment: "positive" | "neutral" | "negative";
  score: number;
  text: string;
  source: "form" | "email" | "social" | "api";
  tags: string[];
  createdAt: string;
  status: "new" | "reviewed" | "responded" | "closed";
}

export interface FeedbackStats {
  total: number;
  positive: number;
  neutral: number;
  negative: number;
  categories: Record<string, number>;
  trend: {
    date: string;
    count: number;
    sentiment: {
      positive: number;
      neutral: number;
      negative: number;
    };
  }[];
}

export interface DashboardStats extends FeedbackStats {
  responseRate: number;
  avgResponseTime: number;
  topTags: {
    tag: string;
    count: number;
  }[];
  topCategories: {
    category: string;
    count: number;
  }[];
}
