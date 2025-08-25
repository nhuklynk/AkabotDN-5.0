"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FolderOpen, Tag, FileText } from "lucide-react"
import { useLocale } from "@/hooks/useLocale"

export default function AdminDashboard() {
  const { t } = useLocale()
  const stats = [
    {
      title: t("dashboard.stats.users.title"),
      value: "1,234",
      description: t("dashboard.stats.users.desc"),
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: t("dashboard.stats.resources.title"),
      value: "856",
      description: t("dashboard.stats.resources.desc"),
      icon: FolderOpen,
      color: "text-green-600",
    },
    {
      title: t("dashboard.stats.categories.title"),
      value: "42",
      description: t("dashboard.stats.categories.desc"),
      icon: Tag,
      color: "text-purple-600",
    },
    {
      title: t("dashboard.stats.posts.title"),
      value: "2,341",
      description: t("dashboard.stats.posts.desc"),
      icon: FileText,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">{t("dashboard.title")}</h2>
        <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
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
            <CardTitle>{t("dashboard.recent.title")}</CardTitle>
            <CardDescription>{t("dashboard.recent.desc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">{t("dashboard.recent.userRegistered")}</p>
                <p className="text-xs text-muted-foreground">2 phút trước</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">{t("dashboard.recent.resourceUploaded")}</p>
                <p className="text-xs text-muted-foreground">5 phút trước</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">{t("dashboard.recent.categoryCreated")}</p>
                <p className="text-xs text-muted-foreground">10 phút trước</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">{t("dashboard.recent.postPublished")}</p>
                <p className="text-xs text-muted-foreground">15 phút trước</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t("dashboard.quick.title")}</CardTitle>
            <CardDescription>{t("dashboard.quick.desc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="font-medium">{t("dashboard.quick.createPost")}</div>
              <div className="text-sm text-muted-foreground">{t("dashboard.quick.createPostDesc")}</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="font-medium">{t("dashboard.quick.addUser")}</div>
              <div className="text-sm text-muted-foreground">{t("dashboard.quick.addUserDesc")}</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="font-medium">{t("dashboard.quick.upload")}</div>
              <div className="text-sm text-muted-foreground">{t("dashboard.quick.uploadDesc")}</div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
