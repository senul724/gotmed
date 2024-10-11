import { cookies } from "next/headers";
import { refreshCookie } from "@/lib/utils/key";
import { refresh } from "@/server/lib/tokens";

export async function POST() {
	try {
		const token = cookies().get(refreshCookie)?.value;
		if (!token) {
			return new Response("UNAUTHORIZED!", {
				status: 401,
			});
		}

		const { token: newAccessToken, status } = await refresh(token);
		if (status !== "success") {
			switch (status) {
				case "unauthorized":
					return new Response("UNAUTHORIZED!", {
						status: 401,
					});
				default:
					return new Response("INTERNAL SERVER ERROR!", {
						status: 500,
					});
			}
		}

		return new Response("Successfully generated!", {
			status: 200,
			headers: {
				X_NEW_ACCESS_TOKEN: newAccessToken,
			},
		});
	} catch (e) {
		console.error(e);
		return new Response(JSON.stringify({ e }), {
			status: 500,
		});
	}
}
