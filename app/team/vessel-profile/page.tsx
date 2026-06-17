"use client";

import { useEffect, useRef, useState } from "react";
import { TeamHeader } from "@/app/Components/team-header";
import { TeamSidebar } from "@/app/Components/team-sidebar";
import { MoreVertical, Pencil, Trash2, Users, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";

type CrewMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  initials: string;
};

// type Tournament = {
//   id: string;
//   name: string;
//   location: string;
//   description: string;
//   startDate: string;
//   imageUrl: string;
//   entryOpen: boolean;
//   species: [];
// };
type ApiTeamMember = {
  id: string;
  userId: string;
  designation: string | null;
  user: {
    id: string;
    displayName: string | null;
    email: string;
    fullName: string | null;
  };
};
type ApiTeam = {
  id: string;
  name: string;
  displayName: string;
  description: string;
  imageUrl: string | null;
  members: ApiTeamMember[];
};

type Tournament = {
  id: string;
  name: string;
  location: string;
  description: string;
  startDate: string;
  imageUrl: string;
  entryOpen: boolean;
  species: [];
  members: ApiTeamMember[];
};

// type ApiTeam = {
//   id: string;
//   name: string;
//   displayName: string;
//   description: string;
//   imageUrl: string | null;
// };

type ApiResponse = {
  status: boolean;
  data: ApiTeam[];
};

type AvailableAngler = {
  id: string;
  name: string;
  email: string;
  initials: string;
};

type UserApi = {
  id: string;
  fullName: string | null;
  email: string;
};

