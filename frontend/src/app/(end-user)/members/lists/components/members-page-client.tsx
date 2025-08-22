"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/pagination-component";
import { Building, User, Phone } from "lucide-react";

interface Member {
  id: number;
  name: string;
  representative: string;
  position: string;
}

interface MembersPageClientProps {
  members: Member[];
}

export function MembersPageClient({ members }: MembersPageClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;
  const itemsPerPage = 20;

  const handlePageChange = (page: number) => {
    console.log("[v0] Page changed to:", page);
    setCurrentPage(page);
    // Add your page change logic here
  };

  return (
    <>
      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Danh sách {members.length} hội viên tổ chức
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-16">
                    STT
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    TÊN TỔ CHỨC
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    NGƯỜI ĐẠI DIỆN
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    CHỨC DANH
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {members.map((member, index) => (
                  <tr
                    key={member.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <Building className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 leading-tight">
                            {member.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {member.representative}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="text-xs">
                        {member.position}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Statistics */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Building className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{members.length}</p>
            <p className="text-sm text-gray-600">Tổ chức thành viên</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">150+</p>
            <p className="text-sm text-gray-600">Cá nhân thành viên</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Phone className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">24/7</p>
            <p className="text-sm text-gray-600">Hỗ trợ thành viên</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
