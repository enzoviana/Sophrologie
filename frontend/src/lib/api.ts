// Typed fetch layer over the FastAPI backend. Base is the relative "/api" prefix so the
// same code works in dev (Vite proxies /api → :8001) and behind a single origin in prod.
// In production, VITE_API_BASE_URL should point to the deployed backend.
const BASE = import.meta.env.VITE_API_BASE_URL || "/api";

// Fields are declared, not constructor parameter properties: tsconfig sets
// erasableSyntaxOnly, which rejects `constructor(readonly status: number)`.
export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(`request failed with ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type JsonBody = unknown;

async function request<T>(method: string, path: string, body?: JsonBody): Promise<T> {
  // 🔍 LOG: Avant l'envoi
  if (path.includes("reorder")) {
    console.log("🔍 [API] URL:", `${BASE}${path}`);
    console.log("🔍 [API] Method:", method);
    console.log("🔍 [API] Body avant stringify:", body);
    console.log("🔍 [API] Type du body:", typeof body);
    if (body && typeof body === "object") {
      console.log("🔍 [API] Clés du body:", Object.keys(body));
      console.log("🔍 [API] Body stringifié:", JSON.stringify(body));
    }
  }

  // Auth rides the httpOnly session cookie automatically — never add auth headers here.
  const res = await fetch(`${BASE}${path}`, {
    method,
    credentials: "include",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  // 🔍 LOG: Réponse
  if (path.includes("reorder")) {
    console.log("🔍 [API] Status de réponse:", res.status);
    console.log("🔍 [API] Headers de réponse:", [...res.headers.entries()]);
  }

  // FastAPI reports request-validation failures as 422 with a {detail: [...]} body.
  if (!res.ok) {
    const errBody = await res.json().catch(() => null);

    // 🔍 LOG: Erreur détaillée
    if (path.includes("reorder")) {
      console.error("❌ [API] Erreur:", res.status);
      console.error("❌ [API] Body d'erreur:", errBody);
      console.error("❌ [API] Detail:", errBody?.detail);
    }

    throw new ApiError(res.status, errBody);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// The response type is yours to declare: nothing infers across the Python boundary, so a
// TS interface here mirrors the endpoint's Pydantic model by hand — keep the two in sync.
export const apiGet = <T>(path: string) => request<T>("GET", path);
export const apiPost = <T>(path: string, body?: JsonBody) => request<T>("POST", path, body);
export const apiPut = <T>(path: string, body?: JsonBody) => request<T>("PUT", path, body);
export const apiPatch = <T>(path: string, body?: JsonBody) => request<T>("PATCH", path, body);
export const apiDelete = <T>(path: string) => request<T>("DELETE", path);

// Helper to get the full API URL for use in fetch calls outside of the request function
export const getApiUrl = (path: string) => `${BASE}${path}`;