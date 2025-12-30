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

import {
  getServiceInquiries,
  updateServiceInquiry,
  deleteServiceInquiry,
  type ServiceInquiry,
} from "@/lib/service-inquiry-store";
import { DashboardSidebar } from "@/app/Components/dashboard-sidebar";
import { DashboardHeader } from "@/app/Components/dashboard-header";

const statusOptions = [
  "Pending",
  "Approved",
  "Rejected",
  "In Progress",
  "Completed",
];
const charterTypes = [
  "Private Charter",
  "Shared Charter",
  "Tournament Charter",
  "Corporate Charter",
];

export default function ServiceInquiryPage() {
  const { data: inquiries = getServiceInquiries(), mutate } = useSWR(
    "service-inquiries",
    getServiceInquiries
  );
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ServiceInquiry>>({});

  const filteredInquiries = useMemo(() => {
    return inquiries.filter(
      (inquiry) =>
        inquiry.fullName.toLowerCase().includes(search.toLowerCase()) ||
        inquiry.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [inquiries, search]);

  const handleEdit = (inquiry: ServiceInquiry) => {
    setEditingId(inquiry.id);
    setEditForm({
      fullName: inquiry.fullName,
      email: inquiry.email,
      charterDate: inquiry.charterDate,
      charterType: inquiry.charterType,
      amount: inquiry.amount,
      status: inquiry.status,
    });
  };

  const handleSaveEdit = (id: string) => {
    updateServiceInquiry(id, editForm);
    setEditingId(null);
    setEditForm({});
    mutate();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id: string) => {
    deleteServiceInquiry(id);
    mutate();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-yellow-600 bg-yellow-50";
      case "Approved":
        return "text-green-600 bg-green-50";
      case "Rejected":
        return "text-red-600 bg-red-50";
      case "In Progress":
        return "text-blue-600 bg-blue-50";
      case "Completed":
        return "text-emerald-600 bg-emerald-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50 overflow-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Service Inquiry
              </h1>
              <p className="text-muted-foreground">
                Manage and track service inquiries from customers.
              </p>
            </div>
          </div>

          {/* Card Container */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Search and Filters */}
            <div className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-gray-100">
              <div className="relative flex-1 max-w-xl w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search charters by name or email..."
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
                      Full Name
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Email Address
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Charter Date
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Charter Type
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Amount
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Status
                    </th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.map((inquiry) => (
                    <tr
                      key={inquiry.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Full Name Column */}
                      <td className="px-6 py-4">
                        {editingId === inquiry.id ? (
                          <input
                            type="text"
                            value={editForm.fullName || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                fullName: e.target.value,
                              })
                            }
                            className="w-full px-3 py-1.5 text-sm font-semibold border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        ) : (
                          <p className="font-semibold text-foreground">
                            {inquiry.fullName}
                          </p>
                        )}
                      </td>

                      {/* Email Column */}
                      <td className="px-6 py-4">
                        {editingId === inquiry.id ? (
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
                        ) : (
                          <p className="text-sm text-primary">
                            {inquiry.email}
                          </p>
                        )}
                      </td>

                      {/* Charter Date Column */}
                      <td className="px-6 py-4">
                        {editingId === inquiry.id ? (
                          <input
                            type="date"
                            value={editForm.charterDate || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                charterDate: e.target.value,
                              })
                            }
                            className="px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        ) : (
                          <p className="text-muted-foreground">
                            {inquiry.charterDate}
                          </p>
                        )}
                      </td>

                      {/* Charter Type Column */}
                      <td className="px-6 py-4">
                        {editingId === inquiry.id ? (
                          <Select.Root
                            value={editForm.charterType}
                            onValueChange={(value) =>
                              setEditForm({ ...editForm, charterType: value })
                            }
                          >
                            <Select.Trigger className="inline-flex items-center justify-between px-3 py-1.5 text-sm border border-gray-200 rounded-md min-w-[150px] focus:outline-none focus:ring-2 focus:ring-primary/30">
                              <Select.Value />
                              <Select.Icon />
                            </Select.Trigger>
                            <Select.Portal>
                              <Select.Content className="bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden z-50">
                                <Select.Viewport className="p-1">
                                  {charterTypes.map((type) => (
                                    <Select.Item
                                      key={type}
                                      value={type}
                                      className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                                    >
                                      <Select.ItemText>{type}</Select.ItemText>
                                    </Select.Item>
                                  ))}
                                </Select.Viewport>
                              </Select.Content>
                            </Select.Portal>
                          </Select.Root>
                        ) : (
                          <span className="text-primary font-medium">
                            {inquiry.charterType}
                          </span>
                        )}
                      </td>

                      {/* Amount Column */}
                      <td className="px-6 py-4">
                        {editingId === inquiry.id ? (
                          <input
                            type="number"
                            value={editForm.amount || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                amount: Number(e.target.value),
                              })
                            }
                            className="w-24 px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        ) : (
                          <p className="font-semibold text-foreground">
                            ${inquiry.amount.toLocaleString()}
                          </p>
                        )}
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4">
                        {editingId === inquiry.id ? (
                          <Select.Root
                            value={editForm.status}
                            onValueChange={(value) =>
                              setEditForm({ ...editForm, status: value })
                            }
                          >
                            <Select.Trigger className="inline-flex items-center justify-between px-3 py-1.5 text-sm border border-gray-200 rounded-md min-w-[130px] focus:outline-none focus:ring-2 focus:ring-primary/30">
                              <Select.Value />
                              <Select.Icon />
                            </Select.Trigger>
                            <Select.Portal>
                              <Select.Content className="bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden z-50">
                                <Select.Viewport className="p-1">
                                  {statusOptions.map((status) => (
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
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              inquiry.status
                            )}`}
                          >
                            {inquiry.status}
                          </span>
                        )}
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 text-right">
                        {editingId === inquiry.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleSaveEdit(inquiry.id)}
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
                                  onClick={() => handleEdit(inquiry)}
                                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 outline-none"
                                >
                                  <Pencil className="h-4 w-4" />
                                  Edit
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                  onClick={() => handleDelete(inquiry.id)}
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

              {filteredInquiries.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No service inquiries found
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
