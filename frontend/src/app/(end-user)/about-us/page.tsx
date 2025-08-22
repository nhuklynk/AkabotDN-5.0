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
    <div className="min-h-screen bg-gradient-to-br from-[#F2E6EE] to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-[#FFCCF2]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#0033FF] mb-4">
              Giới thiệu Hiệp hội Dữ liệu Quốc gia Việt Nam
            </h1>
            <p className="text-lg text-[#0600AF] max-w-3xl mx-auto">
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
                    ? "bg-gradient-to-r from-[#FFCCF2] to-[#977DFF] hover:from-[#977DFF] hover:to-[#0033FF] text-white border-0"
                    : "border-[#FFCCF2]/40 text-[#0033FF] hover:bg-gradient-to-r hover:from-[#FFCCF2]/20 hover:to-[#F2E6EE] hover:border-[#977DFF]/50 transition-all duration-300"
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
                <Card className="border-[#FFCCF2]/40 shadow-lg bg-white hover:border-[#977DFF]/50 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#FFCCF2] to-[#977DFF] rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#0033FF]">
                        Sứ mệnh
                      </h3>
                    </div>
                    <p className="text-[#0600AF]/90 leading-relaxed">
                      Kết nối các cơ quan quản lý, doanh nghiệp, tổ chức trong
                      lĩnh vực dữ liệu và khoa học công nghệ. Xây dựng các hoạt
                      động thiết thực nhằm lan tỏa tri thức, kết nối cộng đồng,
                      thúc đẩy phát triển hệ sinh thái dữ liệu Việt Nam trong kỷ
                      nguyên số.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-[#977DFF]/40 shadow-lg bg-white hover:border-[#FFCCF2]/50 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#977DFF] to-[#0033FF] rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#0033FF]">
                        Tầm nhìn
                      </h3>
                    </div>
                    <p className="text-[#0600AF]/90 leading-relaxed">
                      Trở thành tổ chức hàng đầu trong việc kiến thiết hệ sinh
                      thái dữ liệu Việt Nam, góp phần xây dựng nền kinh tế số
                      phát triển bền vững và nâng cao năng lực cạnh tranh quốc
                      gia trong thời đại công nghệ 4.0.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Core Values */}
              <Card className="border-[#FFCCF2]/40 shadow-lg bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFCCF2] to-[#F2E6EE] rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-[#977DFF]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0033FF]">
                      Giá trị cốt lõi
                    </h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-[#F2E6EE] to-[#FFCCF2]/30 rounded-lg border border-[#FFCCF2]/40 hover:from-[#FFCCF2]/40 hover:to-[#F2E6EE] transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#FFCCF2] to-[#977DFF] rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-white">1</span>
                      </div>
                      <h4 className="font-semibold text-[#0033FF] mb-2">
                        Minh bạch
                      </h4>
                      <p className="text-sm text-[#0600AF]/90">
                        Đảm bảo tính minh bạch trong mọi hoạt động và quy trình
                        xử lý dữ liệu
                      </p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-[#FFCCF2]/30 to-[#F2E6EE] rounded-lg border border-[#FFCCF2]/40 hover:from-[#F2E6EE] hover:to-[#FFCCF2]/40 transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#977DFF] to-[#0033FF] rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-white">2</span>
                      </div>
                      <h4 className="font-semibold text-[#0033FF] mb-2">
                        Đổi mới
                      </h4>
                      <p className="text-sm text-[#0600AF]/90">
                        Tiên phong trong việc ứng dụng công nghệ và phương pháp
                        mới
                      </p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-[#F2E6EE] to-[#977DFF]/30 rounded-lg border border-[#977DFF]/40 hover:from-[#977DFF]/40 hover:to-[#F2E6EE] transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#FFCCF2] to-[#F2E6EE] rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-[#977DFF]">
                          3
                        </span>
                      </div>
                      <h4 className="font-semibold text-[#0033FF] mb-2">
                        Hợp tác
                      </h4>
                      <p className="text-sm text-[#0600AF]/90">
                        Xây dựng mối quan hệ đối tác bền vững và hiệu quả
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Formation History */}
              <Card className="border-[#977DFF]/40 shadow-lg bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFCCF2] to-[#977DFF] rounded-full flex items-center justify-center">
                      <History className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0033FF]">
                      Lịch sử hình thành
                    </h3>
                  </div>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <Badge className="bg-gradient-to-r from-[#FFCCF2] to-[#F2E6EE] text-[#0033FF] px-3 py-1 border-0 font-semibold">
                          2024
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0033FF] mb-2">
                          Thành lập Hiệp hội
                        </h4>
                        <p className="text-[#0600AF]/90">
                          Hiệp hội Dữ liệu Quốc gia Việt Nam được thành lập với
                          sự tham gia của các cơ quan, tổ chức hàng đầu trong
                          lĩnh vực dữ liệu và công nghệ thông tin.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <Badge className="bg-gradient-to-r from-[#F2E6EE] to-[#FFCCF2] text-[#0033FF] px-3 py-1 border-0 font-semibold">
                          2025
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0033FF] mb-2">
                          Mở rộng hoạt động
                        </h4>
                        <p className="text-[#0600AF]/90">
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
              <Card className="border-[#FFCCF2]/40 shadow-lg bg-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-[#0033FF] mb-6 text-center">
                    Sơ đồ tổ chức Ban Chấp hành
                  </h3>
                  <div className="bg-gradient-to-br from-[#F2E6EE] to-[#FFCCF2]/30 p-8 rounded-lg border border-[#FFCCF2]/40">
                    <div className="text-center space-y-8">
                      {/* Chủ tịch */}
                      <div className="flex justify-center">
                        <div className="bg-gradient-to-br from-[#FFCCF2] to-[#977DFF] text-white px-6 py-4 rounded-lg shadow-lg">
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
                        <div className="bg-gradient-to-br from-[#977DFF] to-[#0033FF] text-white px-6 py-4 rounded-lg shadow-lg">
                          <div className="font-bold">PHÓ CHỦ TỊCH</div>
                          <div className="text-sm opacity-90">Thường trực</div>
                        </div>
                        <div className="bg-gradient-to-br from-[#F2E6EE] to-[#FFCCF2] text-[#0033FF] px-6 py-4 rounded-lg shadow-lg border border-[#FFCCF2]/40">
                          <div className="font-bold">PHÓ CHỦ TỊCH</div>
                          <div className="text-sm opacity-90">Kiêm nhiệm</div>
                        </div>
                      </div>

                      {/* Các ban chuyên môn */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-[#FFCCF2] to-[#F2E6EE] text-[#0033FF] px-4 py-3 rounded-lg shadow border border-[#FFCCF2]/40">
                          <div className="font-semibold">Ban Nghiên cứu</div>
                          <div className="text-sm opacity-90">& Phát triển</div>
                        </div>
                        <div className="bg-gradient-to-br from-[#F2E6EE] to-[#FFCCF2] text-[#0033FF] px-4 py-3 rounded-lg shadow border border-[#FFCCF2]/40">
                          <div className="font-semibold">Ban Hợp tác</div>
                          <div className="text-sm opacity-90">Quốc tế</div>
                        </div>
                        <div className="bg-gradient-to-br from-[#FFCCF2] to-[#977DFF] text-white px-4 py-3 rounded-lg shadow">
                          <div className="font-semibold">Ban Truyền thông</div>
                          <div className="text-sm opacity-90">& Sự kiện</div>
                        </div>
                      </div>

                      {/* Văn phòng */}
                      <div className="flex justify-center">
                        <div className="bg-gradient-to-br from-[#977DFF] to-[#0033FF] text-white px-6 py-4 rounded-lg shadow-lg">
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
              <Card className="border-[#977DFF]/40 shadow-lg bg-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-[#0033FF] mb-6 text-center">
                    Sơ đồ tổ chức Ban Thường vụ
                  </h3>
                  <div className="bg-gradient-to-br from-[#F2E6EE] to-[#FFCCF2]/30 p-8 rounded-lg border border-[#FFCCF2]/40">
                    <div className="text-center space-y-6">
                      {/* Trưởng ban */}
                      <div className="flex justify-center">
                        <div className="bg-gradient-to-br from-[#FFCCF2] to-[#977DFF] text-white px-8 py-4 rounded-lg shadow-lg">
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
                        <div className="bg-gradient-to-br from-[#F2E6EE] to-[#FFCCF2] text-[#0033FF] px-4 py-3 rounded-lg shadow border border-[#FFCCF2]/40">
                          <div className="font-semibold text-sm">
                            Phó Chủ tịch
                          </div>
                          <div className="text-xs opacity-90">Thường trực</div>
                        </div>
                        <div className="bg-gradient-to-br from-[#FFCCF2] to-[#F2E6EE] text-[#0033FF] px-4 py-3 rounded-lg shadow border border-[#FFCCF2]/40">
                          <div className="font-semibold text-sm">
                            Tổng Thư ký
                          </div>
                          <div className="text-xs opacity-90">Điều hành</div>
                        </div>
                        <div className="bg-gradient-to-br from-[#F2E6EE] to-[#977DFF] text-white px-4 py-3 rounded-lg shadow">
                          <div className="font-semibold text-sm">
                            Phó Tổng Thư ký
                          </div>
                          <div className="text-xs opacity-90">Hỗ trợ</div>
                        </div>
                        <div className="bg-gradient-to-br from-[#977DFF] to-[#FFCCF2] text-white px-4 py-3 rounded-lg shadow">
                          <div className="font-semibold text-sm">Ủy viên</div>
                          <div className="text-xs opacity-90">Thường vụ</div>
                        </div>
                      </div>

                      {/* Nhiệm vụ */}
                      <div className="bg-white p-6 rounded-lg shadow border-2 border-[#FFCCF2]/40">
                        <h4 className="font-bold text-[#0033FF] mb-4">
                          Nhiệm vụ chính
                        </h4>
                        <div className="grid md:grid-cols-3 gap-4 text-left">
                          <ul className="space-y-2 text-sm text-[#0600AF]/90">
                            <li>
                              • Điều hành hoạt động hàng ngày của Hiệp hội
                            </li>
                            <li>
                              • Thực hiện các nghị quyết của Ban Chấp hành
                            </li>
                          </ul>
                          <ul className="space-y-2 text-sm text-[#0600AF]/90">
                            <li>
                              • Phối hợp với các cơ quan, tổ chức thành viên
                            </li>
                            <li>• Tổ chức các hoạt động chuyên môn</li>
                          </ul>
                          <ul className="space-y-2 text-sm text-[#0600AF]/90">
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
              <Card className="border-[#FFCCF2]/40 shadow-lg bg-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-[#0033FF] mb-6 text-center">
                    Điều lệ Hiệp hội Dữ liệu Quốc gia Việt Nam
                  </h3>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Charter Preview */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-[#0033FF]">
                        Trang đầu Điều lệ
                      </h4>
                      <div className="border-2 border-[#FFCCF2]/40 rounded-lg p-4 bg-gradient-to-br from-[#F2E6EE] to-[#FFCCF2]/20">
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
                      <h4 className="text-lg font-semibold text-[#0033FF] mb-4">
                        Thông tin Điều lệ
                      </h4>
                      <div className="bg-gradient-to-br from-[#F2E6EE] to-[#FFCCF2]/30 p-6 rounded-lg border border-[#FFCCF2]/40">
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium text-[#0033FF]">
                              Tên tài liệu:
                            </span>
                            <span className="text-[#0600AF]/90">
                              Điều lệ Hiệp hội Dữ liệu Quốc gia Việt Nam
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-[#0033FF]">
                              Ngày ban hành:
                            </span>
                            <span className="text-[#0600AF]/90">
                              15/03/2024
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-[#0033FF]">
                              Số trang:
                            </span>
                            <span className="text-[#0600AF]/90">24 trang</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-[#0033FF]">
                              Định dạng:
                            </span>
                            <span className="text-[#0600AF]/90">PDF</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-[#FFCCF2]/20 to-[#F2E6EE] p-6 rounded-lg border border-[#FFCCF2]/40">
                        <h4 className="text-lg font-semibold text-[#0033FF] mb-4">
                          Nội dung chính
                        </h4>
                        <ul className="space-y-2 text-sm text-[#0600AF]/90">
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
                        <Button className="bg-gradient-to-r from-[#FFCCF2] to-[#977DFF] hover:from-[#977DFF] hover:to-[#0033FF] text-white px-8 py-3 border-0 transition-all duration-300">
                          <Download className="w-5 h-5 mr-2" />
                          Tải xuống Điều lệ đầy đủ (PDF)
                        </Button>
                        <p className="text-sm text-[#0600AF]/90 mt-2">
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
