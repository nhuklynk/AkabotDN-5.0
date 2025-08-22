import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Shield,
  Bot,
  Mail,
  Phone,
  MapPin,
  Users,
  Database,
  Network,
  CheckCircle,
  Award,
} from "lucide-react";
import Link from "next/link";
import { PartnersList } from "@/components/partners-list";
import Image from "next/image";

export default function DigitalProductsPage() {
  const digitalProducts = [
    {
      id: "san-giao-dich",
      title: "Sàn giao dịch",
      description:
        "Nền tảng giao dịch số hiện đại với công nghệ blockchain tiên tiến",
      image: "/trading-platform.svg",
      features: ["Bảo mật cao", "Giao dịch nhanh", "Phí thấp", "Hỗ trợ 24/7"],
      icon: <Globe className="w-8 h-8" />,
    },
    {
      id: "nen-tang-blockchain",
      title: "Nền tảng Chuỗi khối quốc gia",
      description:
        "Hạ tầng blockchain quốc gia đáng tin cậy cho các dịch vụ công",
      image: "/blockchain-platform.svg",
      features: [
        "Tính minh bạch",
        "Bảo mật tuyệt đối",
        "Khả năng mở rộng",
        "Tuân thủ pháp luật",
      ],
      icon: <Database className="w-8 h-8" />,
    },
    {
      id: "ung-dung-dinh-danh",
      title: "Ứng dụng định danh phi tập trung Quốc gia",
      description: "Giải pháp định danh số an toàn và bảo mật cho công dân",
      image: "/blockchain-platform.svg",
      features: [
        "Định danh an toàn",
        "Xác thực sinh trắc học",
        "Bảo vệ dữ liệu",
        "Tích hợp dễ dàng",
      ],
      icon: <Shield className="w-8 h-8" />,
    },
    {
      id: "tro-ly-ao",
      title: "Trợ lý ảo quốc gia",
      description: "AI chatbot thông minh hỗ trợ dịch vụ công trực tuyến",
      image: "/blockchain-platform.svg",
      features: [
        "AI thông minh",
        "Đa ngôn ngữ",
        "Phản hồi nhanh",
        "Học máy liên tục",
      ],
      icon: <Bot className="w-8 h-8" />,
    },
    {
      id: "he-thong-email",
      title: "Hệ thống Thư điện tử quốc gia",
      description: "Hệ thống email bảo mật cao cho các cơ quan nhà nước",
      image: "/blockchain-platform.svg",
      features: [
        "Bảo mật cao",
        "Mã hóa đầu cuối",
        "Lưu trữ an toàn",
        "Quản lý tập trung",
      ],
      icon: <Mail className="w-8 h-8" />,
    },
  ];

  const relatedServices = [
    {
      id: "consulting",
      title: "Tư vấn chuyển đổi số",
      description:
        "Hỗ trợ doanh nghiệp trong quá trình chuyển đổi số toàn diện",
      icon: <Users className="w-6 h-6" />,
    },
    {
      id: "integration",
      title: "Tích hợp hệ thống",
      description: "Kết nối và tích hợp các hệ thống hiện có với giải pháp mới",
      icon: <Network className="w-6 h-6" />,
    },
    {
      id: "training",
      title: "Đào tạo và hỗ trợ",
      description: "Chương trình đào tạo chuyên sâu về công nghệ số",
      icon: <Award className="w-6 h-6" />,
    },
  ];

  const partners = [
    {
      name: "Cục Du lịch quốc gia Việt Nam",
      logo: "/partner-tourism-bureau.svg",
      description: "Cơ quan quản lý du lịch quốc gia",
    },
    {
      name: "Tập đoàn Sun Group",
      logo: "/partner-sun-group.svg",
      description: "Tập đoàn đầu tư và phát triển du lịch hàng đầu",
    },
    {
      name: "Bộ Công an",
      logo: "/partner-ministry-security.svg",
      description: "Đối tác công nghệ và bảo mật dữ liệu",
    },
    {
      name: "Trung tâm Dữ liệu Quốc gia",
      logo: "/partner-national-data-center.svg",
      description: "Trung tâm quản lý và vận hành dữ liệu quốc gia",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">SẢN PHẨM SỐ</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Khám phá các giải pháp công nghệ tiên tiến của Hiệp hội Dữ liệu Việt
            Nam, góp phần thúc đẩy chuyển đổi số quốc gia
          </p>
          <Button size="lg" variant="secondary">
            Khám phá ngay
          </Button>
        </div>
      </section>

      {/* Digital Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Triển lãm ảo sản phẩm hiệp hội
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tham quan các sản phẩm số hàng đầu được phát triển bởi Hiệp hội Dữ
              liệu Việt Nam
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {digitalProducts.map((product) => (
              <Card
                key={product.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      {product.icon}
                    </div>
                    <Badge variant="outline">Sản phẩm số</Badge>
                  </div>
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-900 mb-3">
                      Điểm mạnh dịch vụ:
                    </h4>
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={`/digital-product/${product.id}`}>
                    <Button
                      className="w-full mt-4 bg-transparent"
                      variant="outline"
                    >
                      Tìm hiểu thêm
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services Tabs */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Dịch vụ liên quan
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Các dịch vụ hỗ trợ và tư vấn chuyên nghiệp từ đội ngũ chuyên gia
            </p>
          </div>

          <Tabs defaultValue="consulting" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              {relatedServices.map((service) => (
                <TabsTrigger
                  key={service.id}
                  value={service.id}
                  className="flex items-center gap-2"
                >
                  {service.icon}
                  <span className="hidden sm:inline">{service.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {relatedServices.map((service) => (
              <TabsContent key={service.id} value={service.id} className="mt-8">
                <Card>
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-blue-100 rounded-full text-blue-600">
                        {service.icon}
                      </div>
                    </div>
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                    <CardDescription className="text-lg">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button size="lg">Liên hệ tư vấn</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Liên hệ</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kết nối với chúng tôi để được tư vấn và hỗ trợ tốt nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-green-100 rounded-full text-green-600">
                    <Phone className="w-8 h-8" />
                  </div>
                </div>
                <h4 className="font-semibold text-lg mb-2">Điện thoại</h4>
                <p className="text-gray-600">+84 24 3936 1234</p>
                <p className="text-gray-600">+84 24 3936 5678</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-blue-100 rounded-full text-blue-600">
                    <Mail className="w-8 h-8" />
                  </div>
                </div>
                <h4 className="font-semibold text-lg mb-2">Email</h4>
                <p className="text-gray-600">info@vda.org.vn</p>
                <p className="text-gray-600">support@vda.org.vn</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-red-100 rounded-full text-red-600">
                    <MapPin className="w-8 h-8" />
                  </div>
                </div>
                <h4 className="font-semibold text-lg mb-2">Địa chỉ</h4>
                <p className="text-gray-600">Tầng 15, Tòa nhà Keangnam</p>
                <p className="text-gray-600">Phạm Hùng, Cầu Giấy, Hà Nội</p>
              </CardContent>
            </Card>
          </div>

          {/* Partners Section */}
          <div className="mt-8">
            <PartnersList partners={partners as any} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h4 className="text-2xl font-bold mb-4">
              Hiệp hội Dữ liệu Việt Nam
            </h4>
            <p className="text-gray-400 mb-6">
              Dẫn đầu trong việc phát triển và ứng dụng công nghệ số tại Việt
              Nam
            </p>
            <div className="flex justify-center space-x-6">
              <Button variant="ghost" size="sm">
                Về chúng tôi
              </Button>
              <Button variant="ghost" size="sm">
                Dịch vụ
              </Button>
              <Button variant="ghost" size="sm">
                Tin tức
              </Button>
              <Button variant="ghost" size="sm">
                Liên hệ
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
