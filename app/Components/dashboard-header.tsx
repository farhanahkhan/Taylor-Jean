"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Settings,
  User,
  HelpCircle,
  Users,
  Users2,
  LayoutGrid,
  FileBarChart,
  MessageSquare,
  ClipboardList,
  FileText,
  Trophy,
  ShieldCheck,
  DollarSign,
  Anchor,
  ShoppingBag,
  FileCheck,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { usePathname } from "next/navigation";

const navItems = [
  //   {
  //     icon: LayoutDashboard,
  //     label: "Dashboard",
  //     href: "/dashboard",
  //     active: true,
  //   },
  //   { icon: BarChart3, label: "Analytics", href: "#" },
  //   { icon: FolderKanban, label: "Projects", href: "#" },
  //   { icon: UsersIcon, label: "Team", href: "#" },
  //   { icon: CreditCard, label: "Billing", href: "#" },
  //   { icon: Settings, label: "Settings", href: "#" },
  { icon: LayoutGrid, label: "Dashboard", href: "/dashboard", active: true },
  { icon: ShoppingBag, label: "Merch", href: "/dashboard/merch" },
  { icon: Anchor, label: "Charter", href: "/dashboard/charter" },
  { icon: Users, label: "User Management", href: "/dashboard/user_management" },
  { icon: Users2, label: "Team Management", href: "#" },
  { icon: Trophy, label: "Tournaments", href: "/dashboard/tournaments" },
  {
    icon: ShieldCheck,
    label: "Betting & Compliance",
    href: "/dashboard/betting&compliance",
  },
  { icon: FileCheck, label: "KYC", href: "/dashboard/kyc" },
  { icon: DollarSign, label: "Payments & Commerce", href: "#" },
  { icon: FileText, label: "Content Moderation", href: "#" },
  { icon: ClipboardList, label: "CMS", href: "#" },
  { icon: Bell, label: "Notifications", href: "#" },
  { icon: MessageSquare, label: "Support & Tickets", href: "#" },
  { icon: Settings, label: "Settings", href: "#" },
  { icon: FileBarChart, label: "Audit Logs", href: "#" },
];

export function DashboardHeader() {
  const pathname = usePathname();
  const [openCharter, setOpenCharter] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <Dialog.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <Dialog.Trigger asChild>
              <button
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
              <Dialog.Content className="fixed top-0 left-0 h-full w-[280px] bg-card border-r border-border z-50 shadow-xl animate-in slide-in-from-left duration-300">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/elegant-tj-monogram-logo.jpg"
                      alt="Taylor Jean logo"
                      width={32}
                      height={32}
                      className="rounded-lg"
                    />
                    <span className="font-semibold text-foreground">
                      TAYLOR JEAN
                    </span>
                  </div>
                  <Dialog.Close asChild>
                    <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg">
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                  {/* {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                        item.active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))} */}
                  {navItems.map((item) => {
                    const isActive =
                      item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(item.href) && item.href !== "#";

                    if (item.label === "Charter") {
                      return (
                        <div key={item.label}>
                          <button
                            type="button"
                            onClick={() => setOpenCharter(!openCharter)}
                            className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm text-muted-foreground font-medium rounded-lg transition-all"
                            //    ${
                            //   isActive
                            //     ? "bg-primary/10 text-primary"
                            //     : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                            // }`}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className="h-5 w-5" />
                              Charters
                            </div>
                            <span className="text-xs">
                              {openCharter ? "▲" : "▼"}
                            </span>
                          </button>

                          {/* Dropdown options */}
                          {openCharter && (
                            <div className="ml-8 mt-1 space-y-1">
                              <Link
                                href="/dashboard/charters/charter"
                                className={`block px-3 py-2 text-sm font-medium rounded-md ${
                                  pathname === "/dashboard/charters/charter"
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                                }`}
                              >
                                Charter
                              </Link>
                              <Link
                                href="/dashboard/charters/service"
                                className={`block px-3 py-2 text-sm font-medium rounded-md ${
                                  pathname === "/dashboard/charters/service"
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                                }`}
                              >
                                Services
                              </Link>
                              <Link
                                href="/dashboard/charters/charterbooking"
                                className={`block px-3 py-2 text-sm font-medium rounded-md ${
                                  pathname ===
                                  "/dashboard/charters/charterbooking"
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                                }`}
                              >
                                Charter Booking
                              </Link>
                              <Link
                                href="/dashboard/charters/charterbooking"
                                className={`block px-3 py-2 text-sm font-medium rounded-md ${
                                  pathname ===
                                  "/dashboard/charters/charterbooking"
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                                }`}
                              >
                                Charter Inquiry
                              </Link>
                              <Link
                                href="/dashboard/charters/charterbooking"
                                className={`block px-3 py-2 text-sm font-medium rounded-md ${
                                  pathname ===
                                  "/dashboard/charters/charterbooking"
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                                }`}
                              >
                                Category
                              </Link>
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-lg transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <HelpCircle className="h-5 w-5" />
                    Help & Support
                  </Link>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <Link href="/dashboard" className="flex lg:hidden items-center gap-2">
            <Image
              src="/elegant-tj-monogram-logo.jpg"
              alt="Taylor Jean logo"
              width={28}
              height={28}
              className="rounded-lg"
            />
            <span className="font-semibold text-foreground text-sm sm:text-base">
              Taylor Jean
            </span>
          </Link>

          {/* Desktop search */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-48 lg:w-64 pl-9 pr-4 h-9 bg-gray-50 border border-gray rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-background transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <Search className="h-5 w-5" />
          </button>

          <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full" />
          </button>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 sm:pr-3 rounded-lg transition-all cursor-pointer">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs sm:text-sm font-medium text-primary">
                    TJ
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-medium text-foreground">
                  Taylor Jean
                </span>
                <ChevronDown className="hidden sm:block h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[200px] bg-card border border-border rounded-lg shadow-lg p-1 z-50"
                sideOffset={8}
                align="end"
              >
                <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-primary/10 rounded-md cursor-pointer outline-none">
                  <User className="h-4 w-4" />
                  Profile
                </DropdownMenu.Item>
                <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-primary/10 rounded-md cursor-pointer outline-none">
                  <Settings className="h-4 w-4" />
                  Settings
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="h-px bg-border my-1" />
                <DropdownMenu.Item asChild>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-primary/10 rounded-md cursor-pointer outline-none"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </Link>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      {showMobileSearch && (
        <div className="md:hidden px-3 pb-3 animate-in slide-in-from-top duration-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              className="w-full pl-9 pr-4 h-10 bg-accent/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-background transition-all"
            />
          </div>
        </div>
      )}
    </header>
  );
}
