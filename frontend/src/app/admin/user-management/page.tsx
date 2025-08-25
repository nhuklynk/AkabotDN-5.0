"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import UserTable from "./component/user-table"
import UserFormDialog from "./component/user-form-dialog"
import { Pagination } from "@/components/pagination-component"
import { useLocale } from "@/hooks/useLocale"
 
import { Plus, Search } from "lucide-react"
import { useSearchParams } from "next/navigation"

// Mock data for users
const initialUsers = [
  {
    id: 1,
    full_name: "John Doe",
    email: "john.doe@example.com",
    phone: "0900000001",
    status: "active",
    created_at: "2024-01-15",
  },
  {
    id: 2,
    full_name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "0900000002",
    status: "active",
    created_at: "2024-01-20",
  },
  {
    id: 3,
    full_name: "Bob Johnson",
    email: "bob.johnson@example.com",
    phone: "0900000003",
    status: "inactive",
    created_at: "2024-02-01",
  },
  {
    id: 4,
    full_name: "Alice Brown",
    email: "alice.brown@example.com",
    phone: "0900000004",
    status: "active",
    created_at: "2024-02-10",
  },
  {
    id: 5,
    full_name: "Nguyen Member",
    email: "member@example.com",
    phone: "0900000005",
    status: "active",
    created_at: "2024-03-02",
  },
  {
    id: 6,
    full_name: "Tran Expert",
    email: "expert@example.com",
    phone: "0900000006",
    status: "active",
    created_at: "2024-03-05",
  },
]

type User = {
  id: number
  full_name: string
  email: string
  phone?: string
  status: string
  created_at: string
}

export default function UsersPage() {
  const { t } = useLocale()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab")
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<{ full_name: string; email: string; phone?: string; status: string }>({
    full_name: "",
    email: "",
    phone: "",
    status: "active",
  })

  const filteredUsers = users
    .filter(
      (user) =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter(() => true)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleCreateUser = () => {
    const newUser: User = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      status: formData.status,
      created_at: new Date().toISOString().split("T")[0],
    }
    setUsers([...users, newUser])
    setFormData({ full_name: "", email: "", phone: "", status: "active" })
    setIsCreateDialogOpen(false)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setFormData({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone || "",
      status: user.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateUser = () => {
    if (editingUser) {
      setUsers(users.map((user) => (user.id === editingUser.id ? { ...user, ...formData, created_at: user.created_at } : user)))
      setIsEditDialogOpen(false)
      setEditingUser(null)
      setFormData({ full_name: "", email: "", phone: "", status: "active" })
    }
  }

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-destructive text-destructive-foreground"
      case "editor":
        return "bg-primary text-primary-foreground"
      case "member":
        return "bg-indigo-500 text-white"
      case "expert":
        return "bg-amber-500 text-white"
      case "user":
        return "bg-secondary text-secondary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusColor = (_status: string) => "bg-secondary text-secondary-foreground"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="p-6 pt-0 pb-0">
          <h1 className="text-3xl font-bold text-foreground">{t("user.title")}</h1>
          <p className="text-muted-foreground">{t("user.subtitle")}</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          {t("user.add")}
        </Button>
        <UserFormDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreateUser}
          mode="create"
        />
      </div>

      <Card className="border-0 shadow-none">
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("user.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {t("user.countSummary", { filtered: filteredUsers.length, total: users.length })}
            </div>
          </div>

          <UserTable
            items={paginatedUsers}
            getRoleColor={getRoleColor}
            getStatusColor={getStatusColor}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
          <Pagination
            className="mt-4"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <UserFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleUpdateUser}
        mode="edit"
      />
    </div>
  )
}
