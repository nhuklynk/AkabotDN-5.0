"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Users,
  Database,
  Shield,
  Globe,
  TrendingUp,
  Award,
  Calendar,
  MapPin,
  CheckCircle,
  Star,
  Zap,
} from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  const features = [
    {
      icon: <Database className="w-8 h-8 text-[#0033FF]" />,
      title: "Quản lý Dữ liệu Quốc gia",
      description:
        "Xây dựng hệ thống quản lý dữ liệu tập trung, an toàn và hiệu quả",
    },
    {
      icon: <Shield className="w-8 h-8 text-[#977DFF]" />,
      title: "Bảo mật & Tuân thủ",
      description:
        "Đảm bảo an toàn thông tin và tuân thủ các quy định pháp luật",
    },
    {
      icon: <Globe className="w-8 h-8 text-[#FFCCF2]" />,
      title: "Hợp tác Quốc tế",
      description:
        "Kết nối và chia sẻ kinh nghiệm với các tổ chức dữ liệu toàn cầu",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-[#0033FF]" />,
      title: "Đổi mới Sáng tạo",
      description: "Thúc đẩy ứng dụng công nghệ mới trong quản lý dữ liệu",
    },
  ];

  const stats = [
    { number: "50+", label: "Thành viên", icon: <Users className="w-6 h-6" /> },
    { number: "100+", label: "Dự án", icon: <Database className="w-6 h-6" /> },
    { number: "25+", label: "Đối tác", icon: <Globe className="w-6 h-6" /> },
    { number: "95%", label: "Hài lòng", icon: <Star className="w-6 h-6" /> },
  ];

  const upcomingEvents = [
    {
      title: "Hội thảo Dữ liệu Du lịch 2025",
      date: "25/09/2025",
      location: "Hà Nội",
      type: "Hội thảo",
    },
    {
      title: "Workshop Blockchain & AI",
      date: "30/09/2025",
      location: "TP.HCM",
      type: "Đào tạo",
    },
    {
      title: "Triển lãm Công nghệ Dữ liệu",
      date: "15/10/2025",
      location: "Đà Nẵng",
      type: "Triển lãm",
    },
  ];

  const testimonials = [
    {
      name: "TS. Nguyễn Văn Long",
      position: "Thứ trưởng Bộ Công an",
      content:
        "Hiệp hội đã đóng góp tích cực vào việc xây dựng hệ sinh thái dữ liệu quốc gia.",
      avatar: "/icons/expert-placeholder.svg",
    },
    {
      name: "Prof. Michael Chen",
      position: "Chuyên gia Quốc tế",
      content:
        "Việt Nam đang đi đúng hướng trong việc phát triển nền tảng dữ liệu số.",
      avatar: "/icons/expert-placeholder.svg",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2E6EE] via-white to-[#FFCCF2]/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0033FF]/5 to-[#977DFF]/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FFCCF2]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#977DFF]/20 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-gradient-to-r from-[#FFCCF2] to-[#977DFF] text-white border-0 px-4 py-2 text-sm">
                <Zap className="w-4 h-4 mr-2" />
                Đang phát triển
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold text-[#0033FF] leading-tight">
                Xây dựng
                <span className="block bg-gradient-to-r from-[#977DFF] to-[#FFCCF2] bg-clip-text text-transparent">
                  Tương lai Số
                </span>
                Việt Nam
              </h1>

              <p className="text-xl text-[#0600AF]/80 leading-relaxed">
                Hiệp hội Dữ liệu Quốc gia Việt Nam - Nơi kết nối, chia sẻ và
                phát triển hệ sinh thái dữ liệu vì một Việt Nam số mạnh mẽ và
                bền vững.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#0033FF] to-[#977DFF] hover:from-[#977DFF] hover:to-[#0033FF] text-white border-0 px-8 py-3 text-lg"
                >
                  Khám phá ngay
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#0033FF] text-[#0033FF] hover:bg-[#0033FF] hover:text-white px-8 py-3 text-lg"
                >
                  Tìm hiểu thêm
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/icons/vietnam-data-ecosystem.svg"
                  alt="Hệ sinh thái dữ liệu Việt Nam"
                  width={500}
                  height={300}
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFCCF2]/20 to-[#977DFF]/20 rounded-3xl blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#F2E6EE] to-[#FFCCF2] rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-[#0033FF]">{stat.icon}</div>
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-[#0033FF] mb-2">
                  {stat.number}
                </div>
                <div className="text-[#0600AF]/70 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0033FF] mb-4">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-xl text-[#0600AF]/70 max-w-3xl mx-auto">
              Chúng tôi cam kết mang đến những giải pháp dữ liệu hàng đầu, đáp
              ứng mọi nhu cầu của doanh nghiệp và tổ chức.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#F2E6EE] to-[#FFCCF2] rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-[#0033FF]">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-[#0600AF]/70 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-gradient-to-r from-[#F2E6EE] to-[#FFCCF2]/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0033FF] mb-4">
              Sự kiện sắp diễn ra
            </h2>
            <p className="text-xl text-[#0600AF]/70">
              Tham gia các hoạt động và sự kiện của Hiệp hội
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:bg-white"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-gradient-to-r from-[#FFCCF2] to-[#977DFF] text-white border-0">
                      {event.type}
                    </Badge>
                    <Calendar className="w-5 h-5 text-[#977DFF]" />
                  </div>
                  <CardTitle className="text-xl text-[#0033FF] group-hover:text-[#977DFF] transition-colors">
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-[#0600AF]/70">
                      <Calendar className="w-4 h-4 mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-[#0600AF]/70">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-gradient-to-r from-[#0033FF] to-[#977DFF] hover:from-[#977DFF] hover:to-[#0033FF] text-white border-0">
                    Đăng ký tham gia
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0033FF] mb-4">
              Đánh giá từ chuyên gia
            </h2>
            <p className="text-xl text-[#0600AF]/70">
              Những gì các chuyên gia nói về chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-[#0033FF]">
                        {testimonial.name}
                      </h4>
                      <p className="text-[#0600AF]/70 text-sm">
                        {testimonial.position}
                      </p>
                    </div>
                  </div>
                  <p className="text-[#0600AF]/80 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0033FF] to-[#977DFF] text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Sẵn sàng tham gia cùng chúng tôi?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Hãy trở thành một phần của cộng đồng dữ liệu hàng đầu Việt Nam
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-[#0033FF] hover:bg-[#F2E6EE] px-8 py-3 text-lg"
              >
                Đăng ký thành viên
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-[#0033FF] hover:bg-[#F2E6EE] px-8 py-3 text-lg"
              >
                Liên hệ tư vấn
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
