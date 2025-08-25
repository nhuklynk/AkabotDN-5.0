import { classifyContent } from "@/services/admin/classifierService";

function summarize(text: string, maxLen = 160): string {
  const plain = (text || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (plain.length <= maxLen) return plain;
  const cut = plain.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut) + "…";
}

function extractTitleFromContent(text: string, fallback = "Bài viết"): string {
  const plain = (text || "").replace(/<[^>]+>/g, " ").trim();
  if (!plain) return fallback;
  const firstSentence = plain.split(/[.!?]/)[0]?.trim();
  return firstSentence?.slice(0, 80) || fallback;
}

export async function generateSeoSuggestions(params: {
  title?: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
}): Promise<{
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
}> {
  const { title, excerpt, content, featuredImage } = params;
  const metaTitle = (title || extractTitleFromContent(content || "")).trim();
  const metaDescription = summarize(excerpt || content || "");

  let keywords: string[] = [];
  try {
    const cls = await classifyContent(`${title || ""}\n${excerpt || ""}\n${content || ""}`);
    keywords = Array.from(new Set((cls.labels || []).filter(Boolean))).slice(0, 12);
  } catch (_e) {
    keywords = [];
  }

  return {
    metaTitle,
    metaDescription,
    keywords,
    ogTitle: metaTitle,
    ogDescription: metaDescription,
    ogImage: featuredImage,
  };
}


