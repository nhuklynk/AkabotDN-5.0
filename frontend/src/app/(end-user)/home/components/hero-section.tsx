"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Calendar, Award } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F2E6EE] via-[#FFCCF2] to-[#977DFF]"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Hiệp hội Dữ liệu</span>
              <br />
              <span className="text-[#FFCCF2]">Quốc gia Việt Nam</span>
            </h1>

            <p className="text-xl text-white mb-8 max-w-2xl lg:mx-0 mx-auto">
              Kết nối cộng đồng dữ liệu, xây dựng hệ sinh thái số bền vững và
              thúc đẩy phát triển kinh tế số Việt Nam trong kỷ nguyên công nghệ
              4.0
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="text-base bg-gradient-to-r from-[#FFCCF2] to-[#977DFF] hover:from-[#977DFF] hover:to-[#0033FF] text-white border-0 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Tìm hiểu thêm
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="text-base border-2 border-[#FFCCF2] text-[#FFCCF2] hover:bg-gradient-to-r hover:from-[#FFCCF2] hover:to-[#F2E6EE] hover:text-[#0033FF] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Đăng ký hội viên
              </Button>
            </div>
          </div>

          {/* Right Column - Stats & Image */}
          <div className="relative">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-br from-[#FFCCF2]/30 to-[#F2E6EE]/40 backdrop-blur-sm rounded-2xl p-6 text-center border border-[#FFCCF2]/40 hover:from-[#FFCCF2]/50 hover:to-[#F2E6EE]/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FFCCF2] to-[#977DFF] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-[#0033FF] mb-1">
                  500+
                </div>
                <div className="text-sm text-[#0600AF] font-medium">
                  Hội viên
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#F2E6EE]/40 to-[#FFCCF2]/30 backdrop-blur-sm rounded-2xl p-6 text-center border border-[#FFCCF2]/40 hover:from-[#F2E6EE]/50 hover:to-[#FFCCF2]/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-[#977DFF] to-[#0033FF] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-[#0033FF] mb-1">
                  50+
                </div>
                <div className="text-sm text-[#0600AF] font-medium">
                  Sự kiện/năm
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#FFCCF2]/30 to-[#F2E6EE]/40 backdrop-blur-sm rounded-2xl p-6 text-center border border-[#FFCCF2]/40 hover:from-[#FFCCF2]/50 hover:to-[#F2E6EE]/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-[#F2E6EE] to-[#FFCCF2] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-[#0033FF]" />
                </div>
                <div className="text-2xl font-bold text-[#0033FF] mb-1">
                  100+
                </div>
                <div className="text-sm text-[#0600AF] font-medium">
                  Đối tác
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#F2E6EE]/40 to-[#FFCCF2]/30 backdrop-blur-sm rounded-2xl p-6 text-center border border-[#FFCCF2]/40 hover:from-[#F2E6EE]/50 hover:to-[#FFCCF2]/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FFCCF2] to-[#977DFF] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-[#0033FF] mb-1">
                  10K+
                </div>
                <div className="text-sm text-[#0600AF] font-medium">
                  Lượt truy cập
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#FFCCF2]/30 to-[#977DFF]/30 rounded-2xl p-8 border border-[#FFCCF2]/40 backdrop-blur-sm">
                <div className="aspect-video bg-gradient-to-br from-[#F2E6EE] to-[#FFCCF2]/20 rounded-xl flex items-center justify-center">
                  <img
                    src="/icons/vietnam-data-ecosystem.svg"
                    alt="Hệ sinh thái dữ liệu Việt Nam"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-[#0033FF] font-medium">
                    Hệ sinh thái dữ liệu quốc gia
                  </p>
                  <p className="text-[#0600AF]/90 text-sm">
                    Kết nối và chia sẻ dữ liệu toàn quốc
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
