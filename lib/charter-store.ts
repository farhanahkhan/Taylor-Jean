export interface Charter {
  id: string;
  fullName: string;
  email: string;
  charterDate: string;
  charterType: string;
  amount: number;
  createdAt: string;
}

// Initial sample data
const initialCharters: Charter[] = [
  {
    id: "1",
    fullName: "John Smith",
    email: "john@example.com",
    charterDate: "2024-01-20",
    charterType: "Private Charter",
    amount: 1500,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    fullName: "Sarah Johnson",
    email: "sarah@example.com",
    charterDate: "2024-02-10",
    charterType: "Tournament Charter",
    amount: 2500,
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    fullName: "Mike Davis",
    email: "mike@example.com",
    charterDate: "2024-01-25",
    charterType: "Shared Charter",
    amount: 800,
    createdAt: "2024-01-18",
  },
];

let charters: Charter[] = [...initialCharters];

export function getCharters(): Charter[] {
  return [...charters];
}

export function addCharter(
  charter: Omit<Charter, "id" | "createdAt">
): Charter {
  const newCharter: Charter = {
    ...charter,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split("T")[0],
  };
  charters = [newCharter, ...charters];
  return newCharter;
}

export function updateCharter(id: string, updates: Partial<Charter>): void {
  charters = charters.map((charter) =>
    charter.id === id ? { ...charter, ...updates } : charter
  );
}

export function deleteCharter(id: string): void {
  charters = charters.filter((charter) => charter.id !== id);
}
