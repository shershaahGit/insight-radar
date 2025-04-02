
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";

interface ProtectedRouteProps {
  allowedRoles?: Array<"admin" | "manager" | "analyst">;
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    } else if (
      !isLoading &&
      isAuthenticated &&
      allowedRoles &&
      user &&
      !allowedRoles.includes(user.role)
    ) {
      navigate("/unauthorized");
    }
  }, [isAuthenticated, isLoading, navigate, allowedRoles, user]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-4 md:p-6 overflow-auto min-h-screen">
          <div className="mb-4">
            <SidebarTrigger className="md:hidden" />
          </div>
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ProtectedRoute;
