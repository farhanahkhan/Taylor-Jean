"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  X,
  Users,
} from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { DashboardSidebar } from "@/app/Components/dashboard-sidebar";
import { DashboardHeader } from "@/app/Components/dashboard-header";
import * as Dialog from "@radix-ui/react-dialog";
import Swal from "sweetalert2";

interface ApiUser {
  id: string;
  fullName: string;

  email: string;
  kycStatus: boolean;
}
interface KYCRequest {
  id: string;
  user: string;
  dateOfBirth: string;
  riskScore: number;
  riskLevel: string;
  submitted: string;
  status: string;

  fileUrl: string | null;
}

interface ApiKyc {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  fileUrl: string | null;
  createdAt: string;
  status: number;
}

export const getAllKyc = async (): Promise<ApiKyc[]> => {
  const res = await fetch("/api/kyc");
  const json = await res.json();
  return json.data;
};
const getAllUsers = async (): Promise<ApiUser[]> => {
  const res = await fetch("/api/user-Team");

  if (!res.ok) {
    throw new Error(`Failed to fetch users (${res.status})`);
  }

  const json: unknown = await res.json();

  if (Array.isArray(json)) {
    return json as ApiUser[];
  }

  if (
    typeof json === "object" &&
    json !== null &&
    "data" in json &&
    Array.isArray(json.data)
  ) {
    return json.data as ApiUser[];
  }

  throw new Error("Invalid users API response");
};

