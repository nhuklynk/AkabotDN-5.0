"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Calendar,
  Tag,
  Globe,
  X,
  FileText,
  Users,
  Package,
  MessageCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock data for search results
const mockSearchResults = [
  {
    id: 1,
    type: "post",
    title: "Visit Vietnam - Bước tiến chiến lược của du lịch số",
    excerpt:
      'Tại Hội thảo "Dữ liệu du lịch trong phát triển kinh tế số", Hiệp hội Dữ liệu quốc gia, Cục Du lịch quốc gia Việt Nam cùng Tập đoàn Sun Group đã chính thức công bố ra mắt Nền tảng dữ liệu du lịch quốc gia Việt Nam mang tên Visit Vietnam.',
    category: "Công nghệ",
    date: "2025-01-15",
    language: "vi",
    url: "/bai-dang/visit-vietnam-buoc-tien-chien-luoc",
  },
  {
    id: 2,
    type: "post",
    title:
      "AI thực chiến - Cuộc thi về trí tuệ nhân tạo đầu tiên trên sóng truyền hình",
    excerpt:
      'Chiều ngày 5/8, tại Hà Nội, Trung tâm Dữ liệu quốc gia (NDC), Hiệp hội Dữ liệu quốc gia tổ chức cuộc thi "AI thực chiến" - cuộc thi về trí tuệ nhân tạo đầu tiên được phát sóng trực tiếp trên truyền hình.',
    category: "Trí tuệ nhân tạo",
    date: "2025-01-10",
    language: "vi",
    url: "/bai-dang/ai-thuc-chien-cuoc-thi",
  },
  {
    id: 3,
    type: "member",
    title: "CÔNG TY CỔ PHẦN APPOTAPAY",
    excerpt:
      "Công ty công nghệ thanh toán hàng đầu Việt Nam, chuyên cung cấp các giải pháp thanh toán số và ví điện tử.",
    category: "Công ty",
    date: "2024-12-01",
    language: "vi",
    url: "/hoi-vien/danh-sach",
  },
  {
    id: 4,
    type: "product",
    title: "Nền tảng Chuỗi khối quốc gia",
    excerpt:
      "Hệ thống blockchain quốc gia hỗ trợ xác thực và truy xuất nguồn gốc, đảm bảo tính minh bạch và an toàn cho dữ liệu.",
    category: "Blockchain",
    date: "2024-11-15",
    language: "vi",
    url: "/san-pham-so",
  },
  {
    id: 5,
    type: "faq",
    title: "Làm thế nào để đăng ký thành viên Hiệp hội?",
    excerpt:
      "Để đăng ký thành viên Hiệp hội Dữ liệu quốc gia, bạn cần điền đầy đủ thông tin trong mẫu đơn đăng ký và nộp các giấy tờ liên quan.",
    category: "Hội viên",
    date: "2024-10-20",
    language: "vi",
    url: "/faq",
  },
];

