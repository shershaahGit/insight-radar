
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, description, icon, trend, className }: StatCardProps) {
  return (
    <Card className={`card-hover ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span
              className={`text-xs ${
                trend.isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
