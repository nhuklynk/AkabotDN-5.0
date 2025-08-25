import { MembersPageClient } from "@/app/(end-user)/members/lists/components/members-page-client";
import { memberService } from "@/services/end-user/memberService";
import { Suspense } from "react";

// Loading component for server-side data fetching
function MemberListLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            DANH SÁCH HỘI VIÊN
          </h1>
          <div className="w-20 h-1 bg-emerald-600"></div>
          <p className="text-gray-600 mt-4">Đang tải danh sách hội viên...</p>
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

// Server component to fetch initial data
async function MemberListContent() {
  try {
    const response = await memberService.getMembers({ page: 1, limit: 20 });

    if (!response.success) {
      throw new Error("Failed to fetch members");
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              DANH SÁCH HỘI VIÊN
            </h1>
            <div className="w-20 h-1 bg-emerald-600"></div>
            <p className="text-gray-600 mt-4">Danh sách hội viên tổ chức</p>
          </div>

          <MembersPageClient initialData={response.data} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching members:", error);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              DANH SÁCH HỘI VIÊN
            </h1>
            <div className="w-20 h-1 bg-emerald-600"></div>
            <p className="text-red-600 mt-4">
              Lỗi khi tải danh sách hội viên. Vui lòng thử lại sau.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default function MemberListPage() {
  return (
    <Suspense fallback={<MemberListLoading />}>
      <MemberListContent />
    </Suspense>
  );
}