const categories = [
  "Tất cả",
  "Công nghệ",
  "Trí tuệ nhân tạo",
  "Blockchain",
  "Hội viên",
  "Dữ liệu",
];
const contentTypes = ["Tất cả", "Bài viết", "Hội viên", "Sản phẩm", "FAQ"];
const languages = ["Tất cả", "Tiếng Việt", "English"];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "post":
      return <FileText className="h-4 w-4" />;
    case "member":
      return <Users className="h-4 w-4" />;
    case "product":
      return <Package className="h-4 w-4" />;
    case "faq":
      return <MessageCircle className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "post":
      return "Bài viết";
    case "member":
      return "Hội viên";
    case "product":
      return "Sản phẩm";
    case "faq":
      return "FAQ";
    default:
      return "Khác";
  }
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedType, setSelectedType] = useState("Tất cả");
  const [selectedLanguage, setSelectedLanguage] = useState("Tất cả");
  const [dateRange, setDateRange] = useState("Tất cả");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Filter and search logic
  const filteredResults = useMemo(() => {
    return mockSearchResults.filter((item) => {
      const matchesQuery =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "Tất cả" || item.category === selectedCategory;

      const matchesType =
        selectedType === "Tất cả" ||
        (selectedType === "Bài viết" && item.type === "post") ||
        (selectedType === "Hội viên" && item.type === "member") ||
        (selectedType === "Sản phẩm" && item.type === "product") ||
        (selectedType === "FAQ" && item.type === "faq");

      const matchesLanguage =
        selectedLanguage === "Tất cả" ||
        (selectedLanguage === "Tiếng Việt" && item.language === "vi") ||
        (selectedLanguage === "English" && item.language === "en");

      return matchesQuery && matchesCategory && matchesType && matchesLanguage;
    });
  }, [searchQuery, selectedCategory, selectedType, selectedLanguage]);

  const clearFilters = () => {
    setSelectedCategory("Tất cả");
    setSelectedType("Tất cả");
    setSelectedLanguage("Tất cả");
    setDateRange("Tất cả");
  };

  const hasActiveFilters =
    selectedCategory !== "Tất cả" ||
    selectedType !== "Tất cả" ||
    selectedLanguage !== "Tất cả" ||
    dateRange !== "Tất cả";

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20" />
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Tìm kiếm thông tin
            </h1>
            <p className="text-xl text-emerald-100 mb-8">
              Tìm kiếm toàn bộ nội dung của Hiệp hội Dữ liệu Quốc gia
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Nhập từ khóa tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 py-4 text-lg bg-white/95 backdrop-blur-sm border-0 rounded-2xl shadow-lg focus:ring-2 focus:ring-emerald-300"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Filter Toggle */}
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc{" "}
                {hasActiveFilters &&
                  `(${
                    [
                      selectedCategory,
                      selectedType,
                      selectedLanguage,
                      dateRange,
                    ].filter((f) => f !== "Tất cả").length
                  })`}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-white/10 backdrop-blur-sm border-t border-white/20">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <Tag className="h-4 w-4 inline mr-1" />
                  Danh mục
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="bg-white/90">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <FileText className="h-4 w-4 inline mr-1" />
                  Loại nội dung
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-white/90">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <Globe className="h-4 w-4 inline mr-1" />
                  Ngôn ngữ
                </label>
                <Select
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                >
                  <SelectTrigger className="bg-white/90">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Thời gian
                </label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="bg-white/90">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tất cả">Tất cả</SelectItem>
                    <SelectItem value="Hôm nay">Hôm nay</SelectItem>
                    <SelectItem value="Tuần này">Tuần này</SelectItem>
                    <SelectItem value="Tháng này">Tháng này</SelectItem>
                    <SelectItem value="Năm này">Năm này</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex justify-between items-center mt-4">
                <div className="flex flex-wrap gap-2">
                  {selectedCategory !== "Tất cả" && (
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white"
                    >
                      {selectedCategory}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => setSelectedCategory("Tất cả")}
                      />
                    </Badge>
                  )}
                  {selectedType !== "Tất cả" && (
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white"
                    >
                      {selectedType}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => setSelectedType("Tất cả")}
                      />
                    </Badge>
                  )}
                  {selectedLanguage !== "Tất cả" && (
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white"
                    >
                      {selectedLanguage}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => setSelectedLanguage("Tất cả")}
                      />
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-white hover:bg-white/10"
                >
                  Xóa tất cả bộ lọc
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Results Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Kết quả tìm kiếm
                  {searchQuery && (
                    <span className="text-emerald-600">
                      {" "}
                      cho "{searchQuery}"
                    </span>
                  )}
                </h2>
                <p className="text-gray-600 mt-1">
                  Tìm thấy {filteredResults.length} kết quả
                </p>
              </div>
            </div>
          </div>

          {/* Results Content */}
          <div className="p-6">
            {filteredResults.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Không tìm thấy kết quả
                </h3>
                <p className="text-gray-600 mb-4">
                  Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc
                </p>
                {hasActiveFilters && (
                  <Button onClick={clearFilters} variant="outline">
                    Xóa tất cả bộ lọc
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredResults.map((result) => (
                  <Card
                    key={result.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(result.type)}
                          <Badge variant="secondary" className="text-xs">
                            {getTypeLabel(result.type)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {result.category}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(result.date).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <CardTitle className="text-xl hover:text-emerald-600 transition-colors">
                        <a href={result.url}>{result.title}</a>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 leading-relaxed">
                        {result.excerpt}
                      </CardDescription>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {result.language === "vi"
                              ? "Tiếng Việt"
                              : "English"}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={result.url}>Xem chi tiết →</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
