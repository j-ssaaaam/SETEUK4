export type SupabaseDraftRow = {
  id: string;
  student_name: string;
  grade: string;
  semester: string;
  results: unknown;
  created_at: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

async function supabaseRequest<T>(path: string, init?: RequestInit): Promise<T> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase 요청 실패 (${response.status})`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function loadRemoteDrafts() {
  return supabaseRequest<SupabaseDraftRow[]>(
    "setukit_drafts?select=id,student_name,grade,semester,results,created_at&order=created_at.desc&limit=30",
  );
}

export function saveRemoteDraft(draft: Omit<SupabaseDraftRow, "created_at">) {
  return supabaseRequest<SupabaseDraftRow[]>("setukit_drafts", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(draft),
  });
}
