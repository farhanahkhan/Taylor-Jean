"use client";

import { TeamHeader } from "@/app/Components/team-header";
import { TeamSidebar } from "@/app/Components/team-sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Check } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";

// rightside
interface ApiMember {
  userId: string;
  fullName: string | null;
  email: string;
  isSelected: boolean;
}

interface ApiTeam {
  id: string;
  name: string;
  displayName: string;
  imageUrl: string | null;
  members: ApiMember[];
}

interface TournamentApi {
  id: string;
  name: string;
  imageUrl?: string;
}

export default function TeamTournamentPage() {
  const [teams, setTeams] = useState<ApiTeam[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<ApiTeam | null>(null);
  // const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [selectedPlayersByTeam, setSelectedPlayersByTeam] = useState<
    Record<string, string[]>
  >({});
  // const [tournamentId, setTournamentId] = useState("");
  const [loadingTournaments, setLoadingTournaments] = useState(false);
  const [tournaments, setTournaments] = useState<TournamentApi[]>([]);
  const params = useParams();
  const tournamentIdFromUrl = params.id as string;
  const tournamentId = tournamentIdFromUrl;
  // const teamPlayers = selectedTeam?.members || [];

  // const selectAllPlayers = () => {
  //   if (selectedPlayers.length === teamPlayers.length) {
  //     setSelectedPlayers([]);
  //   } else {
  //     setSelectedPlayers(teamPlayers.map((p) => p.id));
  //   }
  // };
  const selectedPlayers = selectedTeam
    ? selectedPlayersByTeam[selectedTeam.id] || []
    : [];
  const selectAllPlayers = () => {
    if (!selectedTeam) return;

    setSelectedPlayersByTeam((prev) => {
      const current = prev[selectedTeam.id] || [];

      return {
        ...prev,
        [selectedTeam.id]:
          current.length === teamPlayers.length
            ? []
            : teamPlayers.map((p) => p.id),
      };
    });
  };
  const getRoleFromDesignation = (designation: number) => {
    switch (designation) {
      case 1:
        return "CAPTAIN";
      case 2:
        return "PLAYER";
      default:
        return "MEMBER";
    }
  };

  const teamPlayers = (selectedTeam?.members ?? []).map((member) => ({
    id: member.userId,
    userId: member.userId,
    name: member.fullName || member.email,
    fullname: member.fullName,
    email: member.email,
    isSelected: member.isSelected,
    image: "/placeholder.svg",
  }));

  const selectedTournament = tournaments.find(
    (tournament) => tournament.id === tournamentId,
  );

  const togglePlayer = (playerId: string) => {
    if (!selectedTeam) return;

    setSelectedPlayersByTeam((prev) => {
      const current = prev[selectedTeam.id] || [];

      return {
        ...prev,
        [selectedTeam.id]: current.includes(playerId)
          ? current.filter((id) => id !== playerId)
          : [...current, playerId],
      };
    });
  };
  // team tournament id
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoadingTournaments(true);

        const res = await fetch("/api/tournaments");

        const result: {
          status: boolean;
          data: TournamentApi[];
        } = await res.json();

        if (result.status) {
          setTournaments(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch tournaments", err);
      } finally {
        setLoadingTournaments(false);
      }
    };

    fetchTournaments();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      if (!tournamentId) return;

      try {
        const res = await fetch(
          `/api/tournaments/general-teams-selected-members?tournamentId=${tournamentId}`,
        );

        const result: {
          status: boolean;
          message?: string;
          data: ApiTeam[];
        } = await res.json();

        if (!res.ok || !result.status) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: result.message || "Failed to fetch teams",
          });
          return;
        }

        setTeams(result.data || []);

        if (result.data?.length > 0) {
          setSelectedTeam(result.data[0]);

          const alreadySelected = result.data[0].members
            .filter((member) => member.isSelected)
            .map((member) => member.userId);

          // setSelectedPlayers(alreadySelected);
          setSelectedPlayersByTeam({
            [result.data[0].id]: alreadySelected,
          });
        }
      } catch (error) {
        console.error("Failed to fetch teams", error);

        Swal.fire({
          icon: "error",
          title: "Server Error",
          text: error instanceof Error ? error.message : "Something went wrong",
        });
      }
    };

    fetchTeams();
  }, [tournamentId]);

  // const handleConfirmRoster = async () => {
  //   if (!selectedTeam) return;

  //   const payload = {
  //     tournamentId: "", // dynamic later
  //     generalTeamId: selectedTeam.id,
  //     selectedMemberUserIds: teamPlayers
  //       .filter((p) => selectedPlayers.includes(p.id))
  //       .map((p) => p.userId),
  //   };

  //   try {
  //     const res = await fetch("/api/tournaments/register", {
  //       method: "POST",

  //       body: JSON.stringify(payload),
  //     });

  //     const result = await res.json();

  //     if (!res.ok) {
  //       console.error(result);
  //       alert(result.message || "Something went wrong");
  //       return;
  //     }

  //     alert("Tournament registered successfully ✅");
  //   } catch (error) {
  //     console.error("Confirm roster error:", error);
  //     alert("Server error");
  //   }
  // };

  const handleConfirmRoster = async () => {
    if (!selectedTeam) {
      alert("Please select a team");
      return;
    }

    if (!tournamentId) {
      alert("Please select a tournament");
      return;
    }

    const payload = {
      tournamentId, // ✅ dropdown se selected tournamentId
      generalTeamId: selectedTeam.id,
      // selectedMemberUserIds: teamPlayers
      //   .filter((p) => selectedPlayers.includes(p.id))
      //   .map((p) => p.userId),
      selectedMemberUserIds: selectedPlayersByTeam[selectedTeam.id] || [],
    };

    try {
      const res = await fetch("/api/tournaments/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error(result);
        alert(result.message || "Something went wrong");
        return;
      }

      alert("Tournament registered successfully ✅");
    } catch (error) {
      console.error("Confirm roster error:", error);
      alert("Server error");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <TeamSidebar />
      <div className="flex-1 flex flex-col w-full min-w-0">
        <TeamHeader />
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="max-w-8xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Team Tournament
            </h1>

            <p className="text-muted-foreground mb-8">
              Manage your team roster for tournament participation
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Section - Select Team */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border-2 border-border p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-6 h-6 flex items-center justify-center bg-primary/50 text-white rounded-full text-sm font-bold">
                      1
                    </div>
                    <h2 className="text-sm font-bold text-gray/50 uppercase tracking-wide">
                      Select Team
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {teams.map((team) => (
                      <button
                        key={team.id}
                        onClick={() => {
                          setSelectedTeam(team);

                          if (!selectedPlayersByTeam[team.id]) {
                            const teamSelectedPlayers = team.members
                              .filter((member) => member.isSelected)
                              .map((member) => member.userId);

                            setSelectedPlayersByTeam((prev) => ({
                              ...prev,
                              [team.id]: teamSelectedPlayers,
                            }));
                          }
                        }}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          selectedTeam?.id === team.id
                            ? "border-primary/20 bg-primary/10"
                            : "border-border hover:border-primary/20"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-foreground">
                              {team.displayName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {team.members?.length || 0} PLAYERS
                            </p>
                          </div>
                          {selectedTeam?.id === team.id && (
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Section - Manage Roster */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl border-2 border-border p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 flex items-center justify-center bg-primary/50 text-white rounded-full text-sm font-bold">
                        2
                      </div>
                      <h2 className="text-sm font-bold text-grey uppercase tracking-wide">
                        Manage Roster
                      </h2>
                    </div>
                  </div>

                  <div className="mb-8 pb-8 border-b border-border">
                    {selectedTournament && (
                      <div className="mb-6 flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-full overflow-hidden border">
                          <Image
                            src={
                              selectedTournament.imageUrl || "/placeholder.svg"
                            }
                            alt={selectedTournament.name || "Tournament"}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div>
                          <p className="font-bold text-foreground">
                            {selectedTournament.name}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-3xl font-bold text-grey">
                        {selectedTeam?.name}
                      </h3>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={
                            teamPlayers.length > 0 &&
                            selectedPlayers.length === teamPlayers.length
                          }
                          onChange={selectAllPlayers}
                          className="w-5 h-5 rounded border-2 border-border bg"
                        />
                        <span className="text-sm font-semibold text-muted-foreground uppercase">
                          Select All Players
                        </span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {teamPlayers.map((player) => (
                        <button
                          key={player.id}
                          onClick={() => togglePlayer(player.id)}
                          className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                            selectedPlayers.includes(player.id)
                              ? "border-primary/20 bg-grey"
                              : "border-border hover:border-primary/20"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={player.image || "/placeholder.svg"}
                                alt={player.name}
                                fill
                                className="object-cover"
                              />
                            </div> */}
                            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border">
                              <Image
                                src={player.image || "/placeholder.svg"}
                                alt={player.fullname || "Player"}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-foreground truncate">
                                {player.fullname}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                {player.email}
                              </p>
                            </div>
                          </div>

                          {selectedPlayers.includes(player.id) && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground uppercase mb-1">
                        Selected Candidates
                      </p>
                      <p className="text-4xl font-bold text-primary">
                        {selectedPlayers.length}/{teamPlayers.length}
                      </p>
                    </div>

                    <button
                      onClick={handleConfirmRoster}
                      className="px-5 py-3 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700 flex gap-1"
                    >
                      Confirm Roster
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
