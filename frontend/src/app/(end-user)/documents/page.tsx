"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Play, Image as ImageIcon, Users, Calendar, Eye } from "lucide-react";

// Mock Data
const imageData = [
  {
    id: 1,
    title: "Hội nghị Hiệp hội Dữ liệu Quốc gia Việt Nam",
    thumbnail: "/sample-conference-1.svg",
    views: "2,450",
    date: "15/11/2024",
  },
  {
    id: 2,
    title: "Khai trương Trung tâm Dữ liệu Quốc gia",
    thumbnail: "/sample-data-center.svg",
    views: "3,200",
    date: "10/11/2024",
  },
  {
    id: 3,
    title: "Triển lãm Công nghệ Dữ liệu 2024",
    thumbnail: "/sample-event-1.svg",
    views: "1,890",
    date: "08/11/2024",
  },
  {
    id: 4,
    title: "Hội thảo Blockchain và Dữ liệu",
    thumbnail: "/sample-technology-1.svg",
    views: "2,760",
    date: "05/11/2024",
  },
  {
    id: 5,
    title: "Ký kết hợp tác với Sun Group",
    thumbnail: "/sample-partnership-1.svg",
    views: "1,540",
    date: "03/11/2024",
  },
  {
    id: 6,
    title: "Hệ sinh thái Dữ liệu Việt Nam",
    thumbnail: "/vietnam-data-ecosystem.png",
    views: "4,100",
    date: "01/11/2024",
  },
];

const videoData = [
  {
    id: 1,
    title: "Phóng sự: AI Competition trên VTV",
    thumbnail: "/sample-video-1.svg",
    duration: "12:45",
    views: "15,670",
    date: "12/11/2024",
  },
  {
    id: 2,
    title: "Trí tuệ nhân tạo trong kỷ nguyên số",
    thumbnail: "/sample-technology-1.svg",
    duration: "25:30",
    views: "8,920",
    date: "09/11/2024",
  },
  {
    id: 3,
    title: "Hội thảo Quốc tế về Dữ liệu",
    thumbnail: "/sample-conference-1.svg",
    duration: "45:20",
    views: "12,340",
    date: "07/11/2024",
  },
  {
    id: 4,
    title: "Nền tảng Du lịch thông minh",
    thumbnail: "/sample-event-1.svg",
    duration: "18:15",
    views: "6,750",
    date: "04/11/2024",
  },
  {
    id: 5,
    title: "Ký kết hợp tác với Bộ Công an",
    thumbnail: "/sample-partnership-1.svg",
    duration: "08:30",
    views: "9,480",
    date: "02/11/2024",
  },
  {
    id: 6,
    title: "Định danh số Việt Nam",
    thumbnail: "/sample-data-center.svg",
    duration: "22:10",
    views: "11,230",
    date: "30/10/2024",
  },
];

const stats = [
  { number: "2,500+", label: "Hình ảnh", icon: ImageIcon },
  { number: "850+", label: "Video", icon: Play },
  { number: "180+", label: "Sự kiện", icon: Calendar },
  { number: "500K+", label: "Lượt xem", icon: Eye },
];

export default function TuLieuPage() {
  const [activeTab, setActiveTab] = useState<"images" | "videos">("images");

  const data = activeTab === "images" ? imageData : videoData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Thư viện Tư liệu</h1>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Khám phá bộ sưu tập hình ảnh và video đầy đủ về các hoạt động của
            Hiệp hội Dữ liệu Quốc gia Việt Nam
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center min-w-[140px]"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-white" />
                <div className="text-3xl font-bold mb-1">{stat.number}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl p-2 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab("images")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "images"
                  ? "bg-white text-purple-600 shadow-lg"
                  : "text-white hover:bg-white/20"
              }`}
            >
              <ImageIcon className="w-5 h-5" />
              Hình ảnh
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "videos"
                  ? "bg-white text-purple-600 shadow-lg"
                  : "text-white hover:bg-white/20"
              }`}
            >
              <Play className="w-5 h-5" />
              Video
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((item, index) => (
              <Card
                key={item.id}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer bg-white"
              >
                <div className="relative overflow-hidden">
                  <div className="relative w-full h-64">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Video Duration for videos */}
                    {activeTab === "videos" && "duration" in item && (
                      <div className="absolute top-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
                        {(item as any).duration}
                      </div>
                    )}

                    {/* Play Button for videos */}
                    {activeTab === "videos" && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 rounded-full p-4 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                          <Play className="w-8 h-8 text-purple-600 ml-1" />
                        </div>
                      </div>
                    )}

                    {/* View Count Badge */}
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {item.views}
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-purple-600 transition-colors duration-300">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {item.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {Math.floor(Math.random() * 50) + 10} người tham gia
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-16">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              Xem thêm tư liệu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
