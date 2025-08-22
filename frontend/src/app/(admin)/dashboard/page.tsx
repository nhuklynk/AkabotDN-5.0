import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FolderOpen, Tag, FileText } from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      description: "+12% from last month",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Resources",
      value: "856",
      description: "+8% from last month",
      icon: FolderOpen,
      color: "text-green-600",
    },
    {
      title: "Categories",
      value: "42",
      description: "+3 new this month",
      icon: Tag,
      color: "text-purple-600",
    },
    {
      title: "Posts",
      value: "2,341",
      description: "+18% from last month",
      icon: FileText,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your admin panel statistics and quick actions.</p>
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
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions performed in the admin panel.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New user registered</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Resource uploaded</p>
                <p className="text-xs text-muted-foreground">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Category created</p>
                <p className="text-xs text-muted-foreground">10 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Post published</p>
                <p className="text-xs text-muted-foreground">15 minutes ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to perform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="font-medium">Create New Post</div>
              <div className="text-sm text-muted-foreground">Add a new blog post</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="font-medium">Add User</div>
              <div className="text-sm text-muted-foreground">Create a new user account</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="font-medium">Upload Resource</div>
              <div className="text-sm text-muted-foreground">Add new files or media</div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
