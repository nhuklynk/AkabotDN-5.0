"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  return (
    <>
      <Select value={filterStatus} onValueChange={setFilterStatus}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="published">Đã xuất bản</SelectItem>
          <SelectItem value="review">Chờ duyệt</SelectItem>
          <SelectItem value="rejected">Từ chối</SelectItem>
          <SelectItem value="archived">Lưu trữ</SelectItem>
          <SelectItem value="draft">Bản nháp</SelectItem>
          <SelectItem value="scheduled">Đã lên lịch</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filterCategory} onValueChange={setFilterCategory}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Danh mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả danh mục</SelectItem>
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
            <SelectValue placeholder="Loại bài" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="article">Bài viết</SelectItem>
            <SelectItem value="news">Tin tức</SelectItem>
            <SelectItem value="event">Sự kiện</SelectItem>
            <SelectItem value="guide">Hướng dẫn</SelectItem>
          </SelectContent>
        </Select>
      )}
      {setFilterTag && (
        <input
          className="border rounded px-3 py-2 text-sm bg-background"
          placeholder="Lọc theo tag"
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
        />
      )}
    </>
  )
}


