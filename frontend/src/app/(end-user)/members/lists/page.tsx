"use client";
import { MembersPageClient } from "@/app/(end-user)/members/lists/components/members-page-client";
import { memberService } from "@/services/end-user/memberService";
import { useEffect, useState } from "react";
import { useLocale } from "@/hooks/useLocale";

// Loading component
function MemberListLoading({ t }: { t: (key: string) => string }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("members.list.title")}
          </h1>
          <div className="w-20 h-1 bg-emerald-600"></div>
          <p className="text-gray-600 mt-4">{t("members.list.loading")}</p>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Client component to fetch data and display content
function MemberListContent() {
  const { t } = useLocale();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await memberService.getMembers({ page: 1, limit: 20 });

        if (!response.success) {
          throw new Error("Failed to fetch members");
        }

        setData(response.data);
      } catch (err) {
        console.error("Error fetching members:", err);
        setError(t("members.list.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [t]);

  if (loading) {
    return <MemberListLoading t={t} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0600AF]/90 mb-2">
              {t("members.list.title")}
            </h1>

            <p className="text-red-600 mt-4">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0600AF]/90 mb-2">
            {t("members.list.title")}
          </h1>
          <p className="text-[#0600AF]/90 mt-4">{t("members.list.subtitle")}</p>
        </div>

        <MembersPageClient initialData={data} />
      </div>
    </div>
  );
}

export default function MemberListPage() {
  return <MemberListContent />;
}
