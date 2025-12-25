export interface Tournament {
  id: string;
  title: string;
  description: string;
  image: string;
  marina: string;
  tournamentType: string;
  startDate: string;
  endDate: string;
  allowableSpecies: string[];
  entryFee: number;
  pointsPerLb: number;
  teamCap: number;
  teams: number;
  status: "ACTIVE" | "UPCOMING" | "COMPLETED";
  createdAt: string;
}

// Initial sample data
const initialTournaments: Tournament[] = [
  {
    id: "1",
    title: "Deep Sea Masters Series #1",
    description:
      "The ultimate test of endurance and skill in the open Atlantic.",
    image: "/golden-gate-bridge-sunset.jpg",
    marina: "Marina Bay",
    tournamentType: "Big Game / Pelagic",
    startDate: "2024-11-12",
    endDate: "2024-11-15",
    allowableSpecies: ["Blue Marlin", "White Marlin", "Sailfish"],
    entryFee: 500,
    pointsPerLb: 10,
    teamCap: 50,
    teams: 24,
    status: "ACTIVE",
    createdAt: "2024-11-01",
  },
  {
    id: "2",
    title: "Deep Sea Masters Series #2",
    description:
      "The ultimate test of endurance and skill in the open Atlantic.",
    image: "/misty-forest-trees.jpg",
    marina: "Ocean Port",
    tournamentType: "Big Game / Pelagic",
    startDate: "2024-11-12",
    endDate: "2024-11-16",
    allowableSpecies: ["Yellowfin Tuna", "Bluefin Tuna", "Mahi Mahi"],
    entryFee: 750,
    pointsPerLb: 15,
    teamCap: 40,
    teams: 24,
    status: "ACTIVE",
    createdAt: "2024-11-02",
  },
  {
    id: "3",
    title: "Deep Sea Masters Series #3",
    description:
      "The ultimate test of endurance and skill in the open Atlantic.",
    image: "/tropical-plants-closeup.jpg",
    marina: "Sunset Marina",
    tournamentType: "Mixed Species",
    startDate: "2024-11-12",
    endDate: "2024-11-14",
    allowableSpecies: ["Wahoo", "Swordfish", "King Mackerel"],
    entryFee: 600,
    pointsPerLb: 12,
    teamCap: 60,
    teams: 24,
    status: "ACTIVE",
    createdAt: "2024-11-03",
  },
];

let tournaments: Tournament[] = [...initialTournaments];

export function getTournaments(): Tournament[] {
  return [...tournaments];
}

export function addTournament(
  tournament: Omit<Tournament, "id" | "teams" | "createdAt">
): Tournament {
  const newTournament: Tournament = {
    ...tournament,
    id: Date.now().toString(),
    teams: 0,
    createdAt: new Date().toISOString().split("T")[0],
  };
  tournaments = [newTournament, ...tournaments];
  return newTournament;
}

export function updateTournament(
  id: string,
  updates: Partial<Tournament>
): void {
  tournaments = tournaments.map((tournament) =>
    tournament.id === id ? { ...tournament, ...updates } : tournament
  );
}

export function deleteTournament(id: string): void {
  tournaments = tournaments.filter((tournament) => tournament.id !== id);
}
