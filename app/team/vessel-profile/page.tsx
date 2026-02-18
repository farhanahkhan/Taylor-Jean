"use client";
import { useEffect, useState } from "react";
import { TeamHeader } from "@/app/Components/team-header";
import { TeamSidebar } from "@/app/Components/team-sidebar";
import { Users, X, Zap } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

type Tournament = {
  id: string;
  name: string;
  location: string;
  description: string;
  startDate: string;
  image: string;
  entryOpen: boolean;
  species: Species[];
};

type Species = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean | null;
};

type ApiTournament = {
  id: string;
  name: string;
  place: string;
  tournamentType: string;
  startDate: string;
  endDate: string;
  entryFee: number;
  points: number;
  description: string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  speciesList: Species[];
};

type ApiResponse = {
  message: string;
  statusCode: number;
  status: boolean;
  data: ApiTournament[];
};

type CrewMemberApi = {
  id: string;
  fullName: string | null;
  email: string;
};

type AvailableAngler = {
  id: string;
  name: string;
  email: string;
  initials: string;
};
type CrewMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  initials: string;
};

type UserApi = {
  id: string;
  fullName: string | null;
  email: string;
};
export default function DiscoverEventsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AvailableAngler[]>([]);
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<UserApi[]>([]);

  const params = useParams();
  const teamId = params.teamId as string;

  const handleRegister = (tournament: (typeof tournaments)[0]) => {
    setSelectedTournament(tournament);
  };

  const handleCloseModal = () => {
    setSelectedTournament(null);
  };

  const handleCompleteRegistration = () => {
    // Handle registration logic here
    console.log("Registering for:", selectedTournament?.name);
    setSelectedTournament(null);
  };

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await fetch("/api/tournaments");
        const response: ApiResponse = await res.json();

        if (!res.ok) {
          console.error("Failed to fetch tournaments");
          return;
        }

        const formattedData: Tournament[] = response.data.map(
          (item: ApiTournament) => ({
            id: item.id,
            name: item.name,
            location: item.place,
            description: item.description,
            startDate: item.startDate.split("T")[0],
            image: item.imageUrl ?? "/placeholder.svg",
            entryOpen: item.isActive,
            species: item.speciesList,
          })
        );

        setTournaments(formattedData);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      }
    };

    fetchTournaments();
  }, []);

  // 1️⃣ Fetch all users once
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch(`/api/users?type=users`);
        const result: { status: boolean; data: UserApi[] } = await res.json();
        if (result.status) {
          setAllUsers(result.data);

          // ✅ Initialize searchResults with all users
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

  // Add member
  const handleAddMember = async (angler: AvailableAngler) => {
    if (!selectedTournament) return;

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "add-member",
          teamId: selectedTournament.id, // ✅ FIX
          userId: angler.id,
        }),
      });

      const result: { status: boolean } = await res.json();
    } catch (err) {
      console.error("Failed to add member", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <TeamSidebar />
      <div className="flex-1 flex flex-col w-full min-w-0">
        <TeamHeader />
        <main className="flex-1 p-6 md:p-8">
          <div className="mb-8 flex justify-between">
            <div className="">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Team Profile
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Find and register for upcoming events around the globe.
              </p>
            </div>
            <div className="flex items-center ">
              <Link href="vessel-profile/add-new-team">
                <button className="px-2 bg-dark-navy hover:bg-dark text-white font-semibold py-2.5 rounded-lg transition-colors">
                  Add team Profile
                </button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <div
                key={tournament.id}
                onClick={() => {
                  setSelectedTournament(tournament); // ✅ yahan set hoga
                  setIsAddModalOpen(true);
                }}
                className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={tournament.image || "/placeholder.svg"}
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

                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-foreground">
                      {tournament.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 text-primary mb-3">
                    {/* <Globe className="w-4 h-4" /> */}
                    <span className="text-sm font-medium">
                      {tournament.location}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <div className="bg-gray-100 rounded-md px-5 mb-4">
                      <p>Length</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {tournament.description}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5 text-muted-foreground mb-4 bg-gray-100 rounded-md px-5">
                      <p className="text-black">Engines</p>
                      <span className="text-sm">
                        {tournament.species.length > 0
                          ? tournament.species.map((s) => s.name).join(", ")
                          : "No Species"}
                      </span>
                    </div>
                  </div>

                  <button
                    // onClick={() => handleRegister(tournament)}
                    className="w-full bg-dark-navy hover:bg-dark text-white font-semibold py-2.5 rounded-lg transition-colors"
                  >
                    View and Edit Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {selectedTournament && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Register for {selectedTournament.name}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
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
              onClick={handleCompleteRegistration}
              className="w-full bg-dark-navy hover:bg-dark text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Complete Registration
            </button>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      <Dialog.Root open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden z-50">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                Search & Add Crew Member
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
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
