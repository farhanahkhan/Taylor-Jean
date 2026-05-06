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
    const res = await fetch("/api/charter-services");

    if (!res.ok) throw new Error("Failed to fetch");

    const json = await res.json();

    // handle multiple response formats
    if (Array.isArray(json)) return json;
    if (Array.isArray(json.data)) return json.data;

    return [];
  } catch (err) {
    console.error(err);
    return [];
  }
}
