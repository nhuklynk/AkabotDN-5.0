import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Shield,
  Database,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Instagram,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PartnersList } from "@/components/partners-list";
import Image from "next/image";

// Mock data for products
const products = {
  "san-giao-dich": {
    id: "san-giao-dich",
    title: "Sàn giao dịch",
    description:
      "Nền tảng giao dịch số hiện đại với công nghệ blockchain tiên tiến",
    image: "/placeholder-6a0xs.png",
    features: [
      "Đầu tiên tại Việt Nam",
      "Minh bạch",
      "An Toàn",
      "Tuân thủ Pháp lý",
      "Thiết kế, xây dựng và vận hành bởi người Việt",
    ],
    icon: <Globe className="w-8 h-8" />,
    tag: "ĐỘ LIỆU QUỐC GIA",
    longDescription:
      "Sàn giao dịch đầu tiên tại Việt Nam được thiết kế, xây dựng và vận hành hoàn toàn bởi người Việt. Nền tảng này đảm bảo tính minh bạch, an toàn và tuân thủ đầy đủ các quy định pháp lý hiện hành.",
  },
  "nen-tang-blockchain": {
    id: "nen-tang-blockchain",
    title: "Nền tảng Chuỗi khối quốc gia",
    description:
      "Hạ tầng blockchain quốc gia đáng tin cậy cho các dịch vụ công",
    image: "/blockchain-data-center.png",
    features: [
      "Tính minh bạch cao",
      "Bảo mật tuyệt đối",
      "Khả năng mở rộng",
      "Tuân thủ pháp luật",
      "Hỗ trợ đa dịch vụ",
    ],
    icon: <Database className="w-8 h-8" />,
    tag: "BLOCKCHAIN QUỐC GIA",
    longDescription:
      "Nền tảng blockchain quốc gia được thiết kế để hỗ trợ các dịch vụ công, đảm bảo tính minh bạch, bảo mật và khả năng mở rộng cho toàn bộ hệ thống.",
  },
  "ung-dung-dinh-danh": {
    id: "ung-dung-dinh-danh",
    title: "Ứng dụng định danh phi tập trung Quốc gia",
    description: "Giải pháp định danh số an toàn và bảo mật cho công dân",
    image: "/digital-identity-biometric.png",
    features: [
      "Định danh an toàn",
      "Xác thực sinh trắc học",
      "Bảo vệ dữ liệu cá nhân",
      "Tích hợp dễ dàng",
      "Tuân thủ tiêu chuẩn quốc tế",
    ],
    icon: <Shield className="w-8 h-8" />,
    tag: "ĐỊNH DANH SỐ",
    longDescription:
      "Ứng dụng định danh phi tập trung quốc gia cung cấp giải pháp định danh số an toàn, sử dụng công nghệ sinh trắc học tiên tiến và đảm bảo bảo vệ dữ liệu cá nhân.",
  },
};

// Mock news data
const relatedNews = [
  {
    title:
      '"AI thực chiến" - Cuộc thi về trí tuệ nhân tạo đầu tiên trên sóng truyền',
    excerpt: "Cuộc thi về AI đầu tiên được phát sóng trực tiếp...",
  },
  {
    title:
      "Hiệp hội Dữ liệu quốc gia công bố quyết định thành lập Văn phòng, các",
    excerpt: "Quyết định quan trọng trong việc mở rộng hoạt động...",
  },
  {
    title: "Danh sách Ban Thường vụ Hiệp hội Dữ liệu quốc gia (2025-2030)",
    excerpt: "Ban lãnh đạo mới cho nhiệm kỳ 2025-2030...",
  },
  {
    title: "Điều lệ hoạt động của Hiệp hội Dữ liệu quốc gia",
    excerpt: "Quy định chi tiết về hoạt động của hiệp hội...",
  },
  {
    title:
      "Danh sách 62 thành viên Ban Chấp hành Hiệp hội Dữ liệu quốc gia nhiệm",
    excerpt: "Danh sách đầy đủ các thành viên ban chấp hành...",
  },
];

// Related products
const relatedProducts = [
  {
    id: "san-giao-dich",
    title: "Sàn giao dịch",
    image: "/placeholder-6a0xs.png",
  },
  {
    id: "ung-dung-dinh-danh",
    title: "Ứng dụng định danh phi tập trung Quốc gia",
    image: "/digital-identity-biometric.png",
  },
];

// Partners data
const partners = [
  {
    name: "Cục Du lịch quốc gia Việt Nam",
    logo: "/partner-tourism-bureau.png",
    description: "Cơ quan quản lý du lịch quốc gia",
  },
  {
    name: "Tập đoàn Sun Group",
    logo: "/partner-sun-group.png",
    description: "Tập đoàn đầu tư và phát triển du lịch hàng đầu",
  },
  {
    name: "Bộ Công an",
    logo: "/partner-ministry-security.png",
    description: "Đối tác công nghệ và bảo mật dữ liệu",
  },
  {
    name: "Trung tâm Dữ liệu Quốc gia",
    logo: "/partner-national-data-center.png",
    description: "Trung tâm quản lý và vận hành dữ liệu quốc gia",
  },
];

export default function DigitalProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = products[params.slug as keyof typeof products];

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-red-600 hover:underline font-semibold"
            >
              SẢN PHẨM SỐ
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Product Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {product.title}
            </h1>

            {/* Product Image */}
            <div className="mb-8">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                width={800}
                height={320}
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>

            {/* Product Details */}
            <div className="space-y-4 mb-8">
              {product.features.map((feature, index) => (
                <div key={index} className="text-gray-700">
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
              <p className="text-gray-600 mt-4">{product.longDescription}</p>
            </div>

            {/* Social Sharing */}
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <Twitter className="w-4 h-4 text-blue-400" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <Linkedin className="w-4 h-4 text-blue-600" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <Facebook className="w-4 h-4 text-blue-700" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <Youtube className="w-4 h-4 text-red-600" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <Instagram className="w-4 h-4 text-pink-600" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <MessageCircle className="w-4 h-4 text-gray-600" />
              </Button>
            </div>

            {/* Product Tag */}
            <div className="mb-8">
              <Badge variant="destructive" className="bg-red-600">
                {product.tag}
              </Badge>
            </div>

            {/* Related Products */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-red-600 mb-6">
                SẢN PHẨM LIÊN QUAN
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/san-pham-so/${relatedProduct.id}`}
                  >
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <Image
                          src={relatedProduct.image || "/placeholder.svg"}
                          alt={relatedProduct.title}
                          width={300}
                          height={128}
                          className="w-full h-32 object-cover rounded-lg mb-4"
                        />
                        <h3 className="font-semibold text-gray-900">
                          {relatedProduct.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {relatedProduct.title}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">TIN ĐỌC NHIỀU</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedNews.map((news, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 pb-4 last:border-b-0"
                  >
                    <h4 className="font-medium text-sm text-gray-900 mb-2 leading-tight">
                      {news.title}
                    </h4>
                    <p className="text-xs text-gray-600">{news.excerpt}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Partners Section */}
        <div className="mt-8">
          <PartnersList partners={partners} />
        </div>
      </div>
    </div>
  );
}
