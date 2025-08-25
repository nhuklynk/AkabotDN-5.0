"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FolderOpen, Tag, FileText } from "lucide-react"
import { useLocale } from "@/hooks/useLocale"

const buildStats = (t: (k: string, o?: any) => string) => [
  {
    title: t("dashboard.stats.users.title"),
    value: "1,234",
    description: t("dashboard.stats.users.desc"),
    icon: Users,
    color: "text-chart-1",
  },
  {
    title: t("dashboard.stats.resources.title"),
    value: "567",
    description: t("dashboard.stats.resources.desc"),
    icon: FolderOpen,
    color: "text-chart-2",
  },
  {
    title: t("dashboard.stats.categories.title"),
    value: "89",
    description: t("dashboard.stats.categories.desc"),
    icon: Tag,
    color: "text-chart-3",
  },
  {
    title: t("dashboard.stats.posts.title"),
    value: "2,345",
    description: t("dashboard.stats.posts.desc"),
    icon: FileText,
    color: "text-chart-4",
  },
]

export default function AdminDashboard() {
  const { t } = useLocale()
  const stats = buildStats(t)
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
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
            <CardTitle>{t("dashboard.recent.title")}</CardTitle>
            <CardDescription>{t("dashboard.recent.desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-chart-1"></div>
                <span className="text-sm text-card-foreground">{t("dashboard.recent.userRegistered")}</span>
                <span className="text-xs text-muted-foreground ml-auto">2 phút trước</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-chart-2"></div>
                <span className="text-sm text-card-foreground">{t("dashboard.recent.resourceUploaded")}</span>
                <span className="text-xs text-muted-foreground ml-auto">5 phút trước</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-chart-3"></div>
                <span className="text-sm text-card-foreground">{t("dashboard.recent.postPublished")}</span>
                <span className="text-xs text-muted-foreground ml-auto">10 phút trước</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.quick.title")}</CardTitle>
            <CardDescription>{t("dashboard.quick.desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-card-foreground">{t("dashboard.quick.createPost")}</span>
                <span className="text-sm text-chart-5">{t("dashboard.quick.createPostDesc")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-card-foreground">{t("dashboard.quick.addUser")}</span>
                <span className="text-sm text-chart-5">{t("dashboard.quick.addUserDesc")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-card-foreground">{t("dashboard.quick.upload")}</span>
                <span className="text-sm text-chart-4">{t("dashboard.quick.uploadDesc")}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
