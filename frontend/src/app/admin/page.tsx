import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FolderOpen, Tag, FileText } from "lucide-react"

const stats = [
  {
    title: "Tổng người dùng",
    value: "1,234",
    description: "Người dùng đang hoạt động",
    icon: Users,
    color: "text-chart-1",
  },
  {
    title: "Tài nguyên",
    value: "567",
    description: "Tài nguyên khả dụng",
    icon: FolderOpen,
    color: "text-chart-2",
  },
  {
    title: "Danh mục",
    value: "89",
    description: "Danh mục nội dung",
    icon: Tag,
    color: "text-chart-3",
  },
  {
    title: "Bài viết",
    value: "2,345",
    description: "Bài viết đã xuất bản",
    icon: FileText,
    color: "text-chart-4",
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bảng điều khiển</h1>
        <p className="text-muted-foreground">Tổng quan số liệu và thao tác nhanh.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>Các thao tác mới nhất trong bảng quản trị</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-chart-1"></div>
                <span className="text-sm text-card-foreground">Người dùng mới đăng ký</span>
                <span className="text-xs text-muted-foreground ml-auto">2 phút trước</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-chart-2"></div>
                <span className="text-sm text-card-foreground">Cập nhật tài nguyên</span>
                <span className="text-xs text-muted-foreground ml-auto">5 phút trước</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-chart-3"></div>
                <span className="text-sm text-card-foreground">Xuất bản bài viết mới</span>
                <span className="text-xs text-muted-foreground ml-auto">10 phút trước</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trạng thái hệ thống</CardTitle>
            <CardDescription>Tình trạng hoạt động hiện tại</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-card-foreground">Cơ sở dữ liệu</span>
                <span className="text-sm text-chart-5">Ổn định</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-card-foreground">Trạng thái API</span>
                <span className="text-sm text-chart-5">Trực tuyến</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-card-foreground">Lưu trữ</span>
                <span className="text-sm text-chart-4">Đã dùng 85%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
