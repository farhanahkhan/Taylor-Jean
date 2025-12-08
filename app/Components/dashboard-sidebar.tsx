"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  FolderKanban,
  Users,
  Settings,
  HelpCircle,
  CreditCard,
  LayoutGrid,
  Users2,
  ShieldCheck,
  Trophy,
  FileBarChart,
  FileText,
  ClipboardList,
  DollarSign,
  MessageSquare,
  Bell,
  ShoppingBag,
  Anchor,
} from "lucide-react";

const navItems = [
  { icon: LayoutGrid, label: "Dashboard", href: "/dashboard", active: true },
  { icon: ShoppingBag, label: "Merch", href: "/dashboard/merch" },
  { icon: Anchor, label: "Charter", href: "/dashboard/charter" },
  { icon: Users, label: "User Management", href: "#" },
  { icon: Users2, label: "Team Management", href: "#" },
  { icon: Trophy, label: "Tournaments", href: "#" },
  { icon: ShieldCheck, label: "Betting & Compliance", href: "#" },
  { icon: DollarSign, label: "Payments & Commerce", href: "#" },
  { icon: FileText, label: "Content Moderation", href: "#" },
  { icon: ClipboardList, label: "CMS", href: "#" },
  { icon: Bell, label: "Notifications", href: "#" },
  { icon: MessageSquare, label: "Support & Tickets", href: "#" },
  { icon: Settings, label: "Settings", href: "#" },
  { icon: FileBarChart, label: "Audit Logs", href: "#" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border min-h-screen">
      <div className="p-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2.5">
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

      {/* <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
              item.active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav> */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
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

      <div className="p-4 border-t border-border">
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all"
        >
          <HelpCircle className="h-5 w-5" />
          Help & Support
        </Link>
      </div>
    </aside>
  );
}
