import { TeamHeader } from "../Components/team-header";
import { TeamSidebar } from "../Components/team-sidebar";

export default function TeamDashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <TeamSidebar />

      <div className="flex-1 flex flex-col w-full min-w-0">
        <TeamHeader />

        <main className="flex-1 p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Team Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your vessel, crew, and events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Active Crew", value: "8", change: "+2 this month" },
              { label: "Upcoming Events", value: "12", change: "3 this week" },
              {
                label: "Charter Bookings",
                value: "24",
                change: "+15% vs last month",
              },
              { label: "Performance Score", value: "94%", change: "+5 points" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-card border border-border rounded-xl p-5"
              >
                <p className="text-sm text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                "Update Vessel Profile",
                "Add Crew Member",
                "View Schedule",
                "Check Performance",
              ].map((action) => (
                <button
                  key={action}
                  className="px-4 py-3 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/15 rounded-lg transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
