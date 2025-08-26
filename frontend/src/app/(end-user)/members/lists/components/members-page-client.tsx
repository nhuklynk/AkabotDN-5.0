"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/pagination-component";
import { Building, User, Phone, Search, Loader2 } from "lucide-react";
import { Member } from "@/services/end-user/types/member";
import { memberService } from "@/services/end-user/memberService";
import { useLocale } from "@/hooks/useLocale";

interface MemberData {
  items: Member[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface MembersPageClientProps {
  initialData: MemberData;
}

export function MembersPageClient({ initialData }: MembersPageClientProps) {
  const { t } = useLocale();
  const [memberData, setMemberData] = useState<MemberData>(initialData);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(initialData.page);

  const handlePageChange = async (page: number) => {
    setLoading(true);
    try {
      const response = await memberService.getMembers({
        page,
        limit: memberData.limit,
        search: searchTerm || undefined,
      });

      if (response.success) {
        setMemberData(response.data);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching page:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await memberService.getMembers({
        page: 1,
        limit: memberData.limit,
        search: searchTerm || undefined,
      });

      if (response.success) {
        setMemberData(response.data);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error searching members:", error);
    } finally {
      setLoading(false);
    }
  };

  // Count members by type
  const corporateCount = memberData.items.filter(
    (m) => m.membership_type === "corporate"
  ).length;
  const individualCount = memberData.items.filter(
    (m) => m.membership_type === "individual"
  ).length;
  const studentCount = memberData.items.filter(
    (m) => m.membership_type === "student"
  ).length;

  return (
    <>
      {/* Members Table */}
      <Card className="border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            {t("members.list.tableTitle", {
              total: memberData.total,
              current: memberData.items.length,
            })}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            </div>
          )}

          {!loading && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-0">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-16">
                      {t("members.list.table.headers.index")}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      {t("members.list.table.headers.info")}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      {t("members.list.table.headers.company")}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      {t("members.list.table.headers.memberType")}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      {t("members.list.table.headers.expertise")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {memberData.items.map((member, index) => (
                    <tr
                      key={member.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {(currentPage - 1) * memberData.limit + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <User className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 leading-tight">
                              {member.user?.full_name || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {member.job_title}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {member.work_unit}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-sm text-gray-900">
                              {member.company?.name ||
                                member.work_unit ||
                                t("members.list.defaultCompany")}
                            </span>
                            {member.company?.email && (
                              <p className="text-xs text-gray-500 mt-1">
                                {member.company.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            member.membership_type === "corporate"
                              ? "bg-blue-100 text-blue-800"
                              : member.membership_type === "individual"
                              ? "bg-green-100 text-green-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {member.membership_type === "corporate"
                            ? t("members.list.memberTypes.corporate")
                            : member.membership_type === "individual"
                            ? t("members.list.memberTypes.individual")
                            : t("members.list.memberTypes.student")}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            member.expertise_level === "expert"
                              ? "border-red-300 text-red-700"
                              : member.expertise_level === "advanced"
                              ? "border-orange-300 text-orange-700"
                              : member.expertise_level === "intermediate"
                              ? "border-yellow-300 text-yellow-700"
                              : "border-green-300 text-green-700"
                          }`}
                        >
                          {member.expertise_level === "expert"
                            ? t("members.list.expertiseLevels.expert")
                            : member.expertise_level === "advanced"
                            ? t("members.list.expertiseLevels.advanced")
                            : member.expertise_level === "intermediate"
                            ? t("members.list.expertiseLevels.intermediate")
                            : t("members.list.expertiseLevels.beginner")}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {memberData.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={memberData.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Statistics */}
      <div className="mt-8 grid md:grid-cols-4 gap-6">
        <Card className="hover:bg-white transform hover:-translate-y-2 hover:shadow-2xl transition-all border-0">
          <CardContent className="p-6 text-center">
            <Building className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {memberData.total}
            </p>
            <p className="text-sm text-gray-600">
              {t("members.list.stats.totalMembers")}
            </p>
          </CardContent>
        </Card>
        <Card className="hover:bg-white transform hover:-translate-y-2 hover:shadow-2xl transition-all border-0">
          <CardContent className="p-6 text-center">
            <Building className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{corporateCount}</p>
            <p className="text-sm text-gray-600">
              {t("members.list.stats.organizations")}
            </p>
          </CardContent>
        </Card>
        <Card className="hover:bg-white transform hover:-translate-y-2 hover:shadow-2xl transition-all border-0">
          <CardContent className="p-6 text-center">
            <User className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {individualCount}
            </p>
            <p className="text-sm text-gray-600">
              {t("members.list.stats.individuals")}
            </p>
          </CardContent>
        </Card>
        <Card className="hover:bg-white transform hover:-translate-y-2 hover:shadow-2xl transition-all border-0">
          <CardContent className="p-6 text-center">
            <Phone className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{studentCount}</p>
            <p className="text-sm text-gray-600">
              {t("members.list.stats.students")}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
