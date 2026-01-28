"use client";

import { DashboardHeader } from "@/app/Components/dashboard-header";
import { DashboardSidebar } from "@/app/Components/dashboard-sidebar";
import { ArrowLeft, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TournamentTeam {
  id: string;
  tournamentId: string;
  name: string;
  displayName: string;
}

interface ApiTeamActivity {
  id: string;
  createdAt: string;
  actionStatus: number;
  speciesImage: string;
  tournamentTeam: {
    name: string;
    displayName: string;
  };
}

interface Activity {
  id: string;
  speciesId: string;
  speciesImage: string;
  actionStatus: number;
  createdAt: string;
  tournamentTeamId: string;
  tournamentTeamMemberId: string;
}
interface Team {
  id: string;
  teamName: string;
  memberName: string;
  entryDate: string;
  image: string;
  status: "verified" | "pending";
}

// interface Team {
//   id: string;
//   tournamentId: string;
//   teamName: string;
//   memberName: string;
//   identification: string;
//   entryDate: string;
//   entryTime: string;
//   submissionHash: string;
//   image: string;
//   status: "verified" | "pending" | "invalidated";
//   activities: Activity[];
// }

export default function TournamentTeamsPage() {
  // const { id: tournamentId } = useParams<{ id: string }>();
  const params = useParams<{ id: string }>();
  const tournamentId = params?.id;
  const tournament = { title: "Tournament Team" };

  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (!tournamentId) return;

  //   const fetchTeams = async () => {
  //     try {
  //       // debugger;
  //       const res = await fetch(
  //         `/api/team-activities/tournament/${tournamentId}`
  //         // "http://mobileapp.designswebs.com:5431/api/team-activities/tournament/75411a28-0740-47f6-84bf-ba275a35cc0d"
  //       );
  //       console.log("Tournament ID:", tournamentId);
  //       // debugger;
  //       const json = await res.json();
  //       // debugger;
  //       setTeams(json.data || []);
  //     } catch (err) {
  //       console.error(err);
  //       // debugger;
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchTeams();
  // }, [tournamentId]);

  //   if (loading) {
  //     return (
  //       <div className="flex min-h-screen bg-slate-50">
  //         <DashboardSidebar />
  //         <div className="flex-1 flex flex-col">
  //           <DashboardHeader />
  //           <main className="flex-1 flex items-center justify-center p-6">
  //             <div className="text-center">
  //               <h1 className="text-2xl font-bold text-slate-900 mb-2">
  //                 Loading Tournament...
  //               </h1>
  //             </div>
  //           </main>
  //         </div>
  //       </div>
  //     );
  //   }

  //   if (teams.length === 0) {
  //     return (
  //       <div className="flex min-h-screen bg-slate-50">
  //         <DashboardSidebar />
  //         <div className="flex-1 flex flex-col">
  //           <DashboardHeader />
  //           <main className="flex-1 flex items-center justify-center p-6">
  //             <div className="text-center">
  //               <h1 className="text-2xl font-bold text-slate-900 mb-2">
  //                 No Teams Found
  //               </h1>
  //               <Link
  //                 href="/dashboard/tournaments"
  //                 className="inline-flex items-center gap-2 text-primary hover:text-primary/90 transition-colors"
  //               >
  //                 <ArrowLeft className="w-4 h-4" />
  //                 Back to Tournaments
  //               </Link>
  //             </div>
  //           </main>
  //         </div>
  //       </div>
  //     );
  //   }

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
            id: item.id,
            teamName: item.tournamentTeam?.name ?? "N/A",
            memberName: item.tournamentTeam?.displayName ?? "N/A",
            entryDate: item.createdAt,
            image: item.speciesImage,
            status: item.actionStatus === 1 ? "verified" : "pending",
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
                        team.status === "verified"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {team.status === "verified" ? "ACCEPTED" : "PENDING"}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
