import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingCart,
  Eye,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+15.3%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Total Orders",
    value: "1,247",
    change: "-4.5%",
    trend: "down",
    icon: ShoppingCart,
  },
  {
    title: "Page Views",
    value: "573,281",
    change: "+12.7%",
    trend: "up",
    icon: Eye,
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-card border border-border rounded-xl p-3 sm:p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate pr-2">
              {stat.title}
            </span>
            <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-lg sm:text-2xl font-bold text-foreground">
              {stat.value}
            </span>
            <div className="flex items-center gap-1 mt-1 flex-wrap">
              {stat.trend === "up" ? (
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
              )}
              <span
                className={`text-xs sm:text-sm font-medium ${
                  stat.trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.change}
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                vs last month
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
