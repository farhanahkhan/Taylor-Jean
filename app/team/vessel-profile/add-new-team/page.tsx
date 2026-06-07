"use client";

import { useEffect, useState } from "react";

import {
  X,
  Pencil,
  MoreVertical,
  Trash2,
  Check,
  Search,
  Filter,
  Plus,
} from "lucide-react";
import { Suspense } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { TeamSidebar } from "@/app/Components/team-sidebar";
import { TeamHeader } from "@/app/Components/team-header";
import * as Label from "@radix-ui/react-label";
import ImageUploader from "@/app/Components/ImageUploader";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
// import { useRouter } from "next/navigation";

interface ApiTeam {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  isActive: boolean;
  createdDate: string;
  imageUrl: string;
  boatName: string;
}
interface VesselProfile {
  id: string;
  teamName: string;
  vesselName: string;
  vesselBio: string;
  isActive: boolean;
  createdAt: string;
  imageUrl: string;
}
interface TournamentApi {
  id: string;
  name: string;
}
function VesselProfileContent() {
  const [teamName, setTeamName] = useState("");
  const [vesselName, setVesselName] = useState("");
  const [vesselBio, setVesselBio] = useState("");
  const [tournamentId, setTournamentId] = useState("");
  const [length, setLength] = useState("");
  const [engines, setEngines] = useState("");
  const [electronics, setElectronics] = useState<string[]>([]);
  const [newElectronics, setNewElectronics] = useState("");
  const [boatName, setBoatName] = useState("");

  const [profiles, setProfiles] = useState<VesselProfile[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<VesselProfile>>({});

  const [tournaments, setTournaments] = useState<TournamentApi[]>([]);
  const [loadingTournaments, setLoadingTournaments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  useEffect(() => {
    const fetchEditTeam = async () => {
      if (!editId) return;

      const res = await fetch(`/api/team/team-profile/${editId}`);
      const text = await res.text();

      if (!res.ok) {
        console.log("GET edit error:", res.status, text);
        return;
      }

      const result = text ? JSON.parse(text) : null;
      const data = result?.data;

      setTeamName(data.name || "");
      setVesselName(data.displayName || "");
      setVesselBio(data.description || "");
      setLength(String(data.length || ""));
      setEngines(data.engine || "");
      setBoatName(data.boatName || "");
      setElectronics(
        data.gadgets
          ? data.gadgets.split(",").map((x: string) => x.trim())
          : [],
      );
      setUploadedImageUrl(data.imageUrl || "");
      setBannerPreview(data.imageUrl || "");
      setEditingId(data.id);
    };

    fetchEditTeam();
  }, [editId]);

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

  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/team/team-profile");
      const result: { data: ApiTeam | ApiTeam[] } = await res.json();

      const apiData = Array.isArray(result.data) ? result.data : [result.data];

      const mappedProfiles: VesselProfile[] = apiData.map(
        (item: ApiTeam): VesselProfile => ({
          id: item.id,
          teamName: item.name,
          vesselName: item.displayName,
          vesselBio: item.description ?? "",
          isActive: item.isActive,
          createdAt: item.createdDate,
          imageUrl: item.imageUrl,
        }),
      );

      setProfiles(mappedProfiles);
    } catch (error) {
      console.error("Failed to fetch teams", error);
    }
  };

  const handleUpdateProfile = async () => {
    if (isImageUploading) {
      alert("Please wait, image is still uploading.");
      return;
    }

    if (!uploadedImageUrl) {
      alert("Please upload team image first.");
      return;
    }
    if (!teamName || !vesselName) {
      alert("Please fill all required fields!");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      // tournamentId,
      name: teamName,
      displayName: vesselName,
      description: vesselBio,
      length: parseInt(length, 10),
      engine: engines,
      gadgets: electronics.join(", "),
      boatName: boatName,
      imageUrl: uploadedImageUrl,
      isActive: true,
    };

    try {
      const res = await fetch(
        editingId
          ? `/api/team/team-profile/${editingId}`
          : "/api/team/team-profile",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to create team:", data);
        alert(data.message || "Failed to create team");
      } else {
        alert(
          editingId
            ? "Team updated successfully!"
            : "Team created successfully!",
        );
        router.push("/team/vessel-profile");

        // Optionally refresh team list
        fetchTeams();
        // Reset form
        setTeamName("");
        setVesselName("");
        setVesselBio("");
        setLength("50");
        setEngines("Twin V12");
        setElectronics([]);
        setBoatName("");
        setTournamentId("");
        setUploadedImageUrl("");
      }
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeElectronics = (item: string) => {
    setElectronics(electronics.filter((e) => e !== item));
  };

  const addElectronics = () => {
    if (newElectronics.trim()) {
      setElectronics([...electronics, newElectronics.trim()]);
      setNewElectronics("");
    }
  };

  const handleEditRow = (profile: VesselProfile) => {
    setEditingRowId(profile.id);
    setEditForm({
      teamName: profile.teamName,
      vesselName: profile.vesselName,
      vesselBio: profile.vesselBio,
      isActive: profile.isActive,
    });
  };

  const handleSaveEdit = (id: string) => {
    setProfiles(profiles.map((p) => (p.id === id ? { ...p, ...editForm } : p)));
    setEditingRowId(null);
    setEditForm({});
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setEditForm({});
  };

  const handleDelete = (id: string) => {
    setProfiles(profiles.filter((p) => p.id !== id));
  };

  const handleEdit = (profile: VesselProfile) => {
    setTeamName(profile.teamName);
    setVesselName(profile.vesselName);
    setVesselBio(profile.vesselBio);
    setEditingId(profile.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleActive = (id: string) => {
    setProfiles(
      profiles.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)),
    );
  };

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.teamName.toLowerCase().includes(search.toLowerCase()) ||
      profile.vesselName.toLowerCase().includes(search.toLowerCase()),
  );

  // list ki api
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch("/api/team/team-profile");
        const result: { data: ApiTeam | ApiTeam[] } = await res.json();

        const apiData = Array.isArray(result.data)
          ? result.data
          : [result.data];

        const mappedProfiles: VesselProfile[] = apiData.map(
          (item: ApiTeam): VesselProfile => ({
            id: item.id,
            teamName: item.name,
            vesselName: item.displayName,
            vesselBio: item.description ?? "",
            isActive: item.isActive,
            imageUrl: item.imageUrl,
            createdAt: item.createdDate,
          }),
        );

        setProfiles(mappedProfiles);
      } catch (error) {
        console.error("Failed to fetch teams", error);
      }
    };

    fetchTeams();
  }, []);

  return (
    <>
      <div className="flex min-h-screen bg-background">
        <TeamSidebar />

        <div className="flex-1 flex flex-col w-full min-w-0">
          <TeamHeader />

          <main className="flex-1 p-3 sm:p-4 lg:p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Add new Team
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Configure your team and boat for public discovery.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground uppercase tracking-wider">
                    VERIFICATION:
                  </span>
                  <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md">
                    PENDING
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* BASIC INFORMATION - Left Column */}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    BASIC INFORMATION
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Team Name
                        </label>
                        <input
                          type="text"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          placeholder="Enter team name"
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Team Display Name
                        </label>
                        <input
                          type="text"
                          value={vesselName}
                          onChange={(e) => setVesselName(e.target.value)}
                          placeholder="Enter team display name"
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                      </div>
                      {/*
                    <div>
                      <Label
                        htmlFor="tournament-type"
                        className="text-xs font-medium text-slate-500 uppercase mb-2 block"
                      >
                        Tournament ID
                      </Label>

                      <Select
                        value={tournamentId}
                        onValueChange={setTournamentId}
                      >
                        <SelectTrigger className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary">
                          <SelectValue
                            placeholder="Select Tournament Type"
                            className="hover:text-primary/50 text-red-600"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {tournaments.map((tournament) => (
                            <SelectItem
                              key={tournament.id}
                              value={tournament.id}
                              className="hover:text-grey "
                            >
                              {tournament.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div> */}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Team Bio
                      </label>
                      <textarea
                        value={vesselBio}
                        onChange={(e) => setVesselBio(e.target.value)}
                        placeholder="Describe your vessel and capabilities"
                        rows={5}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* TECHNICAL SPECS - Right Column */}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    TECHNICAL SPECS
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Length (ft)
                        </label>
                        <input
                          type="text"
                          value={length}
                          onChange={(e) => setLength(e.target.value)}
                          placeholder="e.g., 50"
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Engines
                        </label>
                        <input
                          type="text"
                          value={engines}
                          onChange={(e) => setEngines(e.target.value)}
                          placeholder="e.g., Twin V12"
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Electronics Package
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {electronics.map((item) => (
                          <span
                            key={item}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 text-sm text-foreground rounded-lg"
                          >
                            {item}
                            <button
                              onClick={() => removeElectronics(item)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newElectronics}
                          onChange={(e) => setNewElectronics(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && addElectronics()
                          }
                          placeholder="e.g., Garmin Pro, FLIR, Sonar"
                          className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                        <button
                          onClick={addElectronics}
                          className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Boat Name
                      </label>
                      <input
                        type="text"
                        value={boatName}
                        onChange={(e) => setBoatName(e.target.value)}
                        placeholder="Enter boat name"
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <Label.Root className="block text-sm font-medium text-gray-700 mb-2">
                    Team Image
                  </Label.Root>

                  <ImageUploader
                    onUploadStart={() => {
                      setIsImageUploading(true);
                      setUploadedImageUrl("");
                      setBannerPreview(null);
                    }}
                    onUploadSuccess={(finalImageUrl) => {
                      setUploadedImageUrl(finalImageUrl);
                      setBannerPreview(finalImageUrl);
                      setIsImageUploading(false);
                    }}
                    onUploadError={() => {
                      setIsImageUploading(false);
                      setUploadedImageUrl("");
                      setBannerPreview(null);
                      alert("Image upload failed. Please try again.");
                    }}
                  />
                  {bannerPreview && (
                    <div className="mt-4 relative w-32 h-32 rounded-lg overflow-hidden border">
                      <Image
                        src={bannerPreview}
                        alt="Product Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 mt-6 border-t border-border">
                <button
                  onClick={handleUpdateProfile}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {isSubmitting
                    ? "Creating..."
                    : editingId
                      ? "Update Profile"
                      : "Create Team"}
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
export default function VesselProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VesselProfileContent />
    </Suspense>
  );
}
