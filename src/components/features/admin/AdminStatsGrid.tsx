"use client";

import {
  Users,
  CheckCircle,
  Award,
  Star,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminStats } from "@/types/stats";

const iconMap: Record<string, React.ReactNode> = {
  users: <Users className="h-5 w-5" />,
  "check-circle": <CheckCircle className="h-5 w-5" />,
  award: <Award className="h-5 w-5" />,
  star: <Star className="h-5 w-5" />,
};

export function AdminStatsGrid({ stats }: { stats: AdminStats }) {
  return (
    <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.stats.map((stat) => (
        <Card key={stat.id}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {iconMap[stat.icon]}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center gap-1 text-sm">
              {stat.trend.startsWith("+") ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : stat.trend === "stable" ? (
                <span className="text-muted-foreground">-</span>
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={
                  stat.trend.startsWith("+")
                    ? "text-green-500"
                    : stat.trend === "stable"
                      ? "text-muted-foreground"
                      : "text-red-500"
                }
              >
                {stat.trend}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
