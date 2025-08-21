import { MapPin, Phone, Mail, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2E6EE] to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0033FF] mb-2">LIÊN HỆ</h1>
          <div className="w-20 h-1 bg-gradient-to-r from-[#977DFF] to-[#0033FF]"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <Card className="border-[#977DFF]/20 bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[#0033FF]">
                Thông tin liên hệ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-[#0033FF] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0600AF]">Người nhận</p>
                    <p className="text-[#0600AF]/80">Trương T.Phương Thảo</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#0033FF] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0600AF]">Địa chỉ</p>
                    <p className="text-[#0600AF]/80">
                      Cung thanh niên, 37 Trần Bình Trọng,
                      <br />
                      Nguyễn Du, Hai Bà Trưng, Hà Nội
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#0033FF] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0600AF]">SĐT</p>
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
              </div>
            </CardContent>
          </Card>

          {/* Map */}
          <Card className="border-[#977DFF]/20 bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[#0033FF]">
                Bản đồ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gradient-to-br from-[#F2E6EE] to-[#977DFF]/20 rounded-lg overflow-hidden border border-[#977DFF]/20">
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
                <p className="text-sm text-[#0033FF]">
                  <strong>Cung văn hóa thanh niên</strong>
                  <br />
                  2R9V+4QR, Nguyễn Du, Hai Bà Trưng, Hà Nội
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