export default function DiscoverEventsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AvailableAngler[]>([]);
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<UserApi[]>([]);
  // const [addedMembers, setAddedMembers] = useState<CrewMember[]>([]);
  const [addedMembers, setAddedMembers] = useState<CrewMember[]>(() => {
    if (typeof window === "undefined") return [];

    const savedTeamId = localStorage.getItem("selectedTeamId");
    if (!savedTeamId) return [];

    const savedMembers = localStorage.getItem(`team-members-${savedTeamId}`);
    if (!savedMembers) return [];

    try {
      const parsedMembers = JSON.parse(savedMembers);
      return Array.isArray(parsedMembers)
        ? (parsedMembers as CrewMember[])
        : [];
    } catch {
      return [];
    }
  });

  const router = useRouter();
  const addedMembersRef = useRef<HTMLDivElement | null>(null);

  const loadMembersFromStorage = (teamId: string) => {
    const savedMembers = localStorage.getItem(`team-members-${teamId}`);

    if (!savedMembers) {
      setAddedMembers([]);
      return;
    }

    try {
      const parsedMembers = JSON.parse(savedMembers);

      if (Array.isArray(parsedMembers)) {
        setAddedMembers(parsedMembers as CrewMember[]);
      } else {
        setAddedMembers([]);
      }
    } catch {
      setAddedMembers([]);
    }
  };

  const handleAddMember = async (angler: AvailableAngler) => {
    if (!selectedTournament) return;

    try {
      const res = await apiFetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "add-member",
          generalTeamId: selectedTournament.id,
          generalTeamName: selectedTournament.name,
          userId: angler.id,
        }),
      });

      const data = await res.json();

      if (!data.status) {
        alert(data.message || "Member not added");
        return;
      }

      const newMember: CrewMember = {
        id: angler.id,
        name: angler.name,
        email: angler.email,
        role: "ANGLER",
        status: "Active",
        initials: angler.initials,
      };

      setAddedMembers((prev) => {
        const exists = prev.some((m) => m.id === angler.id);
        if (exists) return prev;

        const updated = [...prev, newMember];

        localStorage.setItem(
          `team-members-${selectedTournament.id}`,
          JSON.stringify(updated),
        );

        localStorage.setItem("selectedTeamId", selectedTournament.id);

        return updated;
      });

      setTimeout(() => {
        addedMembersRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    } catch (err) {
      console.error("Failed to add member", err);
    }
  };

  const handleDeleteMember = async (memberUserId: string) => {
    const teamId =
      selectedTournament?.id || localStorage.getItem("selectedTeamId");

    if (!teamId) {
      console.error("No team selected");
      return;
    }

    try {
      const res = await fetch(
        `/api/general-teams/members?generalTeamId=${teamId}&memberUserId=${memberUserId}`,
        {
          method: "DELETE",
        },
      );

      const result = await res.json();

      if (
        !res.ok ||
        !result.status ||
        result.message === "Captain cannot be removed"
      ) {
        alert(result.message || "Failed to delete member");
        return;
      }

      setAddedMembers((prev) => {
        const updated = prev.filter((member) => member.id !== memberUserId);

        localStorage.setItem(`team-members-${teamId}`, JSON.stringify(updated));

        return updated;
      });
      alert(result.message || "Member deleted successfully");
    } catch (err) {
      console.error("Failed to delete member", err);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await apiFetch("/api/team/team-profile");
        const response: ApiResponse = await res.json();

        const formattedData: Tournament[] = response.data.map((item) => ({
          id: item.id,
          name: item.name,
          location: item.displayName || "",
          description: item.description || "",
          startDate: "",
          imageUrl: item.imageUrl || "",
          entryOpen: false,
          species: [],
          members: item.members || [],
        }));

        setTournaments(formattedData);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTournaments();
  }, []);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await apiFetch(`/api/users?type=users`);
        const result: { status: boolean; data: UserApi[] } = await res.json();

        if (result.status) {
          setAllUsers(result.data);

          const initialResults = result.data.map((user) => ({
            id: user.id,
            name: user.fullName ?? user.email,
            email: user.email,
            initials: user.fullName
              ? user.fullName.slice(0, 2).toUpperCase()
              : user.email.slice(0, 2).toUpperCase(),
          }));

          setSearchResults(initialResults);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchAllUsers();
  }, []);

  useEffect(() => {
    const filtered = allUsers
      .filter((user) =>
        (user.fullName ?? user.email)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      )
      .map((user) => ({
        id: user.id,
        name: user.fullName ?? user.email,
        email: user.email,
        initials: user.fullName
          ? user.fullName.slice(0, 2).toUpperCase()
          : user.email.slice(0, 2).toUpperCase(),
      }));

    // setSearchResults(filtered);
  }, [searchQuery, allUsers]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team?")) return;

    try {
      const res = await apiFetch(`/api/team/team-profile/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.data === null) {
        alert(data.message);
        return;
      }

      setTournaments((prev) => prev.filter((item) => item.id !== id));
      alert(data.message || "Deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const handleEditClick = (team: Tournament) => {
    router.push(`/team/vessel-profile/add-new-team?id=${team.id}`);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <TeamSidebar />

      <div className="flex-1 flex flex-col w-full min-w-0">
        <TeamHeader />

        <main className="flex-1 p-6 md:p-8">
          <div className="mb-8 flex justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Team Profile
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Find and register for upcoming events around the globe.
              </p>
            </div>

            <Link href="vessel-profile/add-new-team">
              <button className="px-2 bg-dark-navy hover:bg-dark text-white font-semibold py-2.5 rounded-lg transition-colors">
                Add team Profile
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={tournament.imageUrl || "/placeholder.svg"}
                    alt={tournament.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-foreground">
                    {tournament.name}
                  </h3>

                  <div className="flex justify-end p-3">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Content
                        align="end"
                        className="bg-white border rounded-lg shadow-lg p-1 z-50 min-w-[140px]"
                      >
                        <DropdownMenu.Item
                          onClick={() => handleEditClick(tournament)}
                          className="px-3 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer outline-none"
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                          onClick={() => handleDelete(tournament.id)}
                          className="px-3 py-2 flex items-center gap-2 hover:bg-red-50 text-red-600 cursor-pointer outline-none"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </div>

                  <div className="text-sm text-primary mb-3">
                    {tournament.location}
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {tournament.description}
                  </p>

                  <button
                    // onClick={(e) => {
                    //   e.stopPropagation();

                    //   setSelectedTournament(tournament);
                    //   localStorage.setItem("selectedTeamId", tournament.id);

                    //   loadMembersFromStorage(tournament.id);

                    //   setIsAddModalOpen(true);
                    // }}

                    onClick={(e) => {
                      e.stopPropagation();

                      setSelectedTournament(tournament);
                      localStorage.setItem("selectedTeamId", tournament.id);

                      const apiMembers: CrewMember[] = tournament.members.map(
                        (member) => {
                          const name =
                            member.user.fullName ||
                            member.user.displayName ||
                            member.user.email;

                          return {
                            id: member.userId,
                            name,
                            email: member.user.email,
                            role: member.designation || "ANGLER",
                            status: "Active",
                            initials: name.slice(0, 2).toUpperCase(),
                          };
                        },
                      );

                      setAddedMembers(apiMembers);
                      setIsAddModalOpen(true);
                    }}
                    className="w-full mt-4 bg-dark-navy hover:bg-dark text-white font-semibold py-2.5 rounded-lg transition-colors"
                  >
                    Add Member
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <Dialog.Root open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />

          <Dialog.Content className="fixed inset-x-4 top-4 bottom-4 mx-auto bg-white rounded-xl shadow-xl w-auto max-w-2xl overflow-y-auto z-50">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                Search & Add Crew Member
              </Dialog.Title>

              <Dialog.Close className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </Dialog.Close>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Find Registered Anglers
                </label>

                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    type="text"
                    placeholder="Start typing a name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Select a user to add ({searchResults.length} results)
                </label>

                <div className="border border-gray-200 rounded-lg overflow-hidden max-h-[210px] overflow-y-auto">
                  {searchResults.map((angler) => {
                    const isAdded = addedMembers.some(
                      (member) => member.id === angler.id,
                    );

                    return (
                      <div
                        key={angler.id}
                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-primary bg-primary/10 font-semibold text-sm">
                            {angler.initials}
                          </div>

                          <div>
                            <div className="font-semibold text-gray-900">
                              {angler.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {angler.email}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddMember(angler)}
                          disabled={isAdded}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            isAdded
                              ? "bg-green-100 text-green-700 cursor-not-allowed"
                              : "bg-dark-navy text-white hover:bg-dark"
                          }`}
                        >
                          {isAdded ? "Added" : "Add to Team"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <p className="text-sm text-gray-500 text-center">
                Users added here are instantly registered as active crew for
                your vessel.
              </p>
            </div>

            {addedMembers.length > 0 && (
              <div
                ref={addedMembersRef}
                className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mx-5 mb-2"
              >
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Added Team Members
                  </h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {addedMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary font-semibold text-sm">
                          {member.initials}
                        </div>

                        <div>
                          <div className="font-semibold text-gray-900">
                            {member.name}
                          </div>

                          <div className="text-sm text-gray-500">
                            {member.email}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
