import type { Metadata } from "next";
import { Calendar, Users, GraduationCap, FileText, Globe } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Hoạt động - Hiệp hội Dữ liệu Quốc gia Việt Nam",
  description:
    "Các hoạt động chính của Hiệp hội Dữ liệu Quốc gia Việt Nam bao gồm sự kiện, chuyên gia toàn cầu, đào tạo, chính sách pháp luật và hợp tác quốc tế.",
};

const events = [
  {
    id: 1,
    title: "Hội thảo Dữ liệu du lịch trong phát triển kinh tế số",
    date: "2025-08-18",
    location: "Hà Nội",
    description:
      "Công bố ra mắt Nền tảng dữ liệu du lịch quốc gia Việt Nam - Visit Vietnam",
    status: "Đã diễn ra",
    image: "/icons/tourism-conference.svg",
  },
  {
    id: 2,
    title: "Triển lãm 6 sản phẩm dữ liệu tiên phong",
    date: "2025-07-04",
    location: "Trụ sở Bộ Công an",
    description:
      "Giới thiệu những nền tảng công nghệ cốt lõi của hệ sinh thái kinh tế số Việt Nam",
    status: "Đã diễn ra",
    image: "/icons/tourism-conference.svg",
  },
  {
    id: 3,
    title: "Hội nghị Ban Chấp hành Hiệp hội Dữ liệu quốc gia",
    date: "2025-09-15",
    location: "Hà Nội",
    description:
      "Sơ kết công tác 6 tháng đầu năm và xây dựng phương hướng công tác 6 tháng cuối năm 2025",
    status: "Sắp diễn ra",
    image: "/icons/tourism-conference.svg",
  },
];

const experts = [
  {
    id: 1,
    name: "TS. Nguyễn Văn Long",
    title: "Thứ trưởng Bộ Công an, Phó Chủ tịch Thường trực Hiệp hội",
    expertise: "An ninh mạng, Quản trị dữ liệu",
    country: "Việt Nam",
    image: "/icons/expert-placeholder.svg",
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    title: "Chuyên gia Blockchain và AI",
    expertise: "Blockchain, Trí tuệ nhân tạo, Dữ liệu lớn",
    country: "Singapore",
    image: "/icons/expert-placeholder.svg",
  },
  {
    id: 3,
    name: "Dr. Sarah Johnson",
    title: "Giám đốc Nghiên cứu Dữ liệu, MIT",
    expertise: "Khoa học dữ liệu, Machine Learning",
    country: "Hoa Kỳ",
    image: "/icons/expert-placeholder.svg",
  },
];

const trainings = [
  {
    id: 1,
    title: "Khóa đào tạo Quản trị Dữ liệu cơ bản",
    duration: "40 giờ",
    level: "Cơ bản",
    format: "Trực tuyến + Thực hành",
    description:
      "Cung cấp kiến thức nền tảng về quản trị dữ liệu, bảo mật và tuân thủ pháp luật",
    nextSession: "2025-09-01",
  },
  {
    id: 2,
    title: "Chứng chỉ Chuyên gia Dữ liệu",
    duration: "120 giờ",
    level: "Nâng cao",
    format: "Tại lớp + Dự án thực tế",
    description:
      "Đào tạo chuyên sâu về phân tích dữ liệu, AI và ứng dụng trong thực tế",
    nextSession: "2025-10-15",
  },
  {
    id: 3,
    title: "Workshop Blockchain và Dữ liệu",
    duration: "16 giờ",
    level: "Trung cấp",
    format: "Thực hành",
    description:
      "Tìm hiểu ứng dụng công nghệ Blockchain trong quản lý và xác thực dữ liệu",
    nextSession: "2025-09-20",
  },
];

