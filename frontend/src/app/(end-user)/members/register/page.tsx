"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Users, Building } from "lucide-react";
import { useState } from "react";

export default function MemberRegistrationPage() {
  const [isOrganization, setIsOrganization] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2E6EE] to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0033FF] mb-2">
            ĐĂNG KÝ HỘI VIÊN
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-[#977DFF] to-[#0033FF]"></div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8">
          <Button
            variant="outline"
            className={`flex items-center gap-2 transition-all duration-200 ${
              !isOrganization
                ? "bg-[#0033FF] border-[#0033FF] text-white hover:bg-[#0033FF]/90"
                : "bg-transparent border-[#977DFF] text-[#0600AF] hover:bg-[#FFCCF2]/10 hover:border-[#0033FF]"
            }`}
            onClick={() => setIsOrganization(false)}
          >
            <Users className="w-4 h-4" />
            Hội viên cá nhân
          </Button>
          <Button
            variant="outline"
            className={`flex items-center gap-2 transition-all duration-200 ${
              isOrganization
                ? "bg-[#0033FF] border-[#0033FF] text-white hover:bg-[#0033FF]/90"
                : "bg-transparent border-[#977DFF] text-[#0600AF] hover:bg-[#FFCCF2]/10 hover:border-[#0033FF]"
            }`}
            onClick={() => setIsOrganization(true)}
          >
            <Building className="w-4 h-4" />
            Hội viên tổ chức
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Association Information */}
          <Card className="border-[#FFCCF2] bg-white">
            <CardHeader className="bg-gradient-to-r from-[#FFCCF2]/20 to-[#977DFF]/20 border-b border-[#FFCCF2]/30">
              <CardTitle className="text-xl font-semibold text-[#0033FF]">
                THÔNG TIN HIỆP HỘI
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-[#0600AF]">Người nhận</p>
                    <p className="text-[#0600AF]/80">Trương T.Phương Thảo</p>
                  </div>
                  <div>
                    <p className="font-medium text-[#0600AF]">SĐT</p>
                    <p className="text-[#0600AF]/80">0931.399.883</p>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-[#0600AF]">Địa chỉ</p>
                  <p className="text-[#0600AF]/80">
                    Cung thanh niên, 37 Trần Bình Trọng,
                    <br />
                    Nguyễn Du, Hai Bà Trưng, Hà Nội
                  </p>
                </div>

                <div>
                  <p className="font-medium text-[#0600AF]">Email</p>
                  <div className="space-y-1">
                    <p className="text-[#0600AF]/80">vanphongNDA@nda.org.vn</p>
                    <p className="text-[#0600AF]/80">thaottp@nda.org.vn</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registration Form */}
          {isOrganization ? (
            <Card className="border-[#FFCCF2] bg-white">
              <CardHeader className="bg-gradient-to-r from-[#FFCCF2]/20 to-[#977DFF]/20 border-b border-[#FFCCF2]/30">
                <CardTitle className="text-xl font-semibold text-[#0033FF]">
                  ĐĂNG KÝ TỔ CHỨC
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-[#0600AF] mb-3">
                      1. Mẫu đơn đăng ký:
                    </h3>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-[#0033FF] hover:text-[#0600AF] bg-transparent border-[#0033FF] hover:bg-[#FFCCF2]/10"
                      asChild
                    >
                      <a
                        href="https://docs.google.com/document/d/1oHCgW8pKKtW9upKFT3YLOHs_8ZyJcXZW/edit?usp=drive_link&ouid=111365686887547103244&rtpof=true&sd=true"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Tải mẫu đơn đăng ký
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#0600AF] mb-2">
                      2. ĐKKD - bản công chứng có hiệu lực trong 6 tháng gần
                      nhất
                    </h3>
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#0600AF] mb-2">
                      3. CCCD của người đại diện thay mặt DN tham gia HH (có thể
                      kê phải là người đại diện pháp luật)
                    </h3>
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#0600AF] mb-3">
                      4. Điền link online:
                    </h3>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-[#0033FF] hover:text-[#0600AF] bg-transparent border-[#0033FF] hover:bg-[#FFCCF2]/10"
                      asChild
                    >
                      <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSfepT3WSNWZflP3Y0r6-jyQUy9nVxKbu6iYEN7WUwanz0SS1w/formResponse"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Điền form đăng ký online
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    </Button>
                  </div>

                  <div className="mt-8 p-4 bg-gradient-to-r from-[#F2E6EE] to-[#FFCCF2]/20 rounded-lg border border-[#FFCCF2]/30">
                    <p className="text-sm text-[#0033FF]">
                      <strong>Lưu ý:</strong> Vui lòng chuẩn bị đầy đủ các giấy
                      tờ theo yêu cầu và điền form online để hoàn tất quá trình
                      đăng ký hội viên.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-[#FFCCF2] bg-white">
              <CardHeader className="bg-gradient-to-r from-[#FFCCF2]/20 to-[#977DFF]/20 border-b border-[#FFCCF2]/30">
                <CardTitle className="text-xl font-semibold text-[#0033FF]">
                  ĐĂNG KÝ CÁ NHÂN
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-[#0600AF] mb-3">
                      1. Mẫu đơn đăng ký:
                    </h3>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-[#0033FF] hover:text-[#0600AF] bg-transparent border-[#0033FF] hover:bg-[#FFCCF2]/10"
                      asChild
                    >
                      <a
                        href="https://docs.google.com/document/d/1oHCgW8pKKtW9upKFT3YLOHs_8ZyJcXZW/edit?usp=drive_link&ouid=111365686887547103244&rtpof=true&sd=true"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Tải mẫu đơn đăng ký
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#0600AF] mb-2">
                      2. ĐKKD - bản công chứng có hiệu lực trong 6 tháng gần
                      nhất
                    </h3>
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#0600AF] mb-2">
                      3. CCCD của người đại diện thay mặt DN tham gia HH (có thể
                      kê phải là người đại diện pháp luật)
                    </h3>
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#0600AF] mb-3">
                      4. Điền link online:
                    </h3>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-[#0033FF] hover:text-[#0600AF] bg-transparent border-[#0033FF] hover:bg-[#FFCCF2]/10"
                      asChild
                    >
                      <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSfepT3WSNWZflP3Y0r6-jyQUy9nVxKbu6iYEN7WUwanz0SS1w/formResponse"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Điền form đăng ký online
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    </Button>
                  </div>

                  <div className="mt-8 p-4 bg-gradient-to-r from-[#F2E6EE] to-[#FFCCF2]/20 rounded-lg border border-[#FFCCF2]/30">
                    <p className="text-sm text-[#0033FF]">
                      <strong>Lưu ý:</strong> Vui lòng chuẩn bị đầy đủ các giấy
                      tờ theo yêu cầu và điền form online để hoàn tất quá trình
                      đăng ký hội viên.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
