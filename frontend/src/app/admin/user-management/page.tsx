"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import UserTable from "./component/user-table";
import UserFormDialog from "./component/user-form-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pagination } from "@/components/pagination-component";
import { useLocale } from "@/hooks/useLocale";

import { Plus, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import useUsers from "@/hooks/admin/user/useUsers";
import type { UserListItem } from "@/services/admin/users/getAllUser";
// using role union via hook

// Data is fetched via useUsers hook

type User = UserListItem;

export default function UsersPage() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const {
    items,
    total,
    page,
    limit,
    setQuery,
    fetchUsers,
    create,
    update,
    remove,
    loading,
    setRoleIds,
  } = useUsers({ initialQuery: { page: 1, limit: 10 } });
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<{
    full_name: string;
    email: string;
    phone?: string;
    avatar?: string;
    status: string;
    password?: string;
    role_id?: string;
  }>({
    full_name: "",
    email: "",
    phone: "",
    avatar: "",
    status: "active",
    password: "",
    role_id: "",
  });

  const ROLE_MEMBER_ID = "550e8400-e29b-41d4-a716-446655440004";
  const ROLE_EXPERT_ID = "550e8400-e29b-41d4-a716-446655440002";
  const isMembersExpertsTab = tab === "members-experts";

  const baseItems = items;

  // Server-side filtering is applied via query. Local filter keeps UX responsive
  const filteredUsers = useMemo(() => {
    const activeOnly = baseItems.filter((u) => u.status === "active");
    if (!searchTerm) return activeOnly;
    return activeOnly.filter(
      (user) =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [baseItems, items, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = limit;
  const totalCount = total || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / (pageSize || 10)));
  const paginatedUsers = isMembersExpertsTab
    ? filteredUsers.slice(
        (currentPage - 1) * (pageSize || 10),
        currentPage * (pageSize || 10)
      )
    : filteredUsers;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    setQuery((q) => ({
      ...q,
      page: currentPage,
      limit: pageSize,
      search: searchTerm || undefined,
      status: "active",
    }));
  }, [currentPage, pageSize, searchTerm, setQuery]);

  // Switch between all users and role-based union via hook
  useEffect(() => {
    if (isMembersExpertsTab) {
      setRoleIds([ROLE_MEMBER_ID, ROLE_EXPERT_ID]);
    } else {
      setRoleIds([]);
    }
  }, [isMembersExpertsTab, setRoleIds]);

  const handleCreateUser = async () => {
    await create({
      full_name: formData.full_name,
      email: formData.email,
      password: formData.password || "",
      phone: formData.phone,
      status: formData.status,
      role_id: formData.role_id || "",
    });
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      avatar: "",
      status: "active",
      password: "",
      role_id: "",
    });
    setDialogOpen(false);
    // data auto refreshes via hook
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone || "",
      avatar: user.avatar || "",
      status: user.status,
    });
    setDialogMode("edit");
    setTimeout(() => setDialogOpen(true), 0);
  };

  const handleUpdateUser = async () => {
    if (editingUser) {
      await update(editingUser.id, {
        full_name: formData.full_name,
        phone: formData.phone,
        avatar: formData.avatar,
        status: formData.status,
      });
      setEditingUser(null);
      setFormData({ full_name: "", email: "", phone: "", status: "active" });
      setDialogOpen(false);
    }
  };

  const handleDeleteUser = async (userId: number | string) => {
    await remove(userId);
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
          onClick={() => {
            setDialogMode("create");
            setDialogOpen(true);
          }}
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
              setFormData({
                full_name: "",
                email: "",
                phone: "",
                avatar: "",
                status: "active",
                password: "",
                role_id: "",
              });
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "create"
                  ? t("user.dialog.createTitle")
                  : t("user.dialog.editTitle")}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === "create"
                  ? t("user.dialog.createDesc")
                  : t("user.dialog.editDesc")}
              </DialogDescription>
            </DialogHeader>

            <UserFormDialog
              formData={formData}
              setFormData={setFormData}
              mode={dialogMode}
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button
                onClick={
                  dialogMode === "create" ? handleCreateUser : handleUpdateUser
                }
              >
                {dialogMode === "create"
                  ? t("user.dialog.createCta")
                  : t("user.dialog.updateCta")}
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
                total: totalCount,
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