export const updateKycStatus = async (
  id: string,
  status: "approved" | "rejected" | "review",
  notes?: string,
) => {
  const body = { isApproved: status === "approved", notes };

  const res = await fetch(`/api/kyc/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await res.json();

  if (!res.ok) {
    // Throw backend error message
    throw new Error(json?.message || "Failed to update KYC");
  }

  return json;
};

export default function KYCPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [decisionNotes, setDecisionNotes] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<KYCRequest | null>(
    null,
  );
  const [kycRequests, setKycRequests] = useState<KYCRequest[]>([]);
  // New Implement
  const [isKycUsersModalOpen, setIsKycUsersModalOpen] = useState(false);
  const [kycUserSearch, setKycUserSearch] = useState("");
  const [approvingUserId, setApprovingUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<ApiUser[]>([]);

  // const pendingKycUsers = useMemo(() => {
  //   return kycRequests.filter(
  //     (user) =>
  //       user.status === "pending" &&
  //       user.user.toLowerCase().includes(kycUserSearch.toLowerCase()),
  //   );
  // }, [kycRequests, kycUserSearch]);
  const pendingUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName = user.fullName ?? "";

      return (
        user.kycStatus !== true &&
        fullName.toLowerCase().includes(kycUserSearch.toLowerCase())
      );
    });
  }, [users, kycUserSearch]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleReviewClick = (request: KYCRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
    setDecisionNotes("");
  };

  const handleApproveUser = async (user: ApiUser) => {
    if (approvingUserId) return;

    const swalTarget =
      document.querySelector<HTMLElement>("#kyc-users-dialog") ?? document.body;

    const swalOptions = {
      target: swalTarget,
      customClass: {
        container: "kyc-swal-container",
      },
    };

    const result = await Swal.fire({
      ...swalOptions,
      title: "Are you sure?",
      text: `Do you want to approve ${user.fullName ?? "this user"}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    try {
      setApprovingUserId(user.id);

      const res = await fetch("/api/kyc/shufti/admin/manual-approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          reason: "Approved by admin",
        }),
      });

      const responseText = await res.text();

      if (!res.ok) {
        throw new Error(`Approval failed (${res.status}): ${responseText}`);
      }

      // Successful approval ke baad pending list se remove
      setUsers((prev) =>
        prev.map((item) =>
          item.id === user.id ? { ...item, kycStatus: true } : item,
        ),
      );

      await Swal.fire({
        ...swalOptions,
        title: "Approved!",
        text: "User approved successfully.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#16a34a",
      });
    } catch (error) {
      console.error("Approve Error:", error);

      await Swal.fire({
        ...swalOptions,
        title: "Error!",
        text: error instanceof Error ? error.message : "Failed to approve user",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setApprovingUserId(null);
    }
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;

    try {
      await updateKycStatus(selectedRequest.id, "approved", decisionNotes);

      setKycRequests((prev) =>
        prev.map((req) =>
          req.id === selectedRequest.id ? { ...req, status: "approved" } : req,
        ),
      );

      setIsModalOpen(false);
      setSelectedRequest(null);
      setDecisionNotes("");

      alert("KYC approved successfully!");
    } catch (error) {
      console.error("Approve Error:", error);

      alert(
        `Failed to approve KYC: ${
          error instanceof Error ? error.message : "Something went wrong"
        }`,
      );
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    try {
      await updateKycStatus(selectedRequest.id, "rejected", decisionNotes);

      setKycRequests((prev) =>
        prev.map((req) =>
          req.id === selectedRequest.id ? { ...req, status: "rejected" } : req,
        ),
      );

      setIsModalOpen(false);
      setSelectedRequest(null);
      setDecisionNotes("");

      alert("KYC rejected successfully!");
    } catch (error: any) {
      console.error("Reject Error:", error);
      alert(`Failed to reject KYC: ${error.message}`);
    }
  };

  // const handleRequestMoreInfo = () => {
  //   if (selectedRequest) {
  //     setKycRequests((prevRequests) =>
  //       prevRequests.map((req) =>
  //         req.id === selectedRequest.id
  //           ? { ...req, status: "review" as const }
  //           : req
  //       )
  //     );
  //     setIsModalOpen(false);
  //     setSelectedRequest(null);
  //     setDecisionNotes("");
  //   }
  // };

  const filteredRequests = useMemo(() => {
    return kycRequests.filter((request) => {
      const matchesSearch = request.user
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      // request.documentType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, kycRequests]);

  const stats = useMemo(() => {
    const total = filteredRequests.length;
    const pending = filteredRequests.filter(
      (r) => r.status === "pending",
    ).length;
    const approved = filteredRequests.filter(
      (r) => r.status === "approved",
    ).length;
    const highRisk = filteredRequests.filter((r) => r.riskScore >= 70).length;

    return { total, pending, approved, highRisk };
  }, [filteredRequests]);

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-blue-100 text-blue-700 border-blue-200",
      approved: "bg-green-100 text-green-700 border-green-200",
      review: "bg-orange-100 text-orange-700 border-orange-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
    };

    const icons = {
      pending: <Clock className="h-3.5 w-3.5" />,
      approved: <CheckCircle className="h-3.5 w-3.5" />,
      review: <AlertCircle className="h-3.5 w-3.5" />,
      rejected: <XCircle className="h-3.5 w-3.5" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
          styles[status as keyof typeof styles]
        }`}
      >
        {icons[status as keyof typeof icons]}
        {status}
      </span>
    );
  };

  const getRiskBadge = (riskLevel: string, score: number) => {
    const colors = {
      "Low Risk": "text-green-600",
      "Medium Risk": "text-orange-600",
      "High Risk": "text-red-600",
    };

    return (
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-700">{score}</span>
        <span
          className={`text-sm font-medium ${
            colors[riskLevel as keyof typeof colors]
          }`}
        >
          {riskLevel}
        </span>
      </div>
    );
  };

  useEffect(() => {
    const fetchKyc = async () => {
      try {
        const data: ApiKyc[] = await getAllKyc();

        const mapped: KYCRequest[] = data.map((item) => ({
          id: item.id,
          user: `${item.firstName} ${item.lastName}`,
          dateOfBirth: new Date(item.dateOfBirth).toLocaleDateString(),
          riskScore: 20,
          riskLevel: "Low Risk",
          submitted: new Date(item.createdAt).toLocaleString(),
          fileUrl: item.fileUrl,
          status:
            item.status === 1
              ? "pending"
              : item.status === 2
                ? "approved"
                : item.status === 3
                  ? "rejected"
                  : "unknown",
        }));

        setKycRequests(mapped);
      } catch (error) {
        console.error("Error fetching KYC:", error);
      }
    };

    fetchKyc();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 max-w-full">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-h-screen w-0">
        <DashboardHeader />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                KYC Management
              </h1>
              <p className="text-slate-600 mt-1">
                Manage and review user verification requests
              </p>
            </div>

            <button
              onClick={() => setIsKycUsersModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-dark-navy text-white hover:bg-dark text-sm font-medium rounded-lg transition-colors"
            >
              <Users className="w-4 h-4" />
              KYC Users
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {users.filter((user) => user.kycStatus !== true).length}
              </span>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-md shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                placeholder="Search KYC requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-75 pl-9 pr-4 h-9 bg-gray-50 border border-gray rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-background transition-all"
              />
            </div>
            <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
              <Select.Trigger className="inline-flex items-center justify-between gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 w-full sm:w-auto min-w-[150px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <Select.Value />
                </div>
                <ChevronDown className="h-4 w-4" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="bg-white border border-slate-200 rounded-lg shadow-lg p-1 z-50">
                  <Select.Viewport>
                    <Select.Item
                      value="all"
                      className="px-3 py-2 text-sm rounded cursor-pointer hover:bg-slate-100 outline-none"
                    >
                      <Select.ItemText>All Status</Select.ItemText>
                    </Select.Item>
                    <Select.Item
                      value="pending"
                      className="px-3 py-2 text-sm rounded cursor-pointer hover:bg-slate-100 outline-none"
                    >
                      <Select.ItemText>Pending</Select.ItemText>
                    </Select.Item>
                    <Select.Item
                      value="approved"
                      className="px-3 py-2 text-sm rounded cursor-pointer hover:bg-slate-100 outline-none"
                    >
                      <Select.ItemText>Approved</Select.ItemText>
                    </Select.Item>
                    <Select.Item
                      value="review"
                      className="px-3 py-2 text-sm rounded cursor-pointer hover:bg-slate-100 outline-none"
                    >
                      <Select.ItemText>Review</Select.ItemText>
                    </Select.Item>
                    <Select.Item
                      value="rejected"
                      className="px-3 py-2 text-sm rounded cursor-pointer hover:bg-slate-100 outline-none"
                    >
                      <Select.ItemText>Rejected</Select.ItemText>
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6">
              <h3 className="text-sm font-medium text-slate-600 mb-1">
                Total Requests
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                {stats.total}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6">
              <h3 className="text-sm font-medium text-slate-600 mb-1">
                Pending Review
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-orange-600">
                {stats.pending}
              </p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6">
              <h3 className="text-sm font-medium text-slate-600 mb-1">
                Approved
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                {stats.approved}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6">
              <h3 className="text-sm font-medium text-slate-600 mb-1">
                Rejected
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-pink-600">
                {stats.highRisk}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      User
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Date of Birth
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="hover:bg-accent-foreground cursor-pointer"
                    >
                      <td className="px-4 py-4 text-sm text-slate-900">
                        {request.user}
                      </td>

                      {/* <td className="px-4 py-4 text-sm text-slate-900">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-400" />
                          {request.documentType}
                        </div>
                      </td> */}
                      <td className="px-4 py-4 text-sm text-slate-900">
                        {request.dateOfBirth}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {request.submitted}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-700 hover:text-slate-900 hover:bg-primary/20"
                          onClick={() => handleReviewClick(request)}
                        >
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredRequests.length === 0 && (
                <div className="col-span-full flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                  <span className="ml-2 text-gray-700">Loading KYC List</span>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-[90vw] max-w-2xl max-h-[90vh] overflow-y-auto z-50 p-0">
            {selectedRequest && (
              <>
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                  <div>
                    <Dialog.Title className="text-xl font-semibold text-slate-900">
                      KYC Verification Review
                    </Dialog.Title>
                    <p className="text-sm text-slate-600 mt-1">
                      Request ID: {selectedRequest.id}
                    </p>
                  </div>
                  <Dialog.Close className="text-slate-400 hover:text-slate-600">
                    <X className="h-5 w-5" />
                  </Dialog.Close>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* User Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">
                      User Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Full Name</p>
                        <p className="text-sm font-medium text-slate-900">
                          {selectedRequest.user}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">
                          Date of Birth
                        </p>
                        <p className="text-sm font-medium text-slate-900">
                          {selectedRequest.dateOfBirth}
                        </p>
                      </div>

                      {/* <div>
                        <p className="text-xs text-slate-600 mb-1">
                          Document Type
                        </p>
                        <p className="text-sm font-medium text-slate-900">
                          {selectedRequest.documentType}
                        </p>
                      </div> */}
                      <div>
                        <p className="text-xs text-slate-600 mb-1">
                          Submitted Date
                        </p>
                        <p className="text-sm font-medium text-slate-900">
                          {selectedRequest.submitted}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Verification Details */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">
                      Verification Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {/* <div>
                        <p className="text-xs text-slate-600 mb-1">
                          Verification Level
                        </p>
                        <p className="text-sm font-medium text-slate-900">
                          {selectedRequest.verificationLevel}
                        </p>
                      </div> */}
                      {/* <div>
                        <p className="text-xs text-slate-600 mb-1">
                          Risk Assessment
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">
                            {selectedRequest.riskScore}
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              selectedRequest.riskLevel === "Low Risk"
                                ? "text-green-600"
                                : selectedRequest.riskLevel === "Medium Risk"
                                ? "text-orange-600"
                                : "text-red-600"
                            }`}
                          >
                            {selectedRequest.riskLevel}
                          </span>
                        </div>
                      </div> */}
                      <div>
                        <p className="text-xs text-slate-600 mb-1">
                          Current Status
                        </p>
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            selectedRequest.status === "pending"
                              ? "bg-blue-100 text-blue-700"
                              : selectedRequest.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {selectedRequest.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Document Preview */}
                  <div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-3">
                        Document Preview
                      </h3>
                      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center">
                        {selectedRequest.fileUrl ? (
                          <img
                            src={selectedRequest.fileUrl}
                            alt="Document Preview"
                            className="max-h-60 object-contain rounded"
                          />
                        ) : (
                          <div className="flex flex-col items-center">
                            <FileText className="h-16 w-16 text-slate-300 mb-3" />
                            <p className="text-sm text-slate-500 mb-1">
                              Document preview would appear here
                            </p>
                            <p className="text-xs text-slate-400"></p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Verification Decision */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">
                      Verification Decision
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                      <Button
                        onClick={handleApprove}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Request
                      </Button>
                      {/* <Button
                        onClick={handleRequestMoreInfo}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        <Info className="h-4 w-4 mr-2" />
                        Request More Info
                      </Button> */}
                      <Button
                        onClick={handleReject}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Request
                      </Button>
                    </div>
                    <textarea
                      placeholder="Add notes or reason for decision..."
                      value={decisionNotes}
                      onChange={(e) => setDecisionNotes(e.target.value)}
                      className="w-full sm:w-64 lg:w-full  pl-2 pt-2 pr-4 h-14 bg-gray-50 border border-gray rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-background transition-all"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end">
                  <Dialog.Close asChild>
                    <Button
                      variant="outline"
                      className="border-slate-300 text-slate-700 hover:bg-slate-100 bg-transparent"
                    >
                      Close
                    </Button>
                  </Dialog.Close>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root
        open={isKycUsersModalOpen}
        onOpenChange={setIsKycUsersModalOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />

          <Dialog.Content
            id="kyc-users-dialog"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-[95vw] max-w-2xl max-h-[80vh] overflow-hidden z-50 flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                Pending KYC Users
              </Dialog.Title>

              <Dialog.Close className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </Dialog.Close>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Search Section */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Find KYC Users
                </label>

                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    type="text"
                    placeholder="Start typing a name..."
                    value={kycUserSearch}
                    onChange={(e) => setKycUserSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Results Section */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Pending KYC Requests ({pendingUsers.length} results)
                </label>

                <div className="border border-gray-200 rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
                  {pendingUsers.length > 0 ? (
                    pendingUsers.map((user) => {
                      const fullName =
                        typeof user.fullName === "string" &&
                        user.fullName.trim()
                          ? user.fullName.trim()
                          : "Unknown User";

                      const initials = fullName
                        .split(/\s+/)
                        .map((name) => name.charAt(0))
                        .slice(0, 2)
                        .join("")
                        .toUpperCase();

                      return (
                        <div
                          key={user.id}
                          className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                        >
                          {/* User Information */}
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-primary bg-primary/10 font-semibold text-sm">
                              {initials}
                            </div>

                            <div className="min-w-0">
                              <div className="font-semibold text-gray-900 truncate">
                                {user.fullName}
                              </div>

                              <div className="text-sm text-gray-500 truncate">
                                {user.email}
                              </div>
                            </div>
                          </div>

                          {/* Approve Button */}
                          <button
                            onClick={() => handleApproveUser(user)}
                            disabled={approvingUserId !== null}
                            className="shrink-0 px-4 py-2 bg-green-600 text-white hover:bg-green-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {approvingUserId === user.id
                              ? "Approving..."
                              : "Approve"}
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                      <CheckCircle className="w-10 h-10 text-green-500 mb-3" />

                      <p className="text-sm font-medium text-gray-900">
                        No users found
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Text */}
              <p className="text-sm text-gray-500 text-center">
                Approved users will automatically disappear from this list.
              </p>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
