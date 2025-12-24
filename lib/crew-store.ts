// Client-side crew members store using SWR
export type AvailableAngler = (typeof availableAnglers)[0];
let crewMembers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    initials: "JD",
    role: "CAPTAIN",
    status: "Verified",
    avatarColor: "bg-blue-500",
  },
  {
    id: "2",
    name: "Alex Thompson",
    email: "alex.t@angler.com",
    initials: "AT",
    role: "MATE",
    status: "Verified",
    avatarColor: "bg-blue-400",
  },
  {
    id: "3",
    name: "Robert Wilson",
    email: "r.wilson@pro.com",
    initials: "RW",
    role: "ANGLER",
    status: "Verified",
    avatarColor: "bg-blue-600",
  },
];

// Available anglers to add
const availableAnglers = [
  {
    id: "4",
    name: "Sarah Miller",
    email: "sarah.m@angler.com",
    initials: "SM",
    avatarColor: "bg-blue-500",
  },
  {
    id: "5",
    name: "Michael Chen",
    email: "m.chen@angler.com",
    initials: "MC",
    avatarColor: "bg-blue-600",
  },
  {
    id: "6",
    name: "Jessica Davis",
    email: "jess.davis@angler.com",
    initials: "JD",
    avatarColor: "bg-blue-400",
  },
  {
    id: "7",
    name: "Emily Blunt",
    email: "emily.b@sea.com",
    initials: "EB",
    avatarColor: "bg-blue-500",
  },
];

export function getCrewMembers() {
  return crewMembers;
}

export function addCrewMember(
  angler: (typeof availableAnglers)[0],
  role = "ANGLER"
) {
  const newMember = {
    ...angler,
    role,
    status: "Verified",
  };
  crewMembers = [...crewMembers, newMember];
  return crewMembers;
}

export function searchAnglers(query: string) {
  if (!query.trim()) return availableAnglers;

  const lowerQuery = query.toLowerCase();
  return availableAnglers.filter(
    (angler) =>
      angler.name.toLowerCase().includes(lowerQuery) ||
      angler.email.toLowerCase().includes(lowerQuery)
  );
}

export function removeCrewMember(id: string) {
  crewMembers = crewMembers.filter((member) => member.id !== id);
  return crewMembers;
}
