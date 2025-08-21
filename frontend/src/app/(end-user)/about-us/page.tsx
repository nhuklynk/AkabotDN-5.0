"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Target,
  Heart,
  History,
  FileText,
  Download,
} from "lucide-react";
import Image from "next/image";

const menuItems = [
  { id: "about", label: "Về NDA", icon: Target },
  { id: "executive", label: "Ban Chấp hành", icon: Users },
  { id: "standing", label: "Ban Thường vụ", icon: Users },
  { id: "charter", label: "Điều lệ NDA", icon: FileText },
];

export default function GioiThieuPage() {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-emerald-900 mb-4">
              Giới thiệu Hiệp hội Dữ liệu Quốc gia Việt Nam
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Tìm hiểu về sứ mệnh, tầm nhìn và cơ cấu tổ chức của Hiệp hội Dữ
              liệu Quốc gia Việt Nam
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "outline"}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-6 py-3 ${
                  activeTab === item.id
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            );
          })}
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Về NDA Section */}
          {activeTab === "about" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Mission & Vision */}
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-emerald-200 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-emerald-900">
                        Sứ mệnh
                      </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Kết nối các cơ quan quản lý, doanh nghiệp, tổ chức trong
                      lĩnh vực dữ liệu và khoa học công nghệ. Xây dựng các hoạt
                      động thiết thực nhằm lan tỏa tri thức, kết nối cộng đồng,
                      thúc đẩy phát triển hệ sinh thái dữ liệu Việt Nam trong kỷ
                      nguyên số.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-emerald-200 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-emerald-900">
                        Tầm nhìn
                      </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Trở thành tổ chức hàng đầu trong việc kiến thiết hệ sinh
                      thái dữ liệu Việt Nam, góp phần xây dựng nền kinh tế số
                      phát triển bền vững và nâng cao năng lực cạnh tranh quốc
                      gia trong thời đại công nghệ 4.0.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Core Values */}
              <Card className="border-emerald-200 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-900">
                      Giá trị cốt lõi
                    </h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-emerald-50 rounded-lg">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-emerald-600">
                          1
                        </span>
                      </div>
                      <h4 className="font-semibold text-emerald-900 mb-2">
                        Minh bạch
                      </h4>
                      <p className="text-sm text-gray-600">
                        Đảm bảo tính minh bạch trong mọi hoạt động và quy trình
                        xử lý dữ liệu
                      </p>
                    </div>
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-blue-600">
                          2
                        </span>
                      </div>
                      <h4 className="font-semibold text-emerald-900 mb-2">
                        Đổi mới
                      </h4>
                      <p className="text-sm text-gray-600">
                        Tiên phong trong việc ứng dụng công nghệ và phương pháp
                        mới
                      </p>
                    </div>
                    <div className="text-center p-6 bg-purple-50 rounded-lg">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-purple-600">
                          3
                        </span>
                      </div>
                      <h4 className="font-semibold text-emerald-900 mb-2">
                        Hợp tác
                      </h4>
                      <p className="text-sm text-gray-600">
                        Xây dựng mối quan hệ đối tác bền vững và hiệu quả
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Formation History */}
              <Card className="border-emerald-200 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <History className="w-6 h-6 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-900">
                      Lịch sử hình thành
                    </h3>
                  </div>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <Badge className="bg-emerald-100 text-emerald-800 px-3 py-1">
                          2024
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-900 mb-2">
                          Thành lập Hiệp hội
                        </h4>
                        <p className="text-gray-700">
                          Hiệp hội Dữ liệu Quốc gia Việt Nam được thành lập với
                          sự tham gia của các cơ quan, tổ chức hàng đầu trong
                          lĩnh vực dữ liệu và công nghệ thông tin.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                          2025
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-900 mb-2">
                          Mở rộng hoạt động
                        </h4>
                        <p className="text-gray-700">
                          Triển khai các chương trình hợp tác quốc tế, xây dựng
                          các sản phẩm dữ liệu tiên phong và tổ chức các sự kiện
                          chuyên ngành quy mô lớn.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Ban Chấp hành Section */}
          {activeTab === "executive" && (
            <div className="animate-in fade-in duration-500">
              <Card className="border-emerald-200 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-emerald-900 mb-6 text-center">
                    Sơ đồ tổ chức Ban Chấp hành
                  </h3>
                  <div className="bg-gradient-to-br from-emerald-50 to-blue-50 p-8 rounded-lg">
                    <div className="text-center space-y-8">
                      {/* Chủ tịch */}
                      <div className="flex justify-center">
                        <div className="bg-emerald-600 text-white px-6 py-4 rounded-lg shadow-lg">
                          <div className="font-bold text-lg">
                            CHỦ TỊCH HIỆP HỘI
                          </div>
                          <div className="text-sm opacity-90">
                            Trung tướng Nguyễn Văn Long
                          </div>
                        </div>
                      </div>

                      {/* Phó Chủ tịch */}
                      <div className="flex justify-center gap-8">
                        <div className="bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg">
                          <div className="font-bold">PHÓ CHỦ TỊCH</div>
                          <div className="text-sm opacity-90">Thường trực</div>
                        </div>
                        <div className="bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg">
                          <div className="font-bold">PHÓ CHỦ TỊCH</div>
                          <div className="text-sm opacity-90">Kiêm nhiệm</div>
                        </div>
                      </div>

                      {/* Các ban chuyên môn */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-purple-500 text-white px-4 py-3 rounded-lg shadow">
                          <div className="font-semibold">Ban Nghiên cứu</div>
                          <div className="text-sm opacity-90">& Phát triển</div>
                        </div>
                        <div className="bg-purple-500 text-white px-4 py-3 rounded-lg shadow">
                          <div className="font-semibold">Ban Hợp tác</div>
                          <div className="text-sm opacity-90">Quốc tế</div>
                        </div>
                        <div className="bg-purple-500 text-white px-4 py-3 rounded-lg shadow">
                          <div className="font-semibold">Ban Truyền thông</div>
                          <div className="text-sm opacity-90">& Sự kiện</div>
                        </div>
                      </div>

                      {/* Văn phòng */}
                      <div className="flex justify-center">
                        <div className="bg-gray-600 text-white px-6 py-4 rounded-lg shadow-lg">
                          <div className="font-bold">VĂN PHÒNG HIỆP HỘI</div>
                          <div className="text-sm opacity-90">
                            Điều hành hoạt động hàng ngày
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Ban Thường vụ Section */}
          {activeTab === "standing" && (
            <div className="animate-in fade-in duration-500">
              <Card className="border-emerald-200 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-emerald-900 mb-6 text-center">
                    Sơ đồ tổ chức Ban Thường vụ
                  </h3>
                  <div className="bg-gradient-to-br from-blue-50 to-emerald-50 p-8 rounded-lg">
                    <div className="text-center space-y-6">
                      {/* Trưởng ban */}
                      <div className="flex justify-center">
                        <div className="bg-emerald-700 text-white px-8 py-4 rounded-lg shadow-lg">
                          <div className="font-bold text-lg">
                            TRƯỞNG BAN THƯỜNG VỤ
                          </div>
                          <div className="text-sm opacity-90">
                            Chủ tịch Hiệp hội
                          </div>
                        </div>
                      </div>

                      {/* Các thành viên thường vụ */}
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow">
                          <div className="font-semibold text-sm">
                            Phó Chủ tịch
                          </div>
                          <div className="text-xs opacity-90">Thường trực</div>
                        </div>
                        <div className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow">
                          <div className="font-semibold text-sm">
                            Tổng Thư ký
                          </div>
                          <div className="text-xs opacity-90">Điều hành</div>
                        </div>
                        <div className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow">
                          <div className="font-semibold text-sm">
                            Phó Tổng Thư ký
                          </div>
                          <div className="text-xs opacity-90">Hỗ trợ</div>
                        </div>
                        <div className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow">
                          <div className="font-semibold text-sm">Ủy viên</div>
                          <div className="text-xs opacity-90">Thường vụ</div>
                        </div>
                      </div>

                      {/* Nhiệm vụ */}
                      <div className="bg-white p-6 rounded-lg shadow border-2 border-emerald-200">
                        <h4 className="font-bold text-emerald-900 mb-4">
                          Nhiệm vụ chính
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4 text-left">
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li>
                              • Điều hành hoạt động hàng ngày của Hiệp hội
                            </li>
                            <li>
                              • Thực hiện các nghị quyết của Ban Chấp hành
                            </li>
                            <li>
                              • Phối hợp với các cơ quan, tổ chức thành viên
                            </li>
                          </ul>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li>• Tổ chức các hoạt động chuyên môn</li>
                            <li>• Quản lý tài chính và nhân sự</li>
                            <li>• Báo cáo định kỳ với Ban Chấp hành</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Điều lệ NDA Section */}
          {activeTab === "charter" && (
            <div className="animate-in fade-in duration-500">
              <Card className="border-emerald-200 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-emerald-900 mb-6 text-center">
                    Điều lệ Hiệp hội Dữ liệu Quốc gia Việt Nam
                  </h3>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Charter Preview */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-emerald-900">
                        Trang đầu Điều lệ
                      </h4>
                      <div className="border-2 border-emerald-200 rounded-lg p-4 bg-gray-50">
                        <Image
                          src="/vietnamese-legal-document.png"
                          alt="Điều lệ NDA - Trang 1"
                          width={600}
                          height={800}
                          className="w-full h-auto rounded shadow-lg"
                        />
                      </div>
                    </div>

                    {/* Charter Information */}
                    <div className="space-y-6">
                      <div className="bg-emerald-50 p-6 rounded-lg">
                        <h4 className="text-lg font-semibold text-emerald-900 mb-4">
                          Thông tin Điều lệ
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">Tên tài liệu:</span>
                            <span>
                              Điều lệ Hiệp hội Dữ liệu Quốc gia Việt Nam
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Ngày ban hành:</span>
                            <span>15/03/2024</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Số trang:</span>
                            <span>24 trang</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Định dạng:</span>
                            <span>PDF</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h4 className="text-lg font-semibold text-emerald-900 mb-4">
                          Nội dung chính
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Chương I: Những quy định chung</li>
                          <li>• Chương II: Mục tiêu, nhiệm vụ và quyền hạn</li>
                          <li>• Chương III: Thành viên Hiệp hội</li>
                          <li>• Chương IV: Cơ cấu tổ chức</li>
                          <li>• Chương V: Tài chính và tài sản</li>
                          <li>• Chương VI: Quan hệ với các tổ chức khác</li>
                          <li>• Chương VII: Những quy định khác</li>
                        </ul>
                      </div>

                      <div className="text-center">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3">
                          <Download className="w-5 h-5 mr-2" />
                          Tải xuống Điều lệ đầy đủ (PDF)
                        </Button>
                        <p className="text-sm text-gray-600 mt-2">
                          Kích thước: 2.4 MB • Cập nhật: 15/03/2024
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
