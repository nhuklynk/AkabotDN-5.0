"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type Permission = {
  key: string;
  label: string;
};

type Role = {
  name: string;
  permissions: Record<string, boolean>;
};

const ALL_PERMISSIONS: Permission[] = [
  { key: "user.read", label: "Xem người dùng" },
  { key: "user.write", label: "Sửa người dùng" },
  { key: "post.read", label: "Xem bài viết" },
  { key: "post.write", label: "Sửa bài viết" },
  { key: "faq.manage", label: "Quản lý FAQ" },
  { key: "settings.manage", label: "Quản lý cài đặt" },
];

export default function PermissionManagementPage() {
  const [roles, setRoles] = useState<Role[]>([
    {
      name: "Admin",
      permissions: {
        "user.read": true,
        "user.write": true,
        "post.read": true,
        "post.write": true,
        "faq.manage": true,
        "settings.manage": true,
      },
    },
    {
      name: "Editor",
      permissions: {
        "user.read": true,
        "user.write": false,
        "post.read": true,
        "post.write": true,
        "faq.manage": false,
        "settings.manage": false,
      },
    },
    {
      name: "Viewer",
      permissions: {
        "user.read": true,
        "user.write": false,
        "post.read": true,
        "post.write": false,
        "faq.manage": false,
        "settings.manage": false,
      },
    },
  ]);

  const togglePermission = (roleIndex: number, permissionKey: string) => {
    setRoles((prev) =>
      prev.map((role, idx) =>
        idx !== roleIndex
          ? role
          : {
              ...role,
              permissions: {
                ...role.permissions,
                [permissionKey]: !role.permissions[permissionKey],
              },
            }
      )
    );
  };

  const allPermissionKeys = useMemo(() => ALL_PERMISSIONS.map((p) => p.key), []);

  const setAllForRole = (roleIndex: number, value: boolean) => {
    setRoles((prev) =>
      prev.map((role, idx) =>
        idx !== roleIndex
          ? role
          : {
              ...role,
              permissions: Object.fromEntries(allPermissionKeys.map((k) => [k, value])),
            }
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Phân quyền</h1>
        <p className="text-muted-foreground">Quản lý vai trò và quyền hạn cho người dùng.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role, roleIndex) => (
          <Card key={role.name}>
            <CardHeader className="space-y-1">
              <CardTitle>{role.name}</CardTitle>
              <CardDescription>Gán quyền cho vai trò này</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setAllForRole(roleIndex, true)}>
                  Chọn tất cả
                </Button>
                <Button size="sm" variant="outline" onClick={() => setAllForRole(roleIndex, false)}>
                  Bỏ chọn
                </Button>
              </div>

              <div className="space-y-3">
                {ALL_PERMISSIONS.map((perm) => (
                  <label key={perm.key} className="flex items-center gap-3">
                    <Checkbox
                      checked={!!role.permissions[perm.key]}
                      onCheckedChange={() => togglePermission(roleIndex, perm.key)}
                    />
                    <span className="text-sm text-foreground">{perm.label}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


