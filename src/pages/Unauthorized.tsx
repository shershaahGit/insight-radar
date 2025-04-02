
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <Shield className="h-8 w-8 text-red-600" />
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Access Denied</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        You don't have permission to access this page
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link to="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
