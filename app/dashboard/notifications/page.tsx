"use client";

import { DashboardHeader } from "@/app/Components/dashboard-header";
import { DashboardSidebar } from "@/app/Components/dashboard-sidebar";
import ImageUploader from "@/app/Components/ImageUploader";

// interface Notification

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { Check } from "lucide-react";

import { Upload, BarChart3, Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-dropdown-menu";

// import { Label } from "@/components/ui/label";
interface Notification {
  id: string;
  title: string;
  category: "SOCIAL" | "BETTING" | "SYSTEM" | "TOURNAMENT" | "COMMERCE";
  audience:
    | "ALL_USERS"
    | "FANS_ONLY"
    | "TEAMS_ONLY"
    | "ORGANIZERS_ONLY"
    | "CUSTOM";
  date: string;
  time: string;
  engagement: number;
  engagementPercentage: number;
  status: "SENT" | "SCHEDULED" | "DRAFT";
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  userId: string | null;
  userName: string | null;
  teamId: string | null;
  teamName: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  message: string;
  statusCode: number;
  status: boolean;
  data: {
    data: NotificationItem[];
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
  };
}
export interface User {
  id: string;
  displayName: string | null;
  email: string;
  fullName: string | null;
}
export interface Team {
  id: string;
  name: string;
  displayName: string;
  description?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Everglades Heat Start!",
    category: "TOURNAMENT",
    audience: "ALL_USERS",
    date: "2024-03-10 08:00",
    engagement: 12430,
    engagementPercentage: 89,
    status: "SENT",
    time: "08:00",
  },
  {
    id: "2",
    title: "Odds Boosted on Apex Predators",
    category: "BETTING",
    audience: "ALL_USERS",
    date: "2024-03-11 14:20",
    engagement: 4200,
    engagementPercentage: 56,
    status: "SENT",
    time: "09:00",
  },
  {
    id: "3",
    title: "New Merch Drop",
    category: "COMMERCE",
    audience: "ALL_USERS",
    date: "2024-03-15 10:00",
    engagement: 0,
    engagementPercentage: 0,
    status: "SCHEDULED",
    time: "10:00",
  },
];

const categoryOptions = [
  { id: "SOCIAL", label: "SOCIAL", color: "blue" },
  { id: "BETTING", label: "BETTING", color: "slate" },
  { id: "SYSTEM", label: "SYSTEM", color: "slate" },
  { id: "TOURNAMENT", label: "TOURNAMENT", color: "slate" },
  { id: "COMMERCE", label: "COMMERCE", color: "slate" },
];

const audienceOptions = [
  { id: "ALL_USERS", label: "ALL USERS", color: "green" },
  { id: "FANS_ONLY", label: "FANS ONLY", color: "slate" },
  { id: "TEAMS_ONLY", label: "TEAMS ONLY", color: "slate" },
  { id: "ORGANIZERS_ONLY", label: "ORGANIZERS ONLY", color: "slate" },
  { id: "CUSTOM", label: "CUSTOM", color: "slate" },
];

