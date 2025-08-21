import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Users, Building } from "lucide-react";

export default function MemberRegistrationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ĐĂNG KÝ HỘI VIÊN
          </h1>
          <div className="w-20 h-1 bg-emerald-600"></div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            <Users className="w-4 h-4" />
            Hội viên cá nhân
          </Button>
          <Button
            variant="default"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <Building className="w-4 h-4" />
            Hội viên tổ chức
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Association Information */}
          <Card>
            <CardHeader className="bg-red-50 border-b">
              <CardTitle className="text-xl font-semibold text-red-700">
                THÔNG TIN HIỆP HỘI
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-gray-900">Người nhận</p>
                    <p className="text-gray-600">Trương T.Phương Thảo</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">SĐT</p>
                    <p className="text-gray-600">0931.399.883</p>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-gray-900">Địa chỉ</p>
                  <p className="text-gray-600">
                    Cung thanh niên, 37 Trần Bình Trọng,
                    <br />
                    Nguyễn Du, Hai Bà Trưng, Hà Nội
                  </p>
                </div>

                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <div className="space-y-1">
                    <p className="text-gray-600">vanphongNDA@nda.org.vn</p>
                    <p className="text-gray-600">thaottp@nda.org.vn</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registration Form */}
          <Card>
            <CardHeader className="bg-red-50 border-b">
              <CardTitle className="text-xl font-semibold text-red-700">
                ĐĂNG KÝ TỔ CHỨC
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    1. Mẫu đơn đăng ký:
                  </h3>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-blue-600 hover:text-blue-700 bg-transparent"
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
                  <h3 className="font-semibold text-gray-900 mb-2">
                    2. ĐKKD - bản công chứng có hiệu lực trong 6 tháng gần nhất
                  </h3>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    3. CCCD của người đại diện thay mặt DN tham gia HH (có thể
                    kê phải là người đại diện pháp luật)
                  </h3>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    4. Điền link online:
                  </h3>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-blue-600 hover:text-blue-700 bg-transparent"
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

                <div className="mt-8 p-4 bg-emerald-50 rounded-lg">
                  <p className="text-sm text-emerald-800">
                    <strong>Lưu ý:</strong> Vui lòng chuẩn bị đầy đủ các giấy tờ
                    theo yêu cầu và điền form online để hoàn tất quá trình đăng
                    ký hội viên.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
