const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type RequestOptions = RequestInit & { accessToken?: string | null };

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return null as T;
  }
  const text = await response.text();
  if (!text) {
    return null as T;
  }
  const parsed = JSON.parse(text);

  // Check if response has standardized format {success: true, data: ...}
  if (parsed && typeof parsed === 'object' && 'success' in parsed && 'data' in parsed) {
    return parsed.data as T;
  }

  return parsed as T;
}

function extractErrorMessage(body: unknown): string {
  if (!body || typeof body !== "object") {
    return "Request failed.";
  }
  const record = body as Record<string, unknown>;
  if (typeof record.retry_after === "number") {
    return `Please wait ${record.retry_after} seconds before requesting a new code.`;
  }
  if (typeof record.error === "object" && record.error !== null) {
    const errorRecord = record.error as Record<string, unknown>;
    if (typeof errorRecord.message === "string") {
      return errorRecord.message;
    }
  }
  if (typeof record.detail === "string") {
    return record.detail;
  }
  const firstField = Object.values(record)[0];
  if (Array.isArray(firstField) && typeof firstField[0] === "string") {
    return firstField[0];
  }
  return "Request failed.";
}

function getLanguageHeader(): string {
  if (typeof window === "undefined") {
    return "en";
  }
  const stored = window.localStorage.getItem("idea-bank-language");
  return stored || "en";
}

export async function publicRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`,
    {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        "Accept-Language": getLanguageHeader(),
        ...(options.headers || {}),
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    const body = await parseResponse<unknown>(response).catch(() => null);
    throw new Error(extractErrorMessage(body));
  }

  return parseResponse<T>(response);
}

export async function authRequest<T>(
  path: string,
  options: RequestOptions,
  refresh: () => Promise<string | null>
): Promise<T> {
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    "Accept-Language": getLanguageHeader(),
    ...((options.headers as Record<string, string>) || {}),
  };
  if (options.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  const doFetch = async (token?: string | null) => {
    const nextHeaders = { ...headers };
    if (token) {
      nextHeaders.Authorization = `Bearer ${token}`;
    }
    return fetch(`${API_URL}${path}`, {
      ...options,
      headers: nextHeaders,
      credentials: "include",
    });
  };

  let response = await doFetch(options.accessToken);
  if (response.status === 401) {
    const newToken = await refresh();
    if (newToken) {
      response = await doFetch(newToken);
    }
  }

  if (!response.ok) {
    const body = await parseResponse<unknown>(response).catch(() => null);
    throw new Error(extractErrorMessage(body));
  }

  return parseResponse<T>(response);
}

export { API_URL };