const policies = [
  {
    id: 1,
    title: "Nghị định về kết nối, chia sẻ dữ liệu bắt buộc",
    type: "Nghị định",
    status: "Dự thảo",
    date: "2025-08-01",
    description:
      "Quy định về kết nối, chia sẻ dữ liệu giữa các cơ quan trong hệ thống chính trị",
  },
  {
    id: 2,
    title: "Luật Dữ liệu cá nhân",
    type: "Luật",
    status: "Có hiệu lực",
    date: "2023-07-01",
    description:
      "Quy định về bảo vệ dữ liệu cá nhân và quyền riêng tư của công dân",
  },
  {
    id: 3,
    title: "Thông tư hướng dẫn quản lý dữ liệu quốc gia",
    type: "Thông tư",
    status: "Có hiệu lực",
    date: "2024-01-15",
    description:
      "Hướng dẫn chi tiết về quy trình quản lý, khai thác và sử dụng dữ liệu quốc gia",
  },
];

const cooperations = [
  {
    id: 1,
    title: "Hợp tác với ASEAN Data Management Initiative",
    partner: "ASEAN",
    type: "Khu vực",
    status: "Đang thực hiện",
    description:
      "Phát triển khung pháp lý chung về quản lý dữ liệu trong khu vực ASEAN",
    startDate: "2024-03-01",
  },
  {
    id: 2,
    title: "Chương trình trao đổi chuyên gia với Hàn Quốc",
    partner: "K-Data Agency",
    type: "Song phương",
    status: "Đang thực hiện",
    description:
      "Trao đổi kinh nghiệm và chuyển giao công nghệ trong lĩnh vực dữ liệu",
    startDate: "2024-06-15",
  },
  {
    id: 3,
    title: "Dự án Digital Silk Road với Trung Quốc",
    partner: "China Academy of Information",
    type: "Song phương",
    status: "Chuẩn bị",
    description:
      "Hợp tác phát triển hạ tầng dữ liệu và kết nối số trong khuôn khổ Vành đai Con đường",
    startDate: "2025-01-01",
  },
];

