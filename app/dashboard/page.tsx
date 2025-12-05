// import { DashboardHeader } from "@/components/dashboard-header";
// import { DashboardSidebar } from "@/components/dashboard-sidebar";
// import { DashboardStats } from "@/components/dashboard-stats";
// import { DashboardChart } from "../Components/dashboard-chart";
// import { DashboardRecentOrders } from "@/components/dashboard-recent-orders";
import { DashboardChart } from "../Components/dashboard-chart";
import { DashboardHeader } from "../Components/dashboard-header";
import { DashboardRecentOrders } from "../Components/dashboard-recent-orders";
import { DashboardSidebar } from "../Components/dashboard-sidebar";
import { DashboardStats } from "../Components/dashboard-stats";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col w-full min-w-0">
        <DashboardHeader />

        <main className="flex-1 p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, Taylor Jean
            </p>
          </div>

          <DashboardStats />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2">
              <DashboardChart />
            </div>
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-4 sm:p-5 h-full">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
                  {[
                    "Create project",
                    "Invite member",
                    "Generate report",
                    "View analytics",
                  ].map((action) => (
                    <button
                      key={action}
                      className="text-left px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-foreground bg-primary/10 hover:bg-primary/5 rounded-lg transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DashboardRecentOrders />
        </main>
      </div>
    </div>
  );
}
