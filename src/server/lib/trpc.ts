import "server-only";
import { accessHKey } from "@/lib/utils/key";
import { headers } from "next/headers";
import { createTRPCContext } from "../api/trpc";

export const createContext = (token: string, userID: string) => {
	const heads = new Headers(headers());
	heads.set("x-trpc-source", "rsc");
	heads.set(accessHKey, token);

	return createTRPCContext({
		headers: heads,
		user: {
			id: userID,
		},
	});
};
