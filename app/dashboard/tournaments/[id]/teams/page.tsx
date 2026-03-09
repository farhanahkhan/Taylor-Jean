"use client";

import { DashboardHeader } from "@/app/Components/dashboard-header";
import { DashboardSidebar } from "@/app/Components/dashboard-sidebar";
import { ArrowLeft, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

interface MarketOption {
  option: string;
  odds: number;
}

interface BetOption {
  optionId: string;
  optionName: string;
  currentOdds: number;
}

interface Bet {
  betId: string;
  title: string;
  options: BetOption[];
}

interface ApiTeamActivity {
  id: string;
  createdAt: string;
  actionStatus: number;
  speciesImage: string;
  tournamentTeamMemberId: string; // ✅ REQUIRED
  tournamentTeam: {
    name: string;
    displayName: string;
  };
}

interface Team {
  id: string;
  teamMemberId: string; // 👈 tournamentTeamMemberId
  teamName: string;
  memberName: string;
  entryDate: string;
  image: string;
  status: 0 | 1 | 2; // ✅ ONLY TYPE
}

// Bet
interface BetOption {
  optionId: string;
  optionName: string;
  currentOdds: number;
}

interface Bet {
  betId: string;
  title: string;
  options: BetOption[];
}

// team-activities/team-points
interface TeamPoint {
  tournamentTeamId: string;
  teamName: string;
  totalPoints: number;
}

export default function TournamentTeamsPage() {
  // const { id: tournamentId } = useParams<{ id: string }>();
  const params = useParams<{ id: string }>();
  const tournamentId = params?.id;
  const tournament = { title: "Team Activity" };

  const [bets, setBets] = useState<Bet[]>([]);
  const [betsLoading, setBetsLoading] = useState(true);

  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsPoint, setTeamsPoint] = useState<TeamPoint[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [marketTitle, setMarketTitle] = useState("");
  const [marketRules, setMarketRules] = useState("");
  const [marketOpens, setMarketOpens] = useState("");
  const [marketCloses, setMarketCloses] = useState("");
  const [options, setOptions] = useState<MarketOption[]>([
    { option: "", odds: 1 },
  ]);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  const addOption = () => {
    setOptions([...options, { option: "", odds: 1 }]);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (
    index: number,
    field: "option" | "odds",
    value: string
  ) => {
    const newOptions = [...options];
    if (field === "option") {
      newOptions[index].option = value;
    } else {
      newOptions[index].odds = parseFloat(value) || 1;
    }
    setOptions(newOptions);
  };

  const handlePublishMarket = async () => {
    try {
      const payload = {
        tournamentId: tournamentId,
        title: marketTitle,
        description: marketRules,
        startTime: new Date(marketOpens).toISOString(),
        endTime: new Date(marketCloses).toISOString(),
        options: options.map((opt) => ({
          optionName: opt.option,
          initialOdds: Number(opt.odds),
        })),
      };

      const res = await fetch("/api/bets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      alert("Market Published Successfully ✅");
      setShowLaunchModal(false);
    } catch (error) {
      console.error(error);
      alert("Server Error ❌");
    }
  };

  useEffect(() => {
    if (!tournamentId) return;

    const fetchTeams = async () => {
      try {
        const res = await fetch(
          `/api/team-activities/tournament/${tournamentId}`
        );

        const json = await res.json();

        console.log("RAW API DATA", json.data);

        const mappedTeams: Team[] = json.data.map(
          (item: ApiTeamActivity): Team => ({
            id: item.id, // ✅ activityId
            teamMemberId: item.tournamentTeamMemberId,
            teamName: item.tournamentTeam?.name ?? "N/A",
            memberName: item.tournamentTeam?.displayName ?? "N/A",
            entryDate: item.createdAt,
            image: item.speciesImage,
            status: item.actionStatus as 0 | 1 | 2, // ✅ FIX
          })
        );
        setTeams(mappedTeams);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [tournamentId]);

  // POST API
  const reviewEntry = async (activityId: string, approve: boolean) => {
    try {
      setActionLoading(true); // 🔄 start loading
      const res = await fetch("/api/team-activities/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activityId,
          approve,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message);
      }

      setTeams((prev) =>
        prev.map((team) =>
          team.id === activityId ? { ...team, status: approve ? 1 : 2 } : team
        )
      );
      setSelectedTeam((prev) =>
        prev ? { ...prev, status: approve ? 1 : 2 } : prev
      );
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };
  // GET API
  useEffect(() => {
    const fetchBets = async () => {
      if (!tournamentId) return;

      try {
        setBetsLoading(true);
        const res = await fetch(
          `/api/bets/tournament/${tournamentId}/bets-tournament`
        );

        const json = await res.json();

        if (!res.ok) {
          console.error(json.message);
          setBets([]);
          return;
        }

        setBets(json.data || []);
      } catch (err) {
        console.error(err);
        setBets([]);
      } finally {
        setBetsLoading(false);
      }
    };
    fetchBets();
  }, [tournamentId]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(
          `/api/bets/tournament/${tournamentId}/team-points`
        );

        const data = await res.json();

        if (data?.data) {
          const sorted = [...data.data].sort(
            (a: TeamPoint, b: TeamPoint) => b.totalPoints - a.totalPoints
          );

          setTeamsPoint(sorted);
        }
      } catch (error) {
        console.error("Leaderboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (tournamentId) {
      fetchLeaderboard();
    }
  }, [tournamentId]);

  // post bet id

  const handleSettleMarket = async (betId: string) => {
    debugger;
    console.log("BET ID RECEIVED:", betId);
    console.log("SELECTED OPTIONS:", selectedOptions);
    debugger;

    if (!betId) {
      alert("Bet ID missing ❌");
      return;
    }
    debugger;
    const winningOptionId = selectedOptions[betId];
    debugger;

    if (!winningOptionId) {
      alert("Please select a winning option first");
      return;
    }
    debugger;

    try {
      const res = await fetch(`/api/Bets/${betId}/close`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          betId: betId,
          winningOptionId: winningOptionId,
        }),
      });
      debugger;

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }
      debugger;

      alert("Market settled successfully ✅");

      // optional: modal close
      // setIsOpen(false);
    } catch (error) {
      console.error(error);
      // alert("Server error");
    }
  };

  const handleSelect = (betId: string, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [betId]: optionId,
    }));
  };

  // const handleSettleMarket = async (betId: string) => {
  //   debugger;
  //   console.log("Calling API with Bet ID:", betId);
  //   const winningOptionId = selectedOptions[betId];
  //   debugger;

  //   if (!winningOptionId) {
  //     alert("Please select a winning option first ❌");
  //     return;
  //   }
  //   debugger;

  //   try {
  //     const res = await fetch(`/api/bets/${betId}/close`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },

  //       credentials: "include", // 🔥 THIS LINE IMPORTANT
  //       body: JSON.stringify({ winningOptionId }),
  //     });
  //     debugger;

  //     const data = await res.json();
  //     debugger;
  //     if (!res.ok) {
  //       alert(data.message || "Something went wrong ❌");
  //       return;
  //     }
  //     debugger;

  //     alert("Market settled successfully ✅");
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col w-0">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-200 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </Link>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    Everglades Challenge
                  </h1>
                  <p className="text-sm text-slate-600">
                    Control Dashboard • Florida Keys
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLaunchModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-foreground text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Launch New Bet
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-slate-600">
                  Active Teams
                </p>
                <div className="w-5 h-5 text-slate-400">⚡</div>
              </div>
              <p className="text-2xl font-bold text-slate-900">42</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-slate-600">Prize Pool</p>
                <div className="w-5 h-5 text-slate-400">⊙</div>
              </div>
              <p className="text-2xl font-bold text-slate-900">$25,000</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-slate-600">Markets</p>
                <div className="w-5 h-5 text-slate-400">⊕</div>
              </div>
              <p className="text-2xl font-bold text-slate-900">1</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-slate-600">Volume</p>
                <div className="w-5 h-5 text-slate-400">📊</div>
              </div>
              <p className="text-2xl font-bold text-slate-900">$8.4K</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-lg">⊙</span>
                <h2 className="text-lg font-bold text-slate-900">
                  Current Leaderboard
                </h2>
              </div>

              {loading ? (
                <p className="text-sm text-slate-500">Loading...</p>
              ) : (
                <div className="space-y-4">
                  {teamsPoint.map((team, index) => (
                    <div
                      key={team.tournamentTeamId}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {team.teamName}
                          </p>
                          <p className="text-xs text-slate-600">Total Points</p>
                        </div>
                      </div>
                      <p className="font-bold text-slate-900">
                        {team.totalPoints}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900 mb-6">
                  Open Betting Markets
                </h2>

                <button
                  onClick={() => setIsOpen(true)}
                  className="px-3 py-1 text-sm bg-primary text-white rounded"
                >
                  View All
                </button>
              </div>

              {betsLoading && (
                <p className="text-slate-500">Loading markets...</p>
              )}

              {!betsLoading && bets.length === 0 && (
                <p className="text-slate-500">No active markets found</p>
              )}

              <div className="space-y-6 overflow-auto h-[40vh]">
                {bets.map((bet) => (
                  <div key={bet.betId}>
                    <h3 className="text-base font-bold text-slate-900 mb-4">
                      {bet.title}
                    </h3>

                    <div className="grid grid-cols-1 gap-4 overflow-y-auto">
                      {bet.options.map((opt) => (
                        <div
                          key={opt.optionId}
                          className="flex justify-between items-center border rounded-md p-3"
                        >
                          <p className="text-md font-semibold text-slate-600">
                            {opt.optionName}
                          </p>
                          <p className="text-md font-bold text-primary">
                            {opt.currentOdds}x
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-[90%]">
            {isOpen && (
              <div className="fixed inset-0 bg-[#000000bd] flex items-center justify-center z-50">
                <div className="bg-white rounded-lg w-[70%] max-w-xl p-6 relative">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-slate-500 font-bold"
                  >
                    ✕
                  </button>
                  <h2 className="text-lg font-bold mb-4">
                    All Betting Markets
                  </h2>
                  <div className="space-y-6 max-h-[80vh] overflow-y-auto">
                    {bets.map((bet) => (
                      <div key={bet.betId}>
                        <h3 className="text-base font-bold text-slate-900 mb-4">
                          {bet.title}
                        </h3>

                        <div className="grid grid-cols-1 gap-4">
                          {bet.options.map((opt) => (
                            <div
                              key={opt.optionId}
                              className={`flex flex-col rounded-md p-3 cursor-pointer ${
                                selectedOptions[bet.betId] === opt.optionId
                                  ? "bg-primary/20"
                                  : "bg-white"
                              }`}
                              onClick={() =>
                                handleSelect(bet.betId, opt.optionId)
                              }
                            >
                              <div className="flex justify-between items-center p-3 border rounded-md">
                                <p className="text-md font-semibold text-slate-600">
                                  {opt.optionName}
                                </p>
                                <p className="text-md font-bold text-primary">
                                  {opt.currentOdds}x
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-slate-200 flex gap-4 mt-4">
                          <button
                            onClick={() =>
                              handleSettleMarket(String(bet.betId))
                            }
                            disabled={!selectedOptions[bet.betId]}
                            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 w-[50%] font-medium rounded-lg transition-colors ${
                              selectedOptions[bet.betId]
                                ? "bg-foreground text-white"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            SETTLE Bet
                          </button>
                          <button className="inline-flex w-[50%] items-center justify-center gap-2 px-4 py-2.5 text-red-400 font-medium rounded-lg transition-colors border">
                            STOP Bet
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-lg">✨</span>
                <h2 className="text-lg font-bold text-slate-900">
                  Submission Feed
                </h2>
              </div>
              <Link
                href={`/dashboard/tournaments/${tournamentId}/team`}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
              >
                View Full Detail Feed
              </Link>
            </div>
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={16}
              slidesPerView={3}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                  <SwiperSlide key={team.id}>
                    <div
                      key={team.id}
                      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedTeam(team)}
                    >
                      <div className="relative h-48 w-full bg-slate-200">
                        <Image
                          src={team.image || "/placeholder.svg"}
                          alt={team.teamName}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white text-lg font-bold">
                          {team.teamName}
                        </div>
                        <div className="absolute top-4 right-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              team.status === 1
                                ? "bg-green-100 text-green-800"
                                : team.status === 2
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {team.status === 1
                              ? "ACCEPTED"
                              : team.status === 2
                              ? "REJECTED"
                              : "PENDING"}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-200">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                            {team.memberName?.[0] ?? "?"}
                          </div>
                          <span className="font-semibold text-slate-900">
                            {team.memberName}
                          </span>
                        </div>

                        <div className="space-y-3 text-sm mb-2 pb-2 border-slate-200">
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                              Identification
                            </p>
                            <p className="text-slate-900 font-medium">
                              {/* {team.identification} */}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                              Entry Date
                            </p>
                            <p className="text-slate-900">{team.entryDate}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </div>
            </Swiper>
          </div>
        </main>
      </div>

      {selectedTeam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden">
            <div className="relative h-48 w-full bg-slate-200">
              <Image
                src={selectedTeam.image || "/placeholder.svg"}
                alt={selectedTeam.teamName}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white text-lg font-bold">
                {selectedTeam.teamName}
              </div>
              <button
                onClick={() => setSelectedTeam(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-1.5 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-900" />
              </button>
            </div>
            {/* You can add detailed modal info here using selectedTeam.activities */}

            <div className="p-4">
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-200">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {selectedTeam.memberName?.[0] ?? "?"}
                </div>
                <span className="font-semibold text-slate-900">
                  {selectedTeam.memberName}
                </span>
              </div>

              <div className="space-y-3 text-sm mb-2 pb-2 border-slate-200">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Identification
                  </p>
                  <p className="text-slate-900 font-medium">
                    {/* {team.identification} */}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Entry Date
                  </p>
                  <p className="text-slate-900">{selectedTeam.entryDate}</p>
                </div>
              </div>

              {/* <div
                      className={`text-center py-6 rounded-lg mb-6 ${
                        selectedTeam.status === "verified"
                          ? "bg-green-50"
                          : selectedTeam.status === "pending"
                          ? "bg-red-50"
                          : "bg-blue-50"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                          selectedTeam.status === "verified"
                            ? "bg-green-500"
                            : selectedTeam.status === "pending"
                            ? "bg-red-500"
                            : "bg-blue-500"
                        }`}
                      >
                        {selectedTeam.status === "verified" ? (
                          <span className="text-white font-bold">✓</span>
                        ) : selectedTeam.status === "pending" ? (
                          <span className="text-white font-bold">✕</span>
                        ) : (
                          <span className="text-white text-lg">⏱</span>
                        )}
                      </div>
                      <p
                        className={`font-bold italic ${
                          selectedTeam.status === "verified"
                            ? "text-green-700"
                            : selectedTeam.status === "pending"
                            ? "text-red-700"
                            : "text-blue-700"
                        }`}
                      >
                        {selectedTeam.status === "verified"
                          ? "ENTRY VERIFIED"
                          : selectedTeam.status === "pending"
                          ? "ENTRY INVALIDATED"
                          : "PENDING VERIFICATION"}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          selectedTeam.status === "verified"
                            ? "text-green-600"
                            : selectedTeam.status === "pending"
                            ? "text-red-600"
                            : "text-blue-600"
                        }`}
                      >
                        FINAL STATUS RECORDED
                      </p>
                    </div> */}
              <div
                className={`text-center py-6 rounded-lg mb-6 ${
                  selectedTeam.status === 1
                    ? "bg-green-50"
                    : selectedTeam.status === 2
                    ? "bg-red-50"
                    : "bg-blue-50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                    selectedTeam.status === 1
                      ? "bg-green-500"
                      : selectedTeam.status === 2
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
                >
                  {selectedTeam.status === 1 ? (
                    <span className="text-white font-bold">✓</span>
                  ) : selectedTeam.status === 2 ? (
                    <span className="text-white font-bold">✕</span>
                  ) : (
                    <span className="text-white text-lg">⏱</span>
                  )}
                </div>

                <p
                  className={`font-bold italic ${
                    selectedTeam.status === 1
                      ? "text-green-700"
                      : selectedTeam.status === 2
                      ? "text-red-700"
                      : "text-blue-700"
                  }`}
                >
                  {selectedTeam.status === 1
                    ? "ENTRY VERIFIED"
                    : selectedTeam.status === 2
                    ? "ENTRY INVALIDATED"
                    : "PENDING VERIFICATION"}
                </p>

                <p
                  className={`text-xs mt-1 ${
                    selectedTeam.status === 1
                      ? "text-green-600"
                      : selectedTeam.status === 2
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                >
                  FINAL STATUS RECORDED
                </p>
              </div>

              {selectedTeam.status === 0 && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => reviewEntry(selectedTeam.id, true)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                  >
                    Verify Entry
                  </button>

                  <button
                    onClick={() => reviewEntry(selectedTeam.id, false)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showLaunchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Launch New Betting Market
              </h2>
              <button
                onClick={() => setShowLaunchModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  MARKET TITLE
                </label>
                <input
                  type="text"
                  value={marketTitle}
                  onChange={(e) => setMarketTitle(e.target.value)}
                  placeholder="e.g. Winner Prediction"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  MARKET RULES & CONDITIONS
                </label>
                <textarea
                  value={marketRules}
                  onChange={(e) => setMarketRules(e.target.value)}
                  placeholder="Specify winning conditions clearly..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Bet OPENS
                  </label>
                  <input
                    type="datetime-local"
                    value={marketOpens}
                    onChange={(e) => setMarketOpens(e.target.value)}
                    placeholder="14/02/2026, 12:30"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Bet CLOSES
                  </label>
                  <input
                    type="datetime-local"
                    value={marketCloses}
                    onChange={(e) => setMarketCloses(e.target.value)}
                    placeholder="14/02/2026, 12:30"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-semibold text-slate-700">
                    OUTCOME OPTIONS & ODDS
                  </label>
                  <button
                    onClick={addOption}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Option
                  </button>
                </div>

                <div className="space-y-3">
                  {options.map((opt, index) => (
                    <div key={index} className="flex gap-3 items-end">
                      <input
                        type="text"
                        value={opt.option}
                        onChange={(e) =>
                          handleOptionChange(index, "option", e.target.value)
                        }
                        placeholder="e.g. Team Apex"
                        className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={opt.odds}
                          onChange={(e) =>
                            handleOptionChange(index, "odds", e.target.value)
                          }
                          placeholder="1"
                          className="w-20 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-center"
                          step="0.1"
                          min="0"
                        />
                        <span className="text-slate-500 text-sm">@pds</span>
                      </div>
                      {index > 0 && (
                        <button
                          onClick={() => removeOption(index)}
                          className="p-2.5 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-slate-200">
                <button
                  onClick={() => setShowLaunchModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={handlePublishMarket}
                  className="flex-1 px-4 py-3 bg-dark-navy text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  CONFIRM & PUBLISH MARKET
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
