import { TRPCError } from "@trpc/server";
import { newAccessHKey } from "./key";

export function throwUnauthorizedIfNot<S>(prop: S) {
  if (!prop) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return prop;
}

export async function refreshToken(): Promise<string | null> {
	try {
		const response = await fetch("/api/auth/refresh", {
			method: "POST",
			credentials: "include",
		});
		if (!response.ok) {
			return null;
		}

		const newAccessToken = response.headers.get(newAccessHKey);
		if (!newAccessToken) {
			return null;
		}

		return newAccessToken;
	} catch (error) {
		console.error(error);
		return null;
	}
}
