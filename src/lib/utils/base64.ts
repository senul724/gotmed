export function base64URLEncode(input: string): string {
	const base64 = Buffer.from(input, "utf-8").toString("base64");
	return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export function base64URLDecode(input: string): string {
	let base64 = input.replace(/-/g, "+").replace(/_/g, "/");

	const padding = base64.length % 4;
	if (padding) {
		base64 += "=".repeat(4 - padding);
	}

	return Buffer.from(base64, "base64").toString("utf-8");
}
