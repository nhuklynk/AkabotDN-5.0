import apiClient from "@/services/apiClient";

export type FaqQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

export type FaqListItem = {
  id: string;
  content: string;
  parent_id?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type ListFaqsResponse = {
  items: FaqListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
};

export async function listFaqs(query: FaqQuery = {}): Promise<ListFaqsResponse> {
  const params = { ...query } as Record<string, any>;
  
  try {
    const res: any = await apiClient.get("/faqs", { params });
  const payload = res?.data ?? res;
  const itemsRaw: any[] = Array.isArray(payload) ? payload : (payload?.items ?? []);

  const items: FaqListItem[] = itemsRaw
    .filter((faq: any) => {
      if (!faq.id) {
        console.error("FAQ missing ID:", faq);
        return false;
      }
      return true;
    })
    .map((faq: any) => {
      console.log("Processing FAQ from API:", faq);
      
      const processedFaq: FaqListItem = {
        id: faq.id,
        content: faq.content,
        parent_id: faq.parent_id || faq.parent?.id || null,
        status: faq.status ?? "active",
        created_at: faq.created_at,
        updated_at: faq.updated_at,
      };
      
      console.log("Processed FAQ:", processedFaq);
      return processedFaq;
    });

    return {
      items,
      total: (payload?.total ?? items.length) as number,
      page: (payload?.page ?? query.page ?? 1) as number,
      limit: (payload?.limit ?? query.limit ?? 10) as number,
      totalPages: payload?.totalPages,
    };
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    throw error;
  }
}

export default listFaqs;
