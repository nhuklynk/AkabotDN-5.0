import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Building2, Award, TrendingUp } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-background via-muted/30 to-accent/5 py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-serif text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Dữ liệu và hành trình
                <span className="text-primary"> lịch sử 80 năm</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Hiệp hội Dữ liệu Quốc gia Việt Nam tiên phong trong việc xây
                dựng và phát triển hệ sinh thái dữ liệu quốc gia, góp phần thúc
                đẩy chuyển đổi số toàn diện.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base">
                Tìm hiểu thêm
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base bg-transparent"
              >
                Đăng ký hội viên
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3 mx-auto">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Hội viên</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3 mx-auto">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">100+</div>
                <div className="text-sm text-muted-foreground">Tổ chức</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3 mx-auto">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">50+</div>
                <div className="text-sm text-muted-foreground">Dự án</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3 mx-auto">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">80</div>
                <div className="text-sm text-muted-foreground">Năm lịch sử</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-8">
              <img
                src="/vietnam-data-center.png"
                alt="Trung tâm dữ liệu Việt Nam"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
