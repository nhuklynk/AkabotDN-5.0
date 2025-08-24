"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import UserTable from "./component/user-table"
import UserFormDialog from "./component/user-form-dialog"
import { Pagination } from "@/components/pagination-component"
 
import { Plus, Search, Edit, Trash2, MoreHorizontal } from "lucide-react"

// Mock data for users
const initialUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "editor",
    status: "active",
    createdAt: "2024-01-20",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "user",
    status: "inactive",
    createdAt: "2024-02-01",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice.brown@example.com",
    role: "editor",
    status: "active",
    createdAt: "2024-02-10",
  },
]

type User = {
  id: number
  name: string
  email: string
  role: string
  status: string
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    status: "active",
  })

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
      ...formData,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setUsers([...users, newUser])
    setFormData({ name: "", email: "", role: "user", status: "active" })
    setIsCreateDialogOpen(false)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateUser = () => {
    if (editingUser) {
      setUsers(users.map((user) => (user.id === editingUser.id ? { ...user, ...formData } : user)))
      setIsEditDialogOpen(false)
      setEditingUser(null)
      setFormData({ name: "", email: "", role: "user", status: "active" })
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
          <h1 className="text-3xl font-bold text-foreground">Quản lý người dùng</h1>
          <p className="text-muted-foreground">Quản lý người dùng và quyền hạn.</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Thêm người dùng
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
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredUsers.length} / {users.length} người dùng
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
