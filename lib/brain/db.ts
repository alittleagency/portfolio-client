export interface BrainEntry {
  id: string;
  content: string;
  category: string | null;
  created_at: string;
  user_id: string;
}

// Supabase client not yet configured — returns empty array.
// Replace with real query when Supabase is wired up:
//   const { data } = await supabase
//     .from("brain_entries")
//     .select("id, content, category, created_at, user_id")
//     .eq("user_id", userId)
//     .order("created_at", { ascending: false })
//     .limit(limit);
export async function getRecentBrainEntries(
  _userId: string,
  _limit = 3,
): Promise<BrainEntry[]> {
  return [];
}
