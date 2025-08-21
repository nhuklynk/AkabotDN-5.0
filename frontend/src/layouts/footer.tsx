import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#977DFF] to-[#0600AF] border-t border-[#FFCCF2]/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-gradient-to-br from-[#FFCCF2] to-[#0033FF]"></div>
              <div>
                <h3 className="font-bold text-white">HIỆP HỘI DỮ LIỆU</h3>
                <p className="text-sm text-[#FFCCF2]">QUỐC GIA VIỆT NAM</p>
              </div>
            </div>
            <p className="text-sm text-white/90 leading-relaxed">
              Tổ chức tiên phong trong việc phát triển hệ sinh thái dữ liệu quốc
              gia, thúc đẩy chuyển đổi số toàn diện tại Việt Nam.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 text-white hover:text-[#FFCCF2] hover:bg-[#FFCCF2]/10"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 text-white hover:text-[#FFCCF2] hover:bg-[#FFCCF2]/10"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 text-white hover:text-[#FFCCF2] hover:bg-[#FFCCF2]/10"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Liên kết nhanh</h4>
            <nav className="flex flex-col space-y-2">
              <a
                href="#"
                className="text-sm text-white/80 hover:text-[#FFCCF2] transition-colors"
              >
                Giới thiệu
              </a>
              <a
                href="#"
                className="text-sm text-white/80 hover:text-[#FFCCF2] transition-colors"
              >
                Ban lãnh đạo
              </a>
              <a
                href="#"
                className="text-sm text-white/80 hover:text-[#FFCCF2] transition-colors"
              >
                Ban chấp hành
              </a>
              <a
                href="#"
                className="text-sm text-white/80 hover:text-[#FFCCF2] transition-colors"
              >
                Văn bản hiệp hội
              </a>
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Dịch vụ</h4>
            <nav className="flex flex-col space-y-2">
              <a
                href="#"
                className="text-sm text-white/80 hover:text-[#FFCCF2] transition-colors"
              >
                Sản phẩm số
              </a>
              <a
                href="#"
                className="text-sm text-white/80 hover:text-[#FFCCF2] transition-colors"
              >
                Đăng ký hội viên
              </a>
              <a
                href="#"
                className="text-sm text-white/80 hover:text-[#FFCCF2] transition-colors"
              >
                Hoạt động hiệp hội
              </a>
              <a
                href="#"
                className="text-sm text-white/80 hover:text-[#FFCCF2] transition-colors"
              >
                Sự kiện
              </a>
            </nav>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Liên hệ</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-[#FFCCF2] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-white/80">Hà Nội, Việt Nam</p>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-[#FFCCF2]" />
                <p className="text-sm text-white/80">+84 (24) 1234 5678</p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-[#FFCCF2]" />
                <p className="text-sm text-white/80">info@vda.gov.vn</p>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-sm font-medium text-white">
                Đăng ký nhận tin
              </h5>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Email của bạn"
                  className="text-sm border-[#FFCCF2]/30 focus:border-[#FFCCF2] focus:ring-[#FFCCF2]/20"
                />
                <Button
                  size="sm"
                  className="bg-[#0033FF] hover:bg-[#0600AF] text-white border-0"
                >
                  Đăng ký
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#FFCCF2]/20 mt-12 pt-8 text-center">
          <p className="text-sm text-white/80">
            © 2025 Hiệp hội Dữ liệu Quốc gia Việt Nam. Tất cả quyền được bảo
            lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
