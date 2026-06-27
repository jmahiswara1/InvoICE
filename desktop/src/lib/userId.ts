// Fixed UUID for local user - used for Supabase sync
// This UUID is generated once and stays consistent
export const LOCAL_USER_UUID = "a0a0a0a0-a0a0-a0a0-a0a0-a0a0a0a0a0a0";

export function getLocalUserId(): string {
  return LOCAL_USER_UUID;
}