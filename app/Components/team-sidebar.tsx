"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import taylor from "@/public/taylorjean.png";
import Image from "next/image";
import {
  LayoutGrid,
  Zap,
  Users2,
  Calendar,
  ShoppingBag,
  BarChart3,
  Compass,
} from "lucide-react";

const navItems = [
  { icon: LayoutGrid, label: "Dashboard", href: "/team" },
  { icon: Zap, label: "Vessel Profile", href: "/team/vessel-profile" },
  { icon: Users2, label: "Crew Roster", href: "/team/crew-roster" },
  { icon: Compass, label: "Discover Events", href: "/team/discover-events" },
  { icon: Calendar, label: "Charter Calendar", href: "/team/charter-calendar" },
  { icon: ShoppingBag, label: "Merch Store", href: "/team/merch-store" },
  { icon: BarChart3, label: "Performance", href: "/team/performance" },
];

export function TeamSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border min-h-screen">
      {/* <div className="p-5 pb-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <Image
            src={taylor}
            alt="Taylor Jean Logo"
            width={48}
            height={48}
            className="rounded-lg"
          />
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">
              Taylor Jean
            </h1>
            <p className="text-sm text-sidebar-foreground/60">
              Sport Fishing Team
            </p>
          </div>
        </div>
      </div> */}
      <div className="p-4 border-b border-border">
        <Link href="/team" className="flex items-center gap-2.5">
          <Image
            src="/elegant-tj-monogram-logo.jpg"
            alt="Taylor Jean logo"
            width={36}
            height={36}
            className="rounded-xl"
          />
          <span className="text-lg font-bold text-foreground">TAYLOR JEAN</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/team"
              ? pathname === "/team"
              : pathname.startsWith(item.href) && item.href !== "#";
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
