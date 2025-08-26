"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import UserTable from "./component/user-table";
import UserFormDialog from "./component/user-form-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pagination } from "@/components/pagination-component";
import { useLocale } from "@/hooks/useLocale";

import { Plus, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

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
];

type User = {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  status: string;
  created_at: string;
};

export default function UsersPage() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<{
    full_name: string;
    email: string;
    phone?: string;
    status: string;
  }>({
    full_name: "",
    email: "",
    phone: "",
    status: "active",
  });

  const filteredUsers = users
    .filter(
      (user) =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(() => true);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleCreateUser = () => {
    const newUser: User = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      status: formData.status,
      created_at: new Date().toISOString().split("T")[0],
    };
    setUsers([...users, newUser]);
    setFormData({ full_name: "", email: "", phone: "", status: "active" });
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone || "",
      status: user.status,
    });
    setDialogMode("edit");
    setTimeout(() => setDialogOpen(true), 0);
  };

  const handleUpdateUser = () => {
    if (editingUser) {
      setUsers(
        users.map((user) =>
          user.id === editingUser.id
            ? { ...user, ...formData, created_at: user.created_at }
            : user
        )
      );
      setEditingUser(null);
      setFormData({ full_name: "", email: "", phone: "", status: "active" });
      setDialogOpen(false);
    }
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-destructive text-destructive-foreground";
      case "editor":
        return "bg-primary text-primary-foreground";
      case "member":
        return "bg-indigo-500 text-white";
      case "expert":
        return "bg-amber-500 text-white";
      case "user":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (_status: string) =>
    "bg-secondary text-secondary-foreground";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="p-6 pt-0 pb-0">
          <h1 className="text-3xl font-bold text-foreground">
            {t("user.title")}
          </h1>
          <p className="text-muted-foreground">{t("user.subtitle")}</p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => { setDialogMode("create"); setDialogOpen(true); }}
        >
          <Plus className="h-4 w-4" />
          {t("user.add")}
        </Button>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingUser(null);
              setFormData({ full_name: "", email: "", phone: "", status: "active" });
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogMode === "create" ? t("user.dialog.createTitle") : t("user.dialog.editTitle")}</DialogTitle>
              <DialogDescription>{dialogMode === "create" ? t("user.dialog.createDesc") : t("user.dialog.editDesc")}</DialogDescription>
            </DialogHeader>

            <UserFormDialog formData={formData} setFormData={setFormData} mode={dialogMode} />

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>{t("common.cancel")}</Button>
              <Button onClick={dialogMode === "create" ? handleCreateUser : handleUpdateUser}>
                {dialogMode === "create" ? t("user.dialog.createCta") : t("user.dialog.updateCta")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
              {t("user.countSummary", {
                filtered: filteredUsers.length,
                total: users.length,
              })}
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

      {/* Single dialog instance above handles both create and edit */}
    </div>
  );
}
