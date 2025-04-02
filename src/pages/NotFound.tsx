
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="text-9xl font-extrabold text-primary">404</h1>
      <h2 className="mt-6 text-3xl font-bold tracking-tight">Page not found</h2>
      <p className="mt-3 text-lg text-muted-foreground">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
