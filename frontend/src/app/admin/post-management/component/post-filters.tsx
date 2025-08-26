"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocale } from "@/hooks/useLocale"

type Props = {
  filterStatus: string
  setFilterStatus: (v: string) => void
  filterCategory: string
  setFilterCategory: (v: string) => void
  filterPostType?: string
  setFilterPostType?: (v: string) => void
  filterTag?: string
  setFilterTag?: (v: string) => void
  categories: { id: number; name: string }[]
}

export default function PostFilters({ filterStatus, setFilterStatus, filterCategory, setFilterCategory, filterPostType = "all", setFilterPostType, filterTag = "", setFilterTag, categories }: Props) {
  const { t } = useLocale()
  return (
    <>
      <Select value={filterStatus} onValueChange={setFilterStatus}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder={t("post.filters.status")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("post.filters.all")}</SelectItem>
          <SelectItem value="published">{t("post.filters.published")}</SelectItem>
          <SelectItem value="review">{t("post.filters.review")}</SelectItem>
          <SelectItem value="rejected">{t("post.filters.rejected")}</SelectItem>
          <SelectItem value="archived">{t("post.filters.archived")}</SelectItem>
          <SelectItem value="draft">{t("post.filters.draft")}</SelectItem>
          <SelectItem value="scheduled">{t("post.filters.scheduled")}</SelectItem> 
        </SelectContent>
      </Select>
      <Select value={filterCategory} onValueChange={setFilterCategory}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t("post.filters.category")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("post.filters.allCategories")}</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id.toString()}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {setFilterPostType && (
        <Select value={filterPostType} onValueChange={setFilterPostType}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={t("post.filters.type")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("post.filters.allTypes")}</SelectItem>
            <SelectItem value="article">{t("post.filters.article")}</SelectItem>
            <SelectItem value="news">{t("post.filters.news")}</SelectItem>
            <SelectItem value="event">{t("post.filters.event")}</SelectItem>
            <SelectItem value="guide">{t("post.filters.guide")}</SelectItem>
          </SelectContent>
        </Select>
      )}
      {setFilterTag && (
        <input
          className="border rounded px-3 py-2 text-sm bg-background"
          placeholder={t("post.filters.filterByTag")}
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
        />
      )}
    </>
  )
}


