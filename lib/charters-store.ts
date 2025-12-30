// lib/charters-store.ts
export interface Charter {
  id: string;
  charterName: string;
  description: string;
  baseAmount: number;
  categoryId: string;
  imageUrl: string;
  isActive: boolean;
}

// Fetch charters from API
export async function fetchCharters(): Promise<Charter[]> {
  try {
    const res = await fetch("/api/charter-services"); // Next.js API route
    const json = await res.json();
    if (json.status) {
      return json.data; // array of charters
    }
    return [];
  } catch (err) {
    console.error(err);
    return [];
  }
}
