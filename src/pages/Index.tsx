
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart, MessageSquare, Users, ArrowRight } from "lucide-react";

const Index = () => {
  const features = [
    {
      title: "AI-Powered Analysis",
      description: "Automatically categorize and extract insights from feedback using advanced AI algorithms.",
      icon: <BarChart className="h-12 w-12 text-primary" />,
    },
    {
      title: "Sentiment Analysis",
      description: "Understand the emotional tone behind customer feedback to prioritize responses.",
      icon: <MessageSquare className="h-12 w-12 text-primary" />,
    },
    {
      title: "Role-Based Access",
      description: "Control who can view and respond to feedback with customizable user roles.",
      icon: <Users className="h-12 w-12 text-primary" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-primary to-secondary/70 text-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center gap-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-3xl">
              AI-Powered Customer Feedback Analysis
            </h1>
            <p className="text-lg md:text-xl max-w-2xl text-white/90">
              Collect, analyze, and gain valuable insights from customer feedback to improve your IT products and services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90">
                <Link to="/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features for IT Companies</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to collect and analyze customer feedback for actionable business insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col p-6 border rounded-xl card-hover">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 p-8 bg-white rounded-xl shadow-sm">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ready to transform your customer feedback?</h2>
              <p className="text-muted-foreground">Start gaining valuable insights today.</p>
            </div>
            <Button size="lg" asChild className="group">
              <Link to="/register">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FeedbackAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
