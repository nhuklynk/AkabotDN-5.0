import apiClient from "@/services/apiClient";

export type Classification = {
	labels: string[]; // e.g., ["tech", "frontend"]
	confidence?: number[]; // optional per-label confidences
};

// Very basic fallback: infer categories from keywords
const fallbackClassify = (text: string): Classification => {
	const lowered = text.toLowerCase();
	const labels: string[] = [];
	if (/(react|javascript|frontend|node|api)/.test(lowered)) labels.push("technology");
	if (/(design|ui|ux)/.test(lowered)) labels.push("design");
	if (/(mobile|android|ios)/.test(lowered)) labels.push("mobile");
	if (labels.length === 0) labels.push("general");
	return { labels };
};

export async function classifyContent(text: string): Promise<Classification> {
	try {
		const res = await apiClient.post<Classification, Classification>("/admin/classify", { text });
		// Expecting { labels: string[], confidence?: number[] }
		if (Array.isArray(res?.labels)) return res;
		return fallbackClassify(text);
	} catch {
		return fallbackClassify(text);
	}
}


