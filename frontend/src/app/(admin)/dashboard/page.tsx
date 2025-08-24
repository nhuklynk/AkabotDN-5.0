import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FolderOpen, Tag, FileText } from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Tổng người dùng",
      value: "1,234",
      description: "+12% so với tháng trước",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Tài nguyên",
      value: "856",
      description: "+8% so với tháng trước",
      icon: FolderOpen,
      color: "text-green-600",
    },
    {
      title: "Danh mục",
      value: "42",
      description: "+3 mới tháng này",
      icon: Tag,
      color: "text-purple-600",
    },
    {
      title: "Bài viết",
      value: "2,341",
      description: "+18% so với tháng trước",
      icon: FileText,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Bảng điều khiển</h2>
        <p className="text-muted-foreground">Tổng quan số liệu quản trị và thao tác nhanh.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>Các thao tác mới nhất trong bảng quản trị.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Người dùng mới đăng ký</p>
                <p className="text-xs text-muted-foreground">2 phút trước</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Tải lên tài nguyên</p>
                <p className="text-xs text-muted-foreground">5 phút trước</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Tạo danh mục</p>
                <p className="text-xs text-muted-foreground">10 phút trước</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Xuất bản bài viết</p>
                <p className="text-xs text-muted-foreground">15 phút trước</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
            <CardDescription>Các tác vụ thường dùng.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="font-medium">Tạo bài viết mới</div>
              <div className="text-sm text-muted-foreground">Thêm bài viết blog mới</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="font-medium">Thêm người dùng</div>
              <div className="text-sm text-muted-foreground">Tạo tài khoản người dùng</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="font-medium">Tải lên tài nguyên</div>
              <div className="text-sm text-muted-foreground">Thêm tệp hoặc media mới</div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
