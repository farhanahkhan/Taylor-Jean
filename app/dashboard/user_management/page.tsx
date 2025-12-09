"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import {
  Search,
  Filter,
  MoreVertical,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Select from "@radix-ui/react-select";

import { getUsers, updateUser, deleteUser, type User } from "@/lib/users-store";
import { DashboardSidebar } from "@/app/Components/dashboard-sidebar";
import { DashboardHeader } from "@/app/Components/dashboard-header";

export default function UserManagementPage() {
  const { data: users = getUsers(), mutate } = useSWR("users", getUsers);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  };

  const handleSaveEdit = (id: string) => {
    updateUser(id, editForm);
    setEditingId(null);
    setEditForm({});
    mutate();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id: string) => {
    deleteUser(id);
    mutate();
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50 overflow-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage all users across the platform
            </p>
          </div>

          {/* Card Container */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Search and Filters */}
            <div className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-gray-100">
              <div className="relative flex-1 max-w-xl w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 h-10 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              <button className="flex items-center gap-2 px-4 h-10 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      User
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Role
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Joined
                    </th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      {/* User Column */}
                      <td className="px-6 py-4">
                        {editingId === user.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editForm.name || ""}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  name: e.target.value,
                                })
                              }
                              className="w-full px-3 py-1.5 text-sm font-semibold border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                            <input
                              type="email"
                              value={editForm.email || ""}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  email: e.target.value,
                                })
                              }
                              className="w-full px-3 py-1.5 text-sm text-primary border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                          </div>
                        ) : (
                          <div>
                            <p className="font-semibold text-foreground">
                              {user.name}
                            </p>
                            <p className="text-sm text-primary">{user.email}</p>
                          </div>
                        )}
                      </td>

                      {/* Role Column */}
                      <td className="px-6 py-4">
                        {editingId === user.id ? (
                          <Select.Root
                            value={editForm.role}
                            onValueChange={(value) =>
                              setEditForm({
                                ...editForm,
                                role: value as User["role"],
                              })
                            }
                          >
                            <Select.Trigger className="inline-flex items-center justify-between px-3 py-1.5 text-sm border border-gray-200 rounded-md min-w-[120px] focus:outline-none focus:ring-2 focus:ring-primary/30">
                              <Select.Value />
                              <Select.Icon />
                            </Select.Trigger>
                            <Select.Portal>
                              <Select.Content className="bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden z-50">
                                <Select.Viewport className="p-1">
                                  {["Fan", "Team", "Organizer", "Admin"].map(
                                    (role) => (
                                      <Select.Item
                                        key={role}
                                        value={role}
                                        className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                                      >
                                        <Select.ItemText>
                                          {role}
                                        </Select.ItemText>
                                      </Select.Item>
                                    )
                                  )}
                                </Select.Viewport>
                              </Select.Content>
                            </Select.Portal>
                          </Select.Root>
                        ) : (
                          <span className="text-primary font-medium">
                            {user.role}
                          </span>
                        )}
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4">
                        {editingId === user.id ? (
                          <Select.Root
                            value={editForm.status}
                            onValueChange={(value) =>
                              setEditForm({
                                ...editForm,
                                status: value as User["status"],
                              })
                            }
                          >
                            <Select.Trigger className="inline-flex items-center justify-between px-3 py-1.5 text-sm border border-gray-200 rounded-md min-w-[120px] focus:outline-none focus:ring-2 focus:ring-primary/30">
                              <Select.Value />
                              <Select.Icon />
                            </Select.Trigger>
                            <Select.Portal>
                              <Select.Content className="bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden z-50">
                                <Select.Viewport className="p-1">
                                  {["Active", "Suspended"].map((status) => (
                                    <Select.Item
                                      key={status}
                                      value={status}
                                      className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                                    >
                                      <Select.ItemText>
                                        {status}
                                      </Select.ItemText>
                                    </Select.Item>
                                  ))}
                                </Select.Viewport>
                              </Select.Content>
                            </Select.Portal>
                          </Select.Root>
                        ) : (
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                              user.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.status}
                          </span>
                        )}
                      </td>

                      {/* Joined Column */}
                      <td className="px-6 py-4 text-muted-foreground">
                        {user.joined}
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 text-right">
                        {editingId === user.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleSaveEdit(user.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                              </button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Portal>
                              <DropdownMenu.Content
                                align="end"
                                className="min-w-[140px] bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50"
                              >
                                <DropdownMenu.Item
                                  onClick={() => handleEdit(user)}
                                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 outline-none"
                                >
                                  <Pencil className="h-4 w-4" />
                                  Edit
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                  onClick={() => handleDelete(user.id)}
                                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-red-50 text-red-600 outline-none"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </DropdownMenu.Item>
                              </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                          </DropdownMenu.Root>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No users found
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
