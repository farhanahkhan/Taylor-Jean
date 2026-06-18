"use client";

import { useState, useMemo, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Search, Filter, Clock, CheckCircle, XCircle, X } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { DashboardSidebar } from "@/app/Components/dashboard-sidebar";
import { DashboardHeader } from "@/app/Components/dashboard-header";
import * as Dialog from "@radix-ui/react-dialog";
import { apiFetch } from "@/lib/apiFetch";
import { useParams, useSearchParams } from "next/navigation";

// Sample betting data

type BetStatus = "pending" | "won" | "review" | "lost";

type BetRow = {
  id: string;
  fullName: string;
  email: string;
  totalStake: number;
  betTitle: string;
  stake: number;
  oddsAtTime: number;
  potentialWin: number;
  status: BetStatus;
  placedAt: string;
};

type ApiUserBet = {
  userBetId: string;
  betId: string;
  betTitle: string;
  optionId: string;
  optionName: string;
  stake: number;
  oddsAtTime: number;
  potentialWin: number;
  status: string;
  placedAt: string;
};

type ApiUserWiseBet = {
  userId: string;
  fullName: string;
  displayName: string | null;
  email: string;
  totalStake: number;
  bets: ApiUserBet[];
};

type UserWiseBetResponse = {
  message: string;
  statusCode: number;
  status: boolean;
  data: ApiUserWiseBet[];
};
const statusStyles = {
  pending: "bg-blue-50 text-blue-700 border border-blue-200",
  won: "bg-green-50 text-green-700 border border-green-200",
  review: "bg-orange-50 text-orange-700 border border-orange-200",
  lost: "bg-red-50 text-red-700 border border-red-200",
};

const statusIcons = {
  pending: Clock,
  won: CheckCircle,
  review: Clock,
  lost: XCircle,
};

