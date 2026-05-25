"use client";
import { useEffect, useState } from "react";
import { TeamHeader } from "@/app/Components/team-header";
import { TeamSidebar } from "@/app/Components/team-sidebar";
import { MoreVertical, Pencil, Trash2, Users, X, Zap } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

/* ---------------- TYPES ---------------- */

type CrewMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  initials: string;
};

type Tournament = {
  id: string;
  name: string;
  location: string;
  description: string;
  startDate: string;
  imageUrl: string;
  entryOpen: boolean;
  species: Species[];
};

type Species = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean | null;
};

type ApiTeam = {
  id: string;
  name: string;
  displayName: string;
  description: string;
  length: number;
  engine: string;
  gadgets: string;
  imageUrl: string | null;
  isActive: boolean;
};

type ApiResponse = {
  message: string;
  statusCode: number;
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
type MemberApi = {
  id: string;
  fullName: string | null;
  email: string;
};

type MemberResponse = {
  status: boolean;
  data: MemberApi[];
};
/* ---------------- COMPONENT ---------------- */

export default function DiscoverEventsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AvailableAngler[]>([]);
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<UserApi[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Tournament | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const params = useParams();
  const teamId = params.teamId as string;
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState<AvailableAngler[]>([]);
  const [addedMembers, setAddedMembers] = useState<CrewMember[]>([]);

  /* ---------------- FETCH TEAMS ---------------- */

  // const handleAddMember = async (angler: AvailableAngler) => {
  //   if (!selectedTournament) return;

  //   try {
  //     await fetch("/api/users", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         type: "add-member",
  //         generalTeamId: selectedTournament.id,
  //         generalTeamName: angler.name,
  //         userId: angler.id,
  //       }),
  //     });

  //     // Already added check
  //     const alreadyExist = teamMembers.find(
  //       (member) => member.id === angler.id,
  //     );

  //     if (!alreadyExist) {
  //       setTeamMembers((prev) => [...prev, angler]);
  //     }
  //   } catch (err) {
  //     console.error("Failed to add member", err);
  //   }
  // };

  const handleAddMember = async (angler: AvailableAngler) => {
    if (!selectedTournament) return;

    try {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "add-member",
          generalTeamId: selectedTournament.id,
          generalTeamName: selectedTournament.name,
          userId: angler.id,
        }),
      });

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
        return [...prev, newMember];
      });
    } catch (err) {
      console.error("Failed to add member", err);
    }
  };
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await fetch("/api/team/team-profile");
        const response: ApiResponse = await res.json();

        if (!res.ok) {
          console.error("Failed to fetch teams");
          return;
        }

        const formattedData: Tournament[] = response.data.map(
          (item: ApiTeam) => ({
            id: item.id,
            name: item.name,
            location: item.displayName || "",
            description: item.description || "",
            startDate: "",
            // imageUrl: "/team.svg", // ✅ SVG instead of API image
            imageUrl: item.imageUrl || "",
            entryOpen: false,
            species: [],
          }),
        );

        setTournaments(formattedData);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTournaments();
  }, []);

  /* ---------------- FETCH USERS ---------------- */

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch(`/api/users?type=users`);
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

  /* ---------------- ADD MEMBER ---------------- */

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this tournament?",
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/team/team-profile/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Delete failed");
        return;
      }
      alert("Tournament deleted successfully");
      // fetchTournaments();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const handleEditClick = (team: Tournament) => {
    setIsEditMode(true);
    setEditForm(team);
  };

  const handleEdit = async () => {
    if (!editForm) return;

    try {
      const payload = {
        name: editForm.name,
        displayName: editForm.location,
        description: editForm.description,
        startDate: editForm.startDate,
        imageUrl: editForm.imageUrl,
      };

      const res = await fetch(`/api/team/team-profile/${editForm.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Update failed");
        return;
      }

      alert("Team updated successfully");

      setIsEditModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    const fetchTeam = async () => {
      const res = await fetch(`/api/team/team-profile/${teamId}`);
      const result = await res.json();

      if (result.status) {
        setTeamName(result.data.name); // ✅ REAL TEAM NAME
      }
    };

    if (teamId) fetchTeam();
  }, [teamId]);

  // const handleRemoveMember = async (id: string) => {
  //   if (!selectedTournament) return;

  //   try {
  //     const res = await fetch(
  //       `/api/general-teams/member?generalTeamId=${selectedTournament.id}&memberUserId=${id}`,
  //       {
  //         method: "DELETE",
  //       },
  //     );

  //     const data = await res.json();
  //     console.log(data);

  //     if (data.status === false) {
  //       alert(data.message);
  //       return;
  //     }

  //     setTeamMembers((prev) => prev.filter((member) => member.id !== id));
  //   } catch (err) {
  //     console.error("Failed to remove member", err);
  //   }
  // };

  const handleDeleteMember = async (memberUserId: string) => {
    if (!selectedTournament?.id) {
      console.error("No tournament selected");
      return;
    }

    try {
      const res = await fetch(
        `/api/general-teams/member?generalTeamId=${selectedTournament.id}&memberUserId=${memberUserId}`,
        {
          method: "DELETE",
        },
      );

      const result = await res.json();

      if (result.status) {
        setAddedMembers((prev) =>
          prev.filter((member) => member.id !== memberUserId),
        );
      }
    } catch (err) {
      console.error("Failed to delete member", err);
    }
  };

  useEffect(() => {
    const fetchMembers = async () => {
      if (!teamId) return;

      try {
        const res = await fetch(
          `/api/general-teams/member?generalTeamId=${teamId}`,
        );

        const result: MemberResponse = await res.json();

        if (result.status) {
          const formatted = result.data.map((item) => ({
            id: item.id,
            name: item.fullName ?? item.email,
            email: item.email,
            role: "ANGLER",
            status: "Active",
            initials: item.fullName
              ? item.fullName.slice(0, 2).toUpperCase()
              : item.email.slice(0, 2).toUpperCase(),
          }));

          setAddedMembers(formatted);
        }
      } catch (err) {
        console.error("Failed to load members", err);
      }
    };

    fetchMembers();
  }, [teamId]);
  return (
    <div className="flex min-h-screen bg-background">
      <TeamSidebar />

      <div className="flex-1 flex flex-col w-full min-w-0">
        <TeamHeader />

        <main className="flex-1 p-6 md:p-8">
          {/* HEADER */}
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

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <div
                key={tournament.id}
                onClick={() => {
                  setSelectedTournament(tournament);
                  setIsAddModalOpen(true);
                }}
                className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* IMAGE */}
                <div className="relative h-48 w-full">
                  <Image
                    src={tournament.imageUrl || "/placeholder.svg"}
                    alt={tournament.name}
                    fill
                    className="object-cover"
                  />
                  {tournament.entryOpen && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded">
                        ENTRY OPEN
                      </span>
                    </div>
                  )}
                </div>

                {/* BODY */}
                <div className="p-5">
                  <div className="">
                    <h3 className="text-lg font-bold text-foreground">
                      {tournament.name}
                    </h3>
                    <div className="flex justify-end p-3">
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Content
                          align="end"
                          className="bg-white border rounded-lg shadow-lg p-1 z-50 min-w-[140px]"
                        >
                          <DropdownMenu.Item
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(tournament);
                            }}
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
                  </div>

                  <div className="text-sm text-primary mb-3">
                    {tournament.location}
                  </div>

                  <div className=" rounded-md pr-5 mb-4">
                    {/* <p>Description</p> */}
                    <p className="text-sm text-muted-foreground mb-4">
                      {tournament.description}
                    </p>
                  </div>

                  <button className="w-full mt-4 bg-dark-navy hover:bg-dark text-white font-semibold py-2.5 rounded-lg transition-colors">
                    View and Edit Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* MODAL */}
      {/* {selectedTournament && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Register for {selectedTournament.name}
              </h2>
              <button onClick={() => setSelectedTournament(null)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-0.5">
                    Active Team
                  </p>
                  <p className="text-base font-bold text-gray-900">
                    Sea Serpent II
                  </p>
                </div>
              </div>
            </div>

            <button
              // onClick={handleCompleteRegistration}
              className="w-full bg-dark-navy hover:bg-dark text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Complete Registration
            </button>
          </div>
        </div>
      )} */}

      <Dialog.Root open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />

          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl w-[500px] z-50">
            <Dialog.Title className="text-xl font-bold mb-4">
              Edit Team
            </Dialog.Title>

            {editForm && (
              <div className="space-y-3">
                <input
                  className="w-full border p-2 rounded"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  placeholder="Name"
                />

                <input
                  className="w-full border p-2 rounded"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                  placeholder="Location"
                />

                <input
                  className="w-full border p-2 rounded"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  placeholder="Description"
                />

                <button
                  onClick={handleEdit}
                  className="bg-green-600 text-white px-4 py-2 rounded w-full"
                >
                  Save Changes
                </button>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Dialog.Root open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden z-50">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                {isEditMode ? "Edit Team Profile" : "Search & Add Crew Member"}
              </Dialog.Title>
              <Dialog.Close className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </Dialog.Close>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Search Section */}
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

              {/* Results Section */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Select a user to add ({searchResults.length} results)
                </label>
                <div className="border border-gray-200 rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
                  {searchResults.map((angler) => (
                    <div
                      key={angler.id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10  rounded-full flex items-center justify-center text-primary bg-primary/10 font-semibold text-sm">
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
                        className="px-4 py-2 bg-dark-navy text-white hover:bg-dark text-sm font-medium rounded-lg transition-colors"
                      >
                        Add to Team
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Text */}
              <p className="text-sm text-gray-500 text-center">
                Users added here are instantly registered as active crew for
                your vessel.
              </p>
            </div>

            {/* Added Team Members Grid */}
            {/* {teamMembers.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Added Team Members
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="border border-gray-200 rounded-xl p-4 flex items-center justify-between bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                          {member.initials}
                        </div>

                        <div>
                          <p className="font-medium text-gray-900">
                            {member.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            {member.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm">
                          Added
                        </button>

                        <button
                          // onClick={() => handleRemoveMember(member.id)}
                          onClick={() => handleDeleteMember(member.id)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}

            {/* Added Members Grid */}
            {addedMembers.length > 0 && (
              <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
