"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import taylorjean from "@/public/elegant-tj-monogram-logo.jpg";

import {
  LayoutGrid,
  User,
  Users2,
  Calendar,
  ShoppingBag,
  BarChart3,
  Compass,
  ChevronDown,
} from "lucide-react";

const navItems = [
  { icon: LayoutGrid, label: "Dashboard", href: "/team" },
  { icon: Users2, label: "Team Profile", href: "/team/vessel-profile" },
  { icon: ShoppingBag, label: "Merch", href: "/team/merch" },
  { icon: User, label: "Crew Roster", href: "/team/crew-roster" },
  { icon: Compass, label: "Discover Events", href: "/team/discover-events" },
  { icon: Calendar, label: "Charter Calendar", href: "/team/charter-calendar" },
  { icon: ShoppingBag, label: "Merch Store", href: "/team/merch-store" },
  { icon: BarChart3, label: "Performance", href: "/team/performance" },
  { icon: Calendar, label: "Team Tournament", href: "/team/team-tournament" },
];

export function TeamSidebar() {
  const pathname = usePathname();
  const [openMerch, setOpenMerch] = useState(false);

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border min-h-screen">
      <div className="p-4 border-b border-border">
        <Link href="/team" className="flex items-center gap-2.5">
          <Image
            src={taylorjean}
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
          // ✅ Merch dropdown
          if (item.label === "Merch") {
            const isMerchActive = pathname.startsWith("/team/merch");

            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => setOpenMerch(!openMerch)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    isMerchActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    Merch
                  </div>

                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openMerch ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Items */}
                {openMerch && (
                  <>
                    <div className="ml-8 mt-1 space-y-1">
                      <Link
                        href="/team/merch"
                        className={`block px-3 py-2 text-sm font-medium rounded-md ${
                          pathname === "/team/merch"
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                        }`}
                      >
                        Products
                      </Link>
                    </div>
                    <div className="ml-8 mt-1 space-y-1">
                      <Link
                        href="/team/merchs/merchColor"
                        className={`block px-3 py-2 text-sm font-medium rounded-md ${
                          pathname === "/team/merchs/merchColor"
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                        }`}
                      >
                        Merch Color
                      </Link>
                    </div>
                    <div className="ml-8 mt-1 space-y-1">
                      <Link
                        href="/team/merchs/merchSize"
                        className={`block px-3 py-2 text-sm font-medium rounded-md ${
                          pathname === "/team/merch/merchSize"
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                        }`}
                      >
                        Merch Size
                      </Link>
                    </div>
                    <div className="ml-8 mt-1 space-y-1">
                      <Link
                        href="/team/merchs/merchCategory"
                        className={`block px-3 py-2 text-sm font-medium rounded-md ${
                          pathname === "/team/merch/merchCategory"
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                        }`}
                      >
                        Merch Category
                      </Link>
                    </div>
                  </>
                )}
              </div>
            );
          }

          // ✅ Normal menu items
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
