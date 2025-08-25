import {
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
  Send,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2E6EE] to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0033FF] to-[#977DFF] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>0931.399.883</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>vanphongNDA@nda.org.vn</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>Hà Nội, Việt Nam</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-[#977DFF]/20 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-[#0033FF] flex items-center gap-2">
                  <MessageSquare className="w-6 h-6" />
                  Gửi tin nhắn cho chúng tôi
                </CardTitle>
                <p className="text-[#0600AF]/70">
                  Hãy để lại thông tin, chúng tôi sẽ liên hệ với bạn trong thời
                  gian sớm nhất
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0600AF] mb-2">
                      Họ và tên *
                    </label>
                    <Input
                      placeholder="Nhập họ và tên của bạn"
                      className="border-[#977DFF]/30 focus:border-[#0033FF] focus:ring-[#0033FF]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0600AF] mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      className="border-[#977DFF]/30 focus:border-[#0033FF] focus:ring-[#0033FF]/20"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0600AF] mb-2">
                      Số điện thoại
                    </label>
                    <Input
                      placeholder="0xxx xxx xxx"
                      className="border-[#977DFF]/30 focus:border-[#0033FF] focus:ring-[#0033FF]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0600AF] mb-2">
                      Tổ chức
                    </label>
                    <Input
                      placeholder="Tên công ty/tổ chức"
                      className="border-[#977DFF]/30 focus:border-[#0033FF] focus:ring-[#0033FF]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0600AF] mb-2">
                    Chủ đề
                  </label>
                  <Input
                    placeholder="Tiêu đề tin nhắn"
                    className="border-[#977DFF]/30 focus:border-[#0033FF] focus:ring-[#0033FF]/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0600AF] mb-2">
                    Nội dung *
                  </label>
                  <Textarea
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                    className="min-h-[120px] border-[#977DFF]/30 focus:border-[#0033FF] focus:ring-[#0033FF]/20"
                  />
                </div>

                <Button className="w-full bg-gradient-to-r from-[#0033FF] to-[#977DFF] hover:from-[#977DFF] hover:to-[#0033FF] text-white py-3">
                  <Send className="w-4 h-4 mr-2" />
                  Gửi tin nhắn
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="border-[#977DFF]/20 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#0033FF]">
                  Thông tin liên hệ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-[#0033FF] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0600AF]">
                      Người phụ trách
                    </p>
                    <p className="text-[#0600AF]/80">Trương T. Phương Thảo</p>
                    <p className="text-sm text-[#0600AF]/60">
                      Trưởng phòng Văn phòng
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#0033FF] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0600AF]">
                      Địa chỉ văn phòng
                    </p>
                    <p className="text-[#0600AF]/80">
                      Cung thanh niên
                      <br />
                      37 Trần Bình Trọng
                      <br />
                      Nguyễn Du, Hai Bà Trưng
                      <br />
                      Hà Nội, Việt Nam
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#0033FF] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0600AF]">Điện thoại</p>
                    <p className="text-[#0600AF]/80">0931.399.883</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#0033FF] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0600AF]">Email</p>
                    <div className="space-y-1">
                      <p className="text-[#0600AF]/80">
                        vanphongNDA@nda.org.vn
                      </p>
                      <p className="text-[#0600AF]/80">thaottp@nda.org.vn</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#0033FF] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0600AF]">Giờ làm việc</p>
                    <div className="text-[#0600AF]/80 text-sm">
                      <p>Thứ Hai - Thứ Sáu: 8:00 - 17:00</p>
                      <p>Thứ Bảy: 8:00 - 12:00</p>
                      <p>Chủ Nhật: Nghỉ</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card className="border-[#FFCCF2]/30 bg-gradient-to-br from-[#F2E6EE] to-[#FFCCF2]/20">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-[#0033FF] mb-3">
                  Liên hệ nhanh
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#977DFF]/30 text-[#0033FF] hover:bg-[#977DFF]/10"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Gọi điện ngay
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#977DFF]/30 text-[#0033FF] hover:bg-[#977DFF]/10"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Gửi email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <Card className="border-[#977DFF]/20 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-[#0033FF] flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              Vị trí văn phòng
            </CardTitle>
            <p className="text-[#0600AF]/70">
              Chúng tôi tọa lạc tại trung tâm Hà Nội, giao thông thuận tiện
            </p>
          </CardHeader>
          <CardContent>
            <div className="aspect-[21/9] bg-gradient-to-br from-[#F2E6EE] to-[#977DFF]/20 rounded-lg overflow-hidden border border-[#977DFF]/20">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6962326256447!2d105.84117731533447!3d21.01624939383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab86a2e8c4e7%3A0x5c4a8b8b8b8b8b8b!2sCung%20V%C4%83n%20h%C3%B3a%20Thanh%20ni%C3%AAn!5e0!3m2!1svi!2s!4v1635000000000!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ Hiệp hội Dữ liệu Quốc gia"
              ></iframe>
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-[#F2E6EE] to-[#FFCCF2]/20 rounded-lg border border-[#FFCCF2]/30">
              <div className="grid md:grid-cols-3 gap-4 text-center md:text-left">
                <div>
                  <p className="font-semibold text-[#0033FF]">Địa chỉ đầy đủ</p>
                  <p className="text-sm text-[#0600AF]/80">
                    Cung văn hóa thanh niên
                    <br />
                    37 Trần Bình Trọng, Nguyễn Du
                    <br />
                    Hai Bà Trưng, Hà Nội
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-[#0033FF]">Giao thông</p>
                  <p className="text-sm text-[#0600AF]/80">
                    Gần ga tàu điện ngầm
                    <br />
                    Nhiều tuyến xe buýt
                    <br />
                    Bãi đỗ xe thuận tiện
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-[#0033FF]">Mã bưu chính</p>
                  <p className="text-sm text-[#0600AF]/80">
                    100000
                    <br />
                    Quận Hai Bà Trưng
                    <br />
                    Thành phố Hà Nội
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
