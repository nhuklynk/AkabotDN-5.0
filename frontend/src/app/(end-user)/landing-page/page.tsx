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
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Eye,
  Target,
  Heart,
  Lightbulb,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface Expert {
  id: number;
  name: string;
  country: string;
  position: { x: number; y: number };
  avatar: string;
  expertise: string;
}

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);

  const bannerSlides = [
    {
      id: 1,
      title: "Xây dựng Tương lai Số Việt Nam",
      subtitle: "Hiệp hội Dữ liệu Quốc gia Việt Nam",
      description:
        "Nơi kết nối, chia sẻ và phát triển hệ sinh thái dữ liệu vì một Việt Nam số mạnh mẽ và bền vững.",
      backgroundImage: "/vietnam-data-ecosystem.svg",
      ctaText: "Khám phá ngay",
      ctaLink: "/digital-product",
    },
    {
      id: 2,
      title: "Kết nối Chuyên gia Toàn cầu",
      subtitle: "Mạng lưới Công nghệ Quốc tế",
      description:
        "Tham gia cộng đồng chuyên gia công nghệ hàng đầu thế giới và chia sẻ kiến thức, kinh nghiệm.",
      backgroundImage: "/international-data-conference.svg",
      ctaText: "Tham gia ngay",
      ctaLink: "/members/register",
    },
    {
      id: 3,
      title: "Đổi mới Sáng tạo",
      subtitle: "Công nghệ Tiên tiến",
      description:
        "Ứng dụng AI, Blockchain và các công nghệ tiên tiến trong quản lý dữ liệu quốc gia.",
      backgroundImage: "/vietnam-ai-assistant.svg",
      ctaText: "Tìm hiểu thêm",
      ctaLink: "/about-us",
    },
  ];

  const globalExperts = [
    {
      id: 1,
      name: "Prof. Michael Chen",
      country: "USA",
      position: { x: 15, y: 35 },
      avatar: "/icons/expert-placeholder.svg",
      expertise: "AI & Machine Learning",
    },
    {
      id: 2,
      name: "Dr. Yuki Tanaka",
      country: "Japan",
      position: { x: 85, y: 30 },
      avatar: "/icons/expert-placeholder.svg",
      expertise: "Blockchain Technology",
    },
    {
      id: 3,
      name: "Prof. Emma Schmidt",
      country: "Germany",
      position: { x: 50, y: 25 },
      avatar: "/icons/expert-placeholder.svg",
      expertise: "Data Analytics",
    },
    {
      id: 4,
      name: "Dr. Raj Patel",
      country: "India",
      position: { x: 70, y: 45 },
      avatar: "/icons/expert-placeholder.svg",
      expertise: "Cybersecurity",
    },
    {
      id: 5,
      name: "Prof. Sophie Martin",
      country: "France",
      position: { x: 48, y: 28 },
      avatar: "/icons/expert-placeholder.svg",
      expertise: "Data Governance",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length
    );
  };

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

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
    {
      number: "150+",
      label: "Thành viên",
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-500 to-purple-600",
    },
    {
      number: "200+",
      label: "Dự án",
      icon: <Database className="w-6 h-6" />,
      color: "from-green-500 to-blue-500",
    },
    {
      number: "85+",
      label: "Đối tác",
      icon: <Globe className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      number: "98%",
      label: "Hài lòng",
      icon: <Star className="w-6 h-6" />,
      color: "from-yellow-500 to-orange-500",
    },
  ];

  const missionVision = {
    mission: {
      title: "Sứ mệnh",
      icon: <Target className="w-8 h-8" />,
      content:
        "Xây dựng và phát triển hệ sinh thái dữ liệu quốc gia, kết nối các tổ chức, doanh nghiệp và chuyên gia để tạo ra giá trị bền vững cho xã hội và nền kinh tế số Việt Nam.",
      color: "from-[#0033FF] to-[#4F46E5]",
    },
    vision: {
      title: "Tầm nhìn",
      icon: <Eye className="w-8 h-8" />,
      content:
        "Trở thành tổ chức hàng đầu trong việc thúc đẩy chuyển đổi số quốc gia, định hướng phát triển công nghệ dữ liệu và kết nối Việt Nam với cộng đồng quốc tế.",
      color: "from-[#977DFF] to-[#8B5CF6]",
    },
    values: {
      title: "Giá trị cốt lõi",
      icon: <Heart className="w-8 h-8" />,
      content:
        "Đổi mới - Kết nối - Chia sẻ - Phát triển bền vững. Chúng tôi tin vào sức mạnh của dữ liệu và công nghệ để tạo ra những thay đổi tích cực cho cộng đồng.",
      color: "from-[#FFCCF2] to-[#EC4899]",
    },
  };

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
    <div className="min-h-screen bg-gradient-to-br from-[#F2E6EE] via-white to-[#FFCCF2]/20 relative overflow-hidden">
      {/* Dynamic Banner Hero Section */}
      <section className="relative h-screen overflow-hidden z-10">
        {/* Slide Container */}
        <div className="relative h-full">
          {bannerSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              }`}
            >
              {/* Slide Background */}
              <div className="absolute inset-0">
                <Image
                  src={slide.backgroundImage}
                  alt={slide.title}
                  fill
                  className="object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0033FF]/20 to-[#977DFF]/20" />
              </div>

              {/* Slide Content */}
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-4xl">
                    <div className="space-y-6 animate-fadeInUp">
                      <Badge className="bg-gradient-to-r from-[#FFCCF2] to-[#977DFF] text-white border-0 px-6 py-3 text-base animate-pulse">
                        <Zap className="w-5 h-5 mr-2" />
                        {slide.subtitle}
                      </Badge>

                      <h1 className="text-5xl lg:text-7xl font-bold text-[#0033FF] leading-tight animate-slideInLeft">
                        {slide.title.split(" ").map((word, wordIndex) => (
                          <span
                            key={wordIndex}
                            className="inline-block mr-4 animate-bounce"
                            style={{
                              animationDelay: `${wordIndex * 0.2}s`,
                              animationDuration: "2s",
                              animationIterationCount: "1",
                            }}
                          >
                            {word}
                          </span>
                        ))}
                      </h1>

                      <p className="text-2xl text-[#0600AF]/90 leading-relaxed max-w-3xl animate-slideInRight">
                        {slide.description}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-6 animate-slideInUp">
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-[#0033FF] to-[#977DFF] hover:from-[#977DFF] hover:to-[#0033FF] text-white border-0 px-10 py-4 text-xl transform hover:scale-105 transition-transform"
                          onClick={() => (window.location.href = slide.ctaLink)}
                        >
                          {slide.ctaText}
                          <ArrowRight className="ml-3 w-6 h-6" />
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          className="border-2 border-[#0033FF] text-[#0033FF] hover:bg-[#0033FF] hover:text-white px-10 py-4 text-xl backdrop-blur-sm bg-white/20"
                        >
                          Xem demo
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-4 transition-all"
        >
          <ChevronLeft className="w-8 h-8 text-[#0033FF]" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-4 transition-all"
        >
          <ChevronRight className="w-8 h-8 text-[#0033FF]" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-[#0033FF] scale-125"
                  : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FFCCF2]/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#977DFF]/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-48 h-48 bg-[#0033FF]/10 rounded-full blur-2xl animate-bounce"
          style={{ animationDuration: "3s" }}
        />
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-white/50 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#0033FF] mb-4">
              Những con số ấn tượng
            </h2>
            <p className="text-xl text-[#0600AF]/70">
              Thành tựu và sự phát triển của chúng tôi
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group relative">
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${stat.color} rounded-3xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}
                >
                  <div className="text-white">{stat.icon}</div>
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-[#0033FF] mb-3 counter animate-pulse">
                  {stat.number}
                </div>
                <div className="text-[#0600AF]/70 font-medium text-lg">
                  {stat.label}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission, Vision & Interactive Globe Section */}
      <section className="relative py-24 z-10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Mission & Vision */}
            <div className="space-y-12">
              <div className="text-center lg:text-left mb-12">
                <h2 className="text-4xl lg:text-5xl font-bold text-[#0033FF] mb-4">
                  Sứ mệnh & Tầm nhìn
                </h2>
                <p className="text-xl text-[#0600AF]/70">
                  Định hướng phát triển bền vững
                </p>
              </div>

              {Object.values(missionVision).map((item, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white transform hover:-translate-y-2"
                >
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-6">
                      <div
                        className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl text-white group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                      >
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-[#0033FF] mb-4 group-hover:text-[#977DFF] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-[#0600AF]/80 leading-relaxed text-lg">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Right: Interactive Globe */}
            <div className="relative flex justify-center items-center">
              <div className="relative w-96 h-96 mx-auto">
                {/* Corner Texts */}
                {/* Top Left */}
                <div className="absolute -top-8 -left-8 text-center animate-float z-20">
                  <div className="bg-gradient-to-r from-[#0033FF] to-[#4F46E5] text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold">
                    Kết nối toàn cầu
                  </div>
                </div>

                {/* Top Right */}
                <div
                  className="absolute -top-8 -right-8 text-center animate-float z-20"
                  style={{ animationDelay: "0.5s" }}
                >
                  <div className="bg-gradient-to-r from-[#977DFF] to-[#8B5CF6] text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold">
                    An toàn dữ liệu
                  </div>
                </div>

                {/* Bottom Left */}
                <div
                  className="absolute -bottom-8 -left-8 text-center animate-float z-20"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="bg-gradient-to-r from-[#FFCCF2] to-[#EC4899] text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold">
                    Đồng bộ dữ liệu
                  </div>
                </div>

                {/* Bottom Right */}
                <div
                  className="absolute -bottom-8 -right-8 text-center animate-float z-20"
                  style={{ animationDelay: "1.5s" }}
                >
                  <div className="bg-gradient-to-r from-[#10B981] to-[#059669] text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold">
                    Trí tuệ nhân tạo
                  </div>
                </div>

                {/* Globe Container */}
                <div
                  ref={globeRef}
                  className="relative w-full h-full bg-gradient-to-br from-[#0033FF] via-[#1a4f8a] to-[#2d1b69] rounded-full shadow-2xl overflow-hidden group cursor-pointer transform transition-all duration-1000 hover:scale-105 animate-spin"
                  style={{
                    animationDuration: "20s",
                    animationIterationCount: "infinite",
                    animationTimingFunction: "linear",
                  }}
                  onClick={() => (window.location.href = "/members/lists")}
                >
                  {/* Globe Background Pattern */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-8 left-12 w-16 h-16 bg-green-400 rounded-full blur-sm" />
                    <div className="absolute top-20 right-16 w-12 h-12 bg-yellow-400 rounded-full blur-sm" />
                    <div className="absolute bottom-16 left-8 w-20 h-20 bg-orange-400 rounded-full blur-sm" />
                    <div className="absolute bottom-8 right-12 w-14 h-14 bg-red-400 rounded-full blur-sm" />
                    <div className="absolute top-1/3 left-1/4 w-10 h-10 bg-purple-400 rounded-full blur-sm" />
                    <div className="absolute top-2/3 right-1/3 w-8 h-8 bg-pink-400 rounded-full blur-sm" />
                  </div>

                  {/* Grid Lines */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-0 right-0 h-px bg-white" />
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-white" />
                    <div className="absolute top-3/4 left-0 right-0 h-px bg-white" />
                    <div className="absolute top-0 bottom-0 left-1/4 w-px bg-white" />
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white" />
                    <div className="absolute top-0 bottom-0 left-3/4 w-px bg-white" />
                  </div>

                  {/* Expert Pins */}
                  {globalExperts.map((expert, index) => (
                    <div
                      key={expert.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer"
                      style={{
                        left: `${expert.position.x}%`,
                        top: `${expert.position.y}%`,
                      }}
                      onMouseEnter={() => setSelectedExpert(expert)}
                      onMouseLeave={() => setSelectedExpert(null)}
                    >
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg group-hover/pin:scale-150 transition-all duration-300 border-2 border-white animate-pulse">
                          <Image
                            src={expert.avatar}
                            alt={expert.name}
                            width={28}
                            height={28}
                            className="rounded-full object-cover"
                          />
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-4 h-4 bg-yellow-400 rotate-45 opacity-0 group-hover/pin:opacity-100 transition-all duration-300" />

                        {/* Tooltip */}
                        {selectedExpert?.id === expert.id && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-white rounded-lg shadow-xl p-4 min-w-48 z-50 animate-fadeIn">
                            <div className="text-center">
                              <div className="font-bold text-[#0033FF] text-sm">
                                {expert.name}
                              </div>
                              <div className="text-[#0600AF]/70 text-xs">
                                {expert.country}
                              </div>
                              <div className="text-[#977DFF] text-xs font-medium mt-1">
                                {expert.expertise}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Floating Elements - Reduced to avoid clutter with corner texts */}
                <div
                  className="absolute top-1/4 -left-12 w-6 h-6 bg-[#0033FF]/30 rounded-full animate-bounce opacity-40"
                  style={{ animationDelay: "2s", animationDuration: "3s" }}
                />
                <div
                  className="absolute top-3/4 -right-12 w-8 h-8 bg-[#977DFF]/30 rounded-full animate-bounce opacity-40"
                  style={{ animationDelay: "2.5s", animationDuration: "3.5s" }}
                />
              </div>
            </div>
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

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Features Grid */}
            <div className="grid md:grid-cols-2 gap-8">
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

            {/* Right: Video */}
            <div className="relative">
              <div className="relative bg-white/90 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-96 object-cover"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src="/videos/data-background.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Video Control Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    onClick={toggleVideo}
                    size="lg"
                    className="bg-white/20 hover:bg-white/40 text-white border-0 backdrop-blur-sm rounded-full w-16 h-16"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </Button>
                </div>

                {/* Video Info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4">
                    <h3 className="font-bold text-[#0033FF] mb-2">
                      Hệ sinh thái dữ liệu Việt Nam
                    </h3>
                    <p className="text-[#0600AF]/70 text-sm">
                      Khám phá công nghệ tiên tiến và mạng lưới dữ liệu quốc gia
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#977DFF]/20 rounded-full blur-2xl animate-pulse" />
              <div
                className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#FFCCF2]/20 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "1s" }}
              />
            </div>
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