export default function NotificationsPage() {
  const [selectedCategory, setSelectedCategory] = useState("SOCIAL");
  const [selectedAudience, setSelectedAudience] = useState("ALL_USERS");
  const [dispatchMode, setDispatchMode] = useState("immediately");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  // const [selectedAudience, setSelectedAudience] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // const [selectedTeam, setSelectedTeam] = useState("");
  // const userOptions = ["User 1", "User 2", "User 3", "User 4", "User 5"];
  // const teamOptions = ["Team A", "Team B", "Team C"];
  // const [userOptions, setUserOptions] = useState([]);
  const [userOptions, setUserOptions] = useState<User[]>([]);
  const [teamOptions, setTeamOptions] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState("");

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const filteredNotifications = mockNotifications.filter((notif) =>
    notif.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch("/api/notifications");
      const data: NotificationsResponse = await res.json();

      if (data?.data?.data) {
        setNotifications(data.data.data); // 👈 nested data
      }
    };

    fetchNotifications();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SENT":
        return "bg-green-100 text-green-800";
      case "SCHEDULED":
        return "bg-yellow-100 text-yellow-800";
      case "DRAFT":
        return "bg-slate-100 text-slate-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  // selected user API
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/user-Team");
      const data = await res.json();

      if (data?.data) {
        setUserOptions(data.data);
      }
    };

    fetchUsers();
  }, []);
  // Team ApI DropDown
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch("/api/team/team-profile");
        const data = await res.json();

        if (data?.data) {
          setTeamOptions(data.data);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  // const handleSendNotification = async () => {
  //   try {
  //     // 👉 ALL USERS (multi select)
  //     if (selectedAudience === "ALL_USERS") {
  //       for (const userId of selectedUsers) {
  //         await fetch("/api/notifications", {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             title,
  //             message,
  //             userId,
  //             teamId: null,
  //           }),
  //         });
  //       }
  //     }

  //     // 👉 TEAMS ONLY
  //     if (selectedAudience === "TEAMS_ONLY") {
  //       await fetch("/api/notifications", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           title,
  //           message,
  //           userId: null,
  //           teamId: selectedTeam,
  //         }),
  //       });
  //     }

  //     alert("Notification sent ✅");
  //   } catch (error) {
  //     console.error(error);
  //     alert("Error sending notification ❌");
  //   }
  // };

  const handleSendNotification = async () => {
    try {
      // ✅ ALL USERS → loop se IDs uthao
      if (selectedAudience === "ALL_USERS") {
        for (const userId of selectedUsers) {
          await fetch("/api/notification", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              message,
              userId: userId, // 👈 yahan se ID uth rahi
              teamId: null,
            }),
          });
        }
      }

      // ✅ TEAM → direct ID bhejo
      if (selectedAudience === "TEAMS_ONLY") {
        await fetch("/api/notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            message,
            userId: null,
            teamId: selectedTeam, // 👈 yahan se ID uth rahi
          }),
        });
      }

      console.log("Notification sent ✅");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col w-full min-w-0">
        <DashboardHeader />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8 space-y-8">
            {/* Notification Creation Section */}
            <div className="space-y-6">
              {/* Section 1: Notification Content */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/50 text-white flex items-center justify-center text-sm font-bold">
                      ✓
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      1. Notification Content
                    </h2>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 uppercase">
                    Type: Social
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Catchy Title */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-slate-600 uppercase">
                        Catchy Title
                      </label>
                      <span className="text-xs text-slate-500">0/60</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter notification headline..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value.slice(0, 60))}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Main Message Body */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-slate-600 uppercase">
                        Main Message Body
                      </label>
                      <span className="text-xs text-slate-500">0/200</span>
                    </div>
                    <textarea
                      placeholder="Write your broadcast message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value.slice(0, 200))}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
                    />
                    <div className="flex items-center justify-end gap-2 mt-2">
                      <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <span className="text-lg">😊</span>
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <span className="text-lg">🎯</span>
                      </button>
                    </div>
                  </div>

                  {/* Cover Image */}
                  {/* <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase block mb-2">
                      Cover Image
                    </label>
                    <ImageUploader />
                  </div> */}
                </div>
              </div>

              {/* Section 2 & 3: Category and Audience */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category */}
                {/* <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                    <div className="w-6 h-6 rounded-full bg-primary/50 text-white flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Category
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {categoryOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedCategory(option.id)}
                        className={`py-2.5 px-4 rounded-full font-semibold text-sm transition-all ${
                          selectedCategory === option.id
                            ? "bg-primary/50 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div> */}

                {/* Target Audience */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                    <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Target Audience
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {audienceOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedAudience(option.id)}
                        className={`py-2.5 px-4 rounded-full font-semibold text-sm transition-all ${
                          selectedAudience === option.id
                            ? option.id === "ALL_USERS"
                              ? "bg-green-600 text-white"
                              : "bg-primary/50 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {selectedAudience === "TEAMS_ONLY" && (
                    <div className="mt-4">
                      <Label className="text-xs font-medium text-slate-500 uppercase mb-2 block">
                        Select Team
                      </Label>

                      <Select
                        value={selectedTeam}
                        onValueChange={setSelectedTeam}
                      >
                        <SelectTrigger className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                          <SelectValue placeholder="Select Team" />
                        </SelectTrigger>

                        <SelectContent>
                          {teamOptions.map((team) => (
                            <SelectItem key={team.id} value={team.id}>
                              {team.displayName || team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {selectedAudience === "ALL_USERS" && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-left flex justify-between items-center">
                          {selectedUsers.length > 0
                            ? `${selectedUsers.length} users selected`
                            : "Select Users"}
                          <span>▾</span>
                        </button>
                      </PopoverTrigger>

                      <PopoverContent className="w-[var(--radix-popper-anchor-width)] p-0 bg-white border border-gray-200 shadow-lg rounded-lg max-h-60 overflow-y-auto">
                        <Command>
                          <CommandInput placeholder="Search users..." />

                          <CommandGroup>
                            {userOptions.map((user) => {
                              const isSelected = selectedUsers.includes(
                                user.id
                              );

                              return (
                                <CommandItem
                                  key={user.id}
                                  onSelect={() => {
                                    setSelectedUsers((prev) =>
                                      isSelected
                                        ? prev.filter((id) => id !== user.id)
                                        : [...prev, user.id]
                                    );
                                  }}
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${
                                      isSelected ? "opacity-100" : "opacity-0"
                                    }`}
                                  />

                                  {/* show name or email */}
                                  {user.fullName || user.email}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>

              {/* Section 4: Dispatch Mode */}
              {/* <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                    📅
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Dispatch Mode
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3 w-[50%]">
                    <button
                      onClick={() => setDispatchMode("immediately")}
                      className={`flex-1 py-2.5 px-4 rounded-full font-semibold text-sm transition-all ${
                        dispatchMode === "immediately"
                          ? "bg-blue-100 text-primary border border-primary"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      Immediately
                    </button>
                    <button
                      onClick={() => setDispatchMode("later")}
                      className={`flex-1 py-2.5 px-4 rounded-full font-semibold text-sm transition-all ${
                        dispatchMode === "later"
                          ? "bg-blue-100 text-blue-700 border border-blue-300"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      Later
                    </button>
                  </div>

                  {dispatchMode === "later" && (
                    <input
                      type="datetime-local"
                      defaultValue="2026-02-14T12:30"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              </div> */}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* <button className="px-8 py-3 border border-slate-300 text-slate-700 font-semibold rounded-full hover:bg-slate-50 transition-colors">
                  SAVE AS DRAFT
                </button> */}
                <button
                  className="px-8 py-3 text-white bg-slate-800 rounded-full hover:bg-slate-700 font-semibold  transition-colors"
                  onClick={handleSendNotification}
                >
                  {dispatchMode === "immediately"
                    ? "SEND NOW"
                    : "SCHEDULE FOR LATER"}
                </button>
              </div>
            </div>

            {/* History & Analytics Section */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    History & Analytics
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Tracking delivery and open rates for previous campaigns.
                  </p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-700 uppercase text-xs">
                        Campaign Details
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700 uppercase text-xs">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700 uppercase text-xs">
                        Audience
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700 uppercase text-xs">
                        Engagement
                      </th>
                      {/* <th className="text-left py-3 px-4 font-semibold text-slate-700 uppercase text-xs">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700 uppercase text-xs">
                        Actions
                      </th> */}
                    </tr>
                  </thead>
                  {/* <tbody>
                    {filteredNotifications.map((notif) => (
                      <tr
                        key={notif.id}
                        className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {notif.title}
                            </p>
                            <p className="text-xs text-slate-600">
                              {notif.date}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-xs font-semibold text-slate-700 uppercase">
                            {notif.category}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-xs text-slate-700">
                            {notif.audience === "ALL_USERS"
                              ? "All Users"
                              : notif.audience}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {notif.engagement.toLocaleString()} hits
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{
                                    width: `${notif.engagementPercentage}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs font-semibold text-slate-700">
                                {notif.engagementPercentage}%
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              notif.status
                            )}`}
                          >
                            {notif.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                            <BarChart3 className="w-4 h-4 text-slate-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody> */}
                  <tbody>
                    {notifications.map((notif) => (
                      <tr key={notif.id}>
                        <td className="py-4 px-4">
                          <p className="font-semibold">{notif.title}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(notif.createdAt).toLocaleString()}
                          </p>
                        </td>

                        <td className="py-4 px-4">
                          {notif.teamName || notif.userName || "—"}
                        </td>

                        <td className="py-4 px-4">{notif.message}</td>

                        <td className="py-4 px-4">
                          {notif.isRead ? "Read" : "Unread"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredNotifications.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-slate-600">No notifications found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
