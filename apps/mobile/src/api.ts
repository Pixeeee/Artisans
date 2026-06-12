import { isMobileApiConfigured, mobileEnv } from "./env";

type JsonInit = Omit<RequestInit, "body"> & {
  body?: Record<string, unknown>;
};

export async function artisansApiFetch<TResponse>(
  path: string,
  init: JsonInit = {},
): Promise<TResponse> {
  if (!isMobileApiConfigured) {
    throw new Error("Missing EXPO_PUBLIC_API_BASE_URL for ArtisanS mobile API calls.");
  }

  const response = await fetch(`${mobileEnv.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init.headers,
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `ArtisanS API request failed with ${response.status}`);
  }

  return (await response.json()) as TResponse;
}
