"use client";

import { DashboardHeader } from "@/app/Components/dashboard-header";
import { DashboardSidebar } from "@/app/Components/dashboard-sidebar";
import { ArrowLeft, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function TournamentTeamsPage() {
  // const { id: tournamentId } = useParams<{ id: string }>();
  const params = useParams<{ id: string }>();
  const tournamentId = params?.id;
  const tournament = { title: "Team Activity" };

  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!tournamentId) return;

    const fetchTeams = async () => {
      try {
        const res = await fetch(
          `/api/team-activities/tournament/${tournamentId}`
        );

        const json = await res.json();

        console.log("RAW API DATA", json.data);

        // const mappedTeams: Team[] = json.data.map(
        //   (item: ApiTeamActivity): Team => {
        //     const status: 0 | 1 | 2 =
        //       item.actionStatus === 1 ? 1 : item.actionStatus === 2 ? 2 : 0;

        //     return {
        //       id: item.id,
        //       teamName: item.tournamentTeam?.name ?? "N/A",
        //       memberName: item.tournamentTeam?.displayName ?? "N/A",
        //       entryDate: item.createdAt,
        //       image: item.speciesImage,
        //       status,
        //     };
        //   }
        // );
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

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="mb-8">
            <Link
              href={`/dashboard/tournaments/${tournamentId}`}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/90 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tournament
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">
              {tournament.title}
            </h1>
            <p className="text-slate-600 mt-1">
              Activity Feed - Real-time tournament updates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-2">
            {teams.map((team) => (
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
                    {/* <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        team.status === "verified"
                          ? "bg-green-100 text-green-800"
                          : team.status === "verified"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {team.status === "verified"
                        ? "ACCEPTED"
                        : team.status === "invalidated"
                        ? "REJECTED"
                        : "PENDING REVIEW"}
                    </span> */}
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
            ))}
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
    </div>
  );
}
