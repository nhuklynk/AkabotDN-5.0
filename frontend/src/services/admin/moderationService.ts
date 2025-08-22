import apiClient from "@/services/apiClient";

export type ModerationResult = {
  isSafe: boolean;
  reasons?: string[];
};

export const bannedPatterns: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /\b(nude|porn|xxx|sex|rape)\b/gi, reason: "Nội dung người lớn" },
  { pattern: /\b(hate|racist|nazi)\b/gi, reason: "Ngôn từ thù ghét" },
  { pattern: /\b(knife|kill|suicide)\b/gi, reason: "Bạo lực/nguy hiểm" },
];

const fallbackModerate = (text: string): ModerationResult => {
  const lowered = text.toLowerCase();
  const reasons: string[] = [];
  for (const r of bannedPatterns) {
    if (r.pattern.test(lowered)) reasons.push(r.reason);
  }
  return { isSafe: reasons.length === 0, reasons };
};

export const findBannedWords = (text: string): string[] => {
  if (!text) return [];
  const found = new Set<string>();
  for (const { pattern } of bannedPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      for (const m of matches) {
        const normalized = m.toLowerCase();
        if (normalized) found.add(normalized);
      }
    }
  }
  return Array.from(found);
};

export async function moderateContent(text: string): Promise<ModerationResult> {
  try {
    const res = await apiClient.post<ModerationResult, ModerationResult>(
      "/admin/moderate",
      { text }
    );
    if (typeof res?.isSafe === "boolean") return res;
    return fallbackModerate(text);
  } catch {
    return fallbackModerate(text);
  }
}