export default function HoatDongPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2E6EE] to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r bg-[#0033FF] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Hoạt động của Hiệp hội
            </h1>
            <p className="text-xl text-white mb-8">
              Khám phá các hoạt động đa dạng của Hiệp hội Dữ liệu Quốc gia Việt
              Nam
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge
                variant="secondary"
                className="text-lg px-6 py-3 bg-gradient-to-r from-white/90 to-blue-100 text-[#0033FF] border-0 hover:from-yellow-200 hover:to-amber-100 hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Sự kiện
              </Badge>
              <Badge
                variant="secondary"
                className="text-lg px-6 py-3 bg-gradient-to-r from-cyan-100 to-teal-100 text-[#0033FF] border-0 hover:from-emerald-200 hover:to-green-100 hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold"
              >
                <Users className="w-5 h-5 mr-2" />
                Chuyên gia
              </Badge>
              <Badge
                variant="secondary"
                className="text-lg px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 text-[#0033FF] border-0 hover:from-rose-200 hover:to-pink-200 hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold"
              >
                <GraduationCap className="w-5 h-5 mr-2" />
                Đào tạo
              </Badge>
              <Badge
                variant="secondary"
                className="text-lg px-6 py-3 bg-gradient-to-r from-orange-100 to-yellow-100 text-[#0033FF] border-0 hover:from-amber-200 hover:to-yellow-200 hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold"
              >
                <FileText className="w-5 h-5 mr-2" />
                Chính sách
              </Badge>
              <Badge
                variant="secondary"
                className="text-lg px-6 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 text-[#0033FF] border-0 hover:from-violet-200 hover:to-purple-200 hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold"
              >
                <Globe className="w-5 h-5 mr-2" />
                Hợp tác
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Sự kiện */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-[#FFCCF2] to-[#977DFF] rounded-lg flex items-center justify-center mr-3">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#0033FF]">Sự kiện</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <Card
                key={event.id}
                className="hover:bg-white transform hover:-translate-y-2 hover:shadow-2xl transition-all bg-white border-[#FFCCF2]/30 "
              >
                <div className="aspect-video bg-gradient-to-br from-[#F2E6EE] to-[#FFCCF2]/30 rounded-t-lg flex items-center justify-center">
                  <img
                    src={event.image || "/icons/activities-placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge
                      variant={
                        event.status === "Đã diễn ra" ? "secondary" : "default"
                      }
                      className={
                        event.status === "Đã diễn ra"
                          ? "bg-gradient-to-r from-[#FFCCF2] to-[#977DFF] text-white border-0"
                          : "bg-gradient-to-r from-[#977DFF] to-[#0033FF] text-white border-0"
                      }
                    >
                      {event.status}
                    </Badge>
                    <span className="text-sm text-[#0033FF] font-semibold">
                      {event.date}
                    </span>
                  </div>
                  <CardTitle className="text-lg text-[#0033FF]">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="text-[#0600AF] font-medium">
                    📍 {event.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-[#0033FF]/90 mb-4">{event.description}</p>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-[#FFCCF2] text-[#0033FF] hover:bg-gradient-to-r hover:from-[#FFCCF2] hover:to-[#977DFF] hover:text-white hover:border-0 transition-all duration-300"
                  >
                    Xem chi tiết
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Chuyên gia Toàn cầu */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-[#977DFF] to-[#0033FF] rounded-lg flex items-center justify-center mr-3">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#0033FF]">
              Chuyên gia Toàn cầu
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((expert, index) => (
              <Card
                key={expert.id}
                className="hover:bg-white transform hover:-translate-y-2 hover:shadow-2xl transition-all bg-white border-[#FFCCF2]/30 "
              >
                <CardHeader className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-[#F2E6EE] to-[#FFCCF2]/30 rounded-full flex items-center justify-center border border-[#FFCCF2]/40">
                    <img
                      src={expert.image || "/icons/expert-placeholder.svg"}
                      alt={expert.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <CardTitle className="text-xl text-[#0033FF]">
                    {expert.name}
                  </CardTitle>
                  <CardDescription className="text-[#0600AF] font-medium">
                    {expert.title}
                  </CardDescription>
                  <Badge
                    variant="outline"
                    className="w-fit mx-auto mt-2 border-[#FFCCF2] text-[#0033FF] bg-gradient-to-r from-[#FFCCF2]/20 to-[#F2E6EE]"
                  >
                    🌍 {expert.country}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#0033FF]">
                      Chuyên môn:
                    </h4>
                    <p className="text-[#0033FF]/90">{expert.expertise}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 bg-transparent border-[#FFCCF2] text-[#0033FF] hover:bg-gradient-to-r hover:from-[#FFCCF2] hover:to-[#977DFF] hover:text-white hover:border-0 transition-all duration-300"
                  >
                    Xem hồ sơ
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Đào tạo */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0033FF] to-[#0600AF] rounded-lg flex items-center justify-center mr-3">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#0033FF]">Đào tạo</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainings.map((training, index) => (
              <Card
                key={training.id}
                className="hover:bg-white transform hover:-translate-y-2 hover:shadow-2xl transition-all bg-white border-[#FFCCF2]/30 "
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge
                      variant="outline"
                      className="border-[#FFCCF2] text-[#0033FF] bg-gradient-to-r from-[#FFCCF2]/20 to-[#F2E6EE]"
                    >
                      {training.level}
                    </Badge>
                    <span className="text-sm text-[#0600AF] font-semibold">
                      {training.duration}
                    </span>
                  </div>
                  <CardTitle className="text-xl text-[#0033FF]">
                    {training.title}
                  </CardTitle>
                  <CardDescription className="text-[#0600AF]/90">
                    📚 {training.format}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-[#0033FF]/90 mb-4">
                    {training.description}
                  </p>
                  <div className="bg-gradient-to-r from-[#F2E6EE] to-[#FFCCF2]/30 p-3 rounded-lg mb-4 border border-[#FFCCF2]/40">
                    <p className="text-sm text-[#0033FF] font-semibold">
                      <strong>Khóa tiếp theo:</strong> {training.nextSession}
                    </p>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-[#FFCCF2] to-[#977DFF] hover:from-[#977DFF] hover:to-[#0033FF] text-white border-0 transition-all duration-300">
                    Đăng ký ngay
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Chính sách - Pháp luật */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-[#FFCCF2] to-[#0033FF] rounded-lg flex items-center justify-center mr-3">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#0033FF]">
              Chính sách - Pháp luật
            </h2>
          </div>
          <div className="space-y-4">
            {policies.map((policy, index) => (
              <Card
                key={policy.id}
                className="hover:bg-white transform hover:-translate-y-2 hover:shadow-2xl transition-all bg-white border-[#FFCCF2]/30 "
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge
                          variant="outline"
                          className="border-[#F2E6EE] text-[#0033FF] bg-gradient-to-r from-[#F2E6EE] to-[#FFCCF2]/20"
                        >
                          {policy.type}
                        </Badge>
                        <Badge
                          variant={
                            policy.status === "Có hiệu lực"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            policy.status === "Có hiệu lực"
                              ? "bg-gradient-to-r from-[#FFCCF2] to-[#977DFF] text-white border-0"
                              : "bg-gradient-to-r from-[#977DFF] to-[#0033FF] text-white border-0"
                          }
                        >
                          {policy.status}
                        </Badge>
                        <span className="text-sm text-[#0033FF]/90 font-semibold">
                          {policy.date}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-[#0033FF] mb-2">
                        {policy.title}
                      </h3>
                      <p className="text-[#0033FF]/90">{policy.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#FFCCF2] text-[#0033FF] hover:bg-gradient-to-r hover:from-[#FFCCF2] hover:to-[#977DFF] hover:text-white hover:border-0 transition-all duration-300"
                      >
                        Xem chi tiết
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#977DFF] text-[#0033FF] hover:bg-gradient-to-r hover:from-[#977DFF] hover:to-[#0033FF] hover:text-white hover:border-0 transition-all duration-300"
                      >
                        Tải về
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Hợp tác Quốc tế */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-[#977DFF] to-[#FFCCF2] rounded-lg flex items-center justify-center mr-3">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#0033FF]">
              Hợp tác Quốc tế
            </h2>
          </div>
          <div className="space-y-6">
            {cooperations.map((cooperation, index) => (
              <Card
                key={cooperation.id}
                className="hover:shadow-lg transition-shadow bg-white border-[#977DFF]/30 hover:border-[#FFCCF2]/50"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge
                          variant="outline"
                          className="border-[#F2E6EE] text-[#0033FF] bg-gradient-to-r from-[#F2E6EE] to-[#FFCCF2]/20"
                        >
                          {cooperation.type}
                        </Badge>
                        <Badge
                          variant={
                            cooperation.status === "Đang thực hiện"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            cooperation.status === "Đang thực hiện"
                              ? "bg-gradient-to-r from-[#FFCCF2] to-[#977DFF] text-white border-0"
                              : "bg-gradient-to-r from-[#977DFF] to-[#0033FF] text-white border-0"
                          }
                        >
                          {cooperation.status}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold text-[#0033FF] mb-2">
                        {cooperation.title}
                      </h3>
                      <p className="text-[#0600AF] font-medium mb-2">
                        🤝 {cooperation.partner}
                      </p>
                      <p className="text-[#0033FF]/90 mb-3">
                        {cooperation.description}
                      </p>
                      <p className="text-sm text-[#0033FF]/80 font-medium">
                        <strong>Bắt đầu:</strong> {cooperation.startDate}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#FFCCF2] text-[#0033FF] hover:bg-gradient-to-r hover:from-[#FFCCF2] hover:to-[#977DFF] hover:text-white hover:border-0 transition-all duration-300"
                      >
                        Xem chi tiết
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#977DFF] text-[#0033FF] hover:bg-gradient-to-r hover:from-[#977DFF] hover:to-[#0033FF] hover:text-white hover:border-0 transition-all duration-300"
                      >
                        Báo cáo tiến độ
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