export default function BettingPage() {
  const [betsData, setBetsData] = useState<BetRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBet, setSelectedBet] = useState<(typeof betsData)[0] | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adjustedPayout, setAdjustedPayout] = useState("");
  const [modalStatus, setModalStatus] = useState<
    "pending" | "won" | "review" | "lost"
  >("pending");

  const searchParams = useSearchParams();
  const tournamentId = searchParams.get("tournamentId");

  const handleViewBet = (bet: BetRow) => {
    setSelectedBet(bet);
    setAdjustedPayout(bet.potentialWin.toString());
    setModalStatus(bet.status);
    setIsModalOpen(true);
  };
  const handleApproveBet = () => {
    if (selectedBet) {
      setModalStatus("won");
    }
  };

  const handleRejectBet = () => {
    if (selectedBet) {
      setModalStatus("lost");
    }
  };

  const handleSaveChanges = () => {
    if (selectedBet) {
      setBetsData((prevBets) =>
        prevBets.map((bet) =>
          bet.id === selectedBet.id
            ? {
                ...bet,
                potentialWin:
                  Number.parseFloat(adjustedPayout) || bet.potentialWin,
                status: modalStatus,
              }
            : bet,
        ),
      );

      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (!tournamentId) return;

    const fetchUserWiseBets = async () => {
      try {
        setLoading(true);

        const res = await apiFetch(
          `/api/bets/user-wise-bet?tournamentId=${tournamentId}`,
        );

        const result: UserWiseBetResponse = await res.json();

        if (!res.ok || !result.status) {
          alert(result.message || "Failed to fetch bets");
          return;
        }

        const rows: BetRow[] = result.data.flatMap((user) =>
          user.bets.map((bet) => ({
            id: bet.userBetId,
            fullName: user.fullName,
            email: user.email,
            totalStake: user.totalStake,
            betTitle: bet.betTitle,
            stake: bet.stake,
            oddsAtTime: bet.oddsAtTime,
            potentialWin: bet.potentialWin,
            status: bet.status.toLowerCase() as BetStatus,
            placedAt: bet.placedAt,
          })),
        );

        setBetsData(rows);
      } finally {
        setLoading(false);
      }
    };

    fetchUserWiseBets();
  }, [tournamentId]);
  const filteredBets = useMemo(() => {
    return betsData.filter((bet) => {
      const matchesStatus =
        statusFilter === "all" || bet.status === statusFilter;

      const matchesSearch =
        searchQuery === "" ||
        bet.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bet.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bet.betTitle.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [searchQuery, statusFilter, betsData]);
  const totalBets = filteredBets.length;

  const totalAmount = filteredBets.reduce((sum, bet) => sum + bet.stake, 0);
  const pendingCount = filteredBets.filter(
    (bet) => bet.status === "pending",
  ).length;

  const completedCount = filteredBets.filter(
    (bet) => bet.status === "won",
  ).length;
  //   const completedCount = filteredBets.filter(
  //   (bet) => bet.status === "complete"
  // ).length;
  const needsReview = filteredBets.filter(
    (bet) => bet.status === "review",
  ).length;

  return (
    <div className="flex min-h-screen bg-slate-900 overflow-x-hidden max-w-full">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-h-screen w-0">
        <DashboardHeader />

        <main className="flex-1 p-4 md:p-6 bg-slate-50">
          <div className="max-w-8xl  space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Betting Management
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Monitor and manage all betting activities
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 justify-between bg-white p-4 rounded-md shadow-sm">
              <div className="relative flex-1 max-w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  placeholder="Search bets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 lg:w-80 pl-9 pr-4 h-9 bg-gray-50 border border-gray rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-background transition-all"
                />
              </div>

              <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
                <Select.Trigger className="inline-flex items-center justify-between gap-2 px-4 py-2 text-sm font-medium bg-white border border-slate-200 rounded-lg hover:bg-primary/10 min-w-full sm:min-w-[140px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <Select.Value placeholder="All Status" />
                  </div>
                  <Select.Icon>
                    <ChevronDown className="h-4 w-4" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden bg-white rounded-lg border border-slate-200 shadow-lg">
                    <Select.Viewport className="p-1">
                      <Select.Item
                        value="all"
                        className="relative flex items-center px-8 py-2 text-sm rounded cursor-pointer hover:bg-slate-100 focus:bg-slate-100 outline-none"
                      >
                        <Select.ItemText>All Status</Select.ItemText>
                      </Select.Item>
                      <Select.Item
                        value="pending"
                        className="relative flex items-center px-8 py-2 text-sm rounded cursor-pointer hover:bg-slate-100 focus:bg-slate-100 outline-none"
                      >
                        <Select.ItemText>Pending</Select.ItemText>
                      </Select.Item>
                      <Select.Item
                        value="won"
                        className="relative flex items-center px-8 py-2 text-sm rounded cursor-pointer hover:bg-slate-100 focus:bg-slate-100 outline-none"
                      >
                        <Select.ItemText>Won</Select.ItemText>
                      </Select.Item>
                      <Select.Item
                        value="review"
                        className="relative flex items-center px-8 py-2 text-sm rounded cursor-pointer hover:bg-slate-100 focus:bg-slate-100 outline-none"
                      >
                        <Select.ItemText>Review</Select.ItemText>
                      </Select.Item>
                      <Select.Item
                        value="lost"
                        className="relative flex items-center px-8 py-2 text-sm rounded cursor-pointer hover:bg-slate-100 focus:bg-slate-100 outline-none"
                      >
                        <Select.ItemText>Lost</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            {/* Stats Cards - Made fully responsive with proper grid breakpoints */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Total Bets
                </p>
                <p className="text-3xl font-bold text-slate-900">{totalBets}</p>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Total Amount
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  ${totalAmount}
                </p>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Pending Bets
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {pendingCount}
                </p>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Completed Bets
                </p>
                <p className="text-3xl font-bold text-primary">
                  {" "}
                  {completedCount}
                </p>
              </div>
            </div>

            {/* Bets Table - Made table responsive with horizontal scroll on mobile */}
            {/* <div className="bg-white rounded-lg border border-slate-200 overflow-hidden"> */}
            <div className="relative overflow-x-auto bg-white rounded-lg border border-slate-200">
              <table className="w-full min-w-[1100px] text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Full Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Total Stake
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Bet Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Stake
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Odds At Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Potential Win
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-6 py-6 text-center text-slate-500"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : filteredBets.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-6 py-6 text-center text-slate-500"
                      >
                        No bets found
                      </td>
                    </tr>
                  ) : (
                    filteredBets.map((bet) => {
                      const StatusIcon = statusIcons[bet.status];

                      return (
                        <tr
                          key={bet.id}
                          className="hover:bg-accent-foreground cursor-pointer"
                        >
                          <td className="px-6 py-4">{bet.fullName}</td>
                          <td className="px-6 py-4">{bet.email}</td>
                          <td className="px-6 py-4">{bet.totalStake}</td>
                          <td className="px-6 py-4">{bet.betTitle}</td>
                          <td className="px-6 py-4">{bet.stake}</td>
                          <td className="px-6 py-4">{bet.oddsAtTime}</td>
                          <td className="px-6 py-4">{bet.potentialWin}</td>
                          <td className="px-6 py-4">
                            {new Date(bet.placedAt).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                                statusStyles[bet.status]
                              }`}
                            >
                              <StatusIcon className="h-3.5 w-3.5" />
                              {bet.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {/* </div> */}
          </div>
        </main>
      </div>

      {/* Bet Details Modal */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl p-6 md:p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <Dialog.Title className="text-xl md:text-2xl font-bold text-slate-900">
                  Bet Details
                </Dialog.Title>
                <p className="text-sm text-slate-600 mt-1">
                  ID: {selectedBet?.id}
                </p>
              </div>
              <Dialog.Close className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </Dialog.Close>
            </div>

            {selectedBet && (
              <div className="space-y-6">
                {/* User and Tournament Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">
                      User
                    </p>
                    <p className="text-base text-slate-900">
                      {selectedBet.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">
                      Tournament
                    </p>
                    <p className="text-base text-slate-900">
                      {selectedBet.email}
                    </p>
                  </div>
                </div>

                {/* Bet Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">
                      Bet Type
                    </p>
                    <p className="text-base text-slate-900">
                      {selectedBet.betTitle}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">
                      Placed Date
                    </p>
                    <p className="text-base text-slate-900">
                      {new Date(selectedBet.placedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Financial Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">
                      Bet Amount
                    </p>
                    <p className="text-base font-semibold text-slate-900">
                      ${selectedBet.stake}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">
                      Odds
                    </p>
                    <p className="text-base text-slate-900">
                      {selectedBet.oddsAtTime}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">
                      Potential Payout
                    </p>
                    <p className="text-base font-semibold text-slate-900">
                      ${selectedBet.potentialWin}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">
                      Status
                    </p>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusStyles[modalStatus]}`}
                    >
                      {modalStatus}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <p className="text-sm font-semibold text-slate-900 mb-4">
                    Adjust Payout or Status
                  </p>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <input
                      type="number"
                      value={adjustedPayout}
                      onChange={(e) => setAdjustedPayout(e.target.value)}
                      placeholder="Enter adjusted payout"
                      className="w-full sm:w-64 lg:w-80 pl-4 pr-4 h-9 bg-gray-50 border border-gray rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-background transition-all"
                    />
                    <div className="flex gap-3">
                      <Button
                        onClick={handleApproveBet}
                        className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={handleRejectBet}
                        className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    className="bg-slate-800 hover:bg-slate-900 text-white"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
