"use client";

import { useState, useMemo } from "react";
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
} from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { DashboardSidebar } from "@/app/Components/dashboard-sidebar";
import { DashboardHeader } from "@/app/Components/dashboard-header";
import * as Dialog from "@radix-ui/react-dialog";

interface KYCRequest {
  id: string;
  user: string;
  email: string;
  documentType: string;
  verificationLevel: string;
  riskScore: number;
  riskLevel: string;
  submitted: string;
  status: "pending" | "approved" | "review" | "rejected";
}

export default function KYCPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [decisionNotes, setDecisionNotes] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<KYCRequest | null>(
    null
  );
  const [kycRequests, setKycRequests] = useState<KYCRequest[]>([
    {
      id: "#1",
      user: "John Smith",
      email: "john.smith@email.com",
      documentType: "Passport",
      verificationLevel: "Advanced",
      riskScore: 15,
      riskLevel: "Low Risk",
      submitted: "2024-06-15 10:30",
      status: "pending",
    },
    {
      id: "#2",
      user: "Sarah Johnson",
      email: "sarah.j@email.com",
      documentType: "Driver License",
      verificationLevel: "Intermediate",
      riskScore: 8,
      riskLevel: "Low Risk",
      submitted: "2024-06-14 14:20",
      status: "approved",
    },
    {
      id: "#3",
      user: "Mike Davis",
      email: "mdavis@email.com",
      documentType: "National ID",
      verificationLevel: "Advanced",
      riskScore: 42,
      riskLevel: "Medium Risk",
      submitted: "2024-06-13 09:15",
      status: "review",
    },
    {
      id: "#4",
      user: "Emma Wilson",
      email: "emma.w@email.com",
      documentType: "Passport",
      verificationLevel: "Basic",
      riskScore: 75,
      riskLevel: "High Risk",
      submitted: "2024-06-12 16:45",
      status: "rejected",
    },
    {
      id: "#5",
      user: "Chris Brown",
      email: "cbrown@email.com",
      documentType: "Driver License",
      verificationLevel: "Intermediate",
      riskScore: 12,
      riskLevel: "Low Risk",
      submitted: "2024-06-11 11:30",
      status: "pending",
    },
  ]);

  const handleReviewClick = (request: KYCRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
    setDecisionNotes("");
  };

  const handleApprove = () => {
    if (selectedRequest) {
      setKycRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === selectedRequest.id
            ? { ...req, status: "approved" as const }
            : req
        )
      );
      setIsModalOpen(false);
      setSelectedRequest(null);
      setDecisionNotes("");
    }
  };

  const handleReject = () => {
    if (selectedRequest) {
      setKycRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === selectedRequest.id
            ? { ...req, status: "rejected" as const }
            : req
        )
      );
      setIsModalOpen(false);
      setSelectedRequest(null);
      setDecisionNotes("");
    }
  };

  const handleRequestMoreInfo = () => {
    if (selectedRequest) {
      setKycRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === selectedRequest.id
            ? { ...req, status: "review" as const }
            : req
        )
      );
      setIsModalOpen(false);
      setSelectedRequest(null);
      setDecisionNotes("");
    }
  };

  const filteredRequests = useMemo(() => {
    return kycRequests.filter((request) => {
      const matchesSearch =
        request.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.documentType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, kycRequests]);

  const stats = useMemo(() => {
    const total = filteredRequests.length;
    const pending = filteredRequests.filter(
      (r) => r.status === "pending"
    ).length;
    const approved = filteredRequests.filter(
      (r) => r.status === "approved"
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

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              KYC Management
            </h1>
            <p className="text-slate-600 mt-1">
              Manage and review user verification requests
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-md shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                placeholder="Search KYC requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-75 pl-9 pr-4 h-9 bg-gray-50 border border-gray rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-background transition-all"
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
                High Risk
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
                      Request ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Document Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Verification Level
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Risk Score
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
                    <tr key={request.id} className="hover:bg-primary/10">
                      <td className="px-4 py-4 text-sm font-medium text-slate-900">
                        {request.id}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-900">
                        {request.user}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {request.email}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-900">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-400" />
                          {request.documentType}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {request.verificationLevel}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {getRiskBadge(request.riskLevel, request.riskScore)}
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
                        <p className="text-xs text-slate-600 mb-1">Email</p>
                        <p className="text-sm font-medium text-blue-600">
                          {selectedRequest.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">
                          Document Type
                        </p>
                        <p className="text-sm font-medium text-slate-900">
                          {selectedRequest.documentType}
                        </p>
                      </div>
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
                      <div>
                        <p className="text-xs text-slate-600 mb-1">
                          Verification Level
                        </p>
                        <p className="text-sm font-medium text-slate-900">
                          {selectedRequest.verificationLevel}
                        </p>
                      </div>
                      <div>
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
                      </div>
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
                              : selectedRequest.status === "review"
                              ? "bg-orange-100 text-orange-700"
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
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">
                      Document Preview
                    </h3>
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center">
                      <FileText className="h-16 w-16 text-slate-300 mb-3" />
                      <p className="text-sm text-slate-500 mb-1">
                        Document preview would appear here
                      </p>
                      <p className="text-xs text-slate-400">
                        {selectedRequest.documentType}
                      </p>
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
                      <Button
                        onClick={handleRequestMoreInfo}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        <Info className="h-4 w-4 mr-2" />
                        Request More Info
                      </Button>
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
                      className="min-h-[100px] resize-none"
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
    </div>
  );
}
