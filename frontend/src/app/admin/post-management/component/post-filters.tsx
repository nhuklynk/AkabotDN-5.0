"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Props = {
  filterStatus: string
  setFilterStatus: (v: string) => void
  filterCategory: string
  setFilterCategory: (v: string) => void
  categories: { id: number; name: string }[]
}

export default function PostFilters({ filterStatus, setFilterStatus, filterCategory, setFilterCategory, categories }: Props) {
  return (
    <>
      <Select value={filterStatus} onValueChange={setFilterStatus}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="published">Đã xuất bản</SelectItem>
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
    </>
  )
}


