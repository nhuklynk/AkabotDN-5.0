"use client";

import * as React from "react";
import apiClient from "@/services/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/hooks/useLocale";

type UserFormData = {
  full_name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: string;
  password?: string;
  role_id?: string;
};

type Props = {
  formData: UserFormData;
  setFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
  mode: "create" | "edit";
};

export default function UserFormDialog({
  formData,
  setFormData,
  mode,
}: Props) {
  const { t } = useLocale();
  const tOr = React.useCallback(
    (key: string, fallback: string) => {
      const val = t(key);
      return val === key ? fallback : val;
    },
    [t]
  );
  const [roles, setRoles] = React.useState<Array<{ id: string; name: string }>>([]);

  React.useEffect(() => {
    if (mode !== "create") return;
    let cancelled = false;
    const load = async () => {
      try {
        const res: any = await apiClient.get("/roles");
        const payload = res?.data ?? res;
        const items = Array.isArray(payload) ? payload : Array.isArray(payload?.items) ? payload.items : [];
        if (!cancelled) setRoles(items);
      } catch {
        // ignore
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [mode]);

  return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="full_name">{t("user.form.name")}</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) =>
                setFormData((d) => ({ ...d, full_name: e.target.value }))
              }
              placeholder={t("user.form.namePlaceholder")}
            />
          </div>
          <div>
            <Label htmlFor="email">{t("user.form.email")}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((d) => ({ ...d, email: e.target.value }))
              }
              placeholder={t("user.form.emailPlaceholder")}
              disabled={mode === "edit"}
            />
          </div>
          <div>
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              value={formData.phone || ""}
              onChange={(e) =>
                setFormData((d) => ({ ...d, phone: e.target.value }))
              }
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div>
            <Label htmlFor="avatar">Ảnh đại diện (URL)</Label>
            <Input
              id="avatar"
              value={formData.avatar || ""}
              onChange={(e) =>
                setFormData((d) => ({ ...d, avatar: e.target.value }))
              }
              placeholder="https://..."
            />
          </div>
          {mode === "create" && (
            <div>
              <Label htmlFor="password">{tOr("user.form.password", "Password")}</Label>
              <Input
                id="password"
                type="password"
                value={formData.password || ""}
                onChange={(e) =>
                  setFormData((d) => ({ ...d, password: e.target.value }))
                }
                placeholder={tOr("user.form.passwordPlaceholder", "At least 6 characters")}
              />
            </div>
          )}
          {mode === "create" && (
            <div>
              <Label htmlFor="role">{tOr("user.form.role", "Role")}</Label>
              <Select
                value={formData.role_id || ""}
                onValueChange={(value) => setFormData((d) => ({ ...d, role_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={tOr("user.form.rolePlaceholder", "Select a role")} />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            <Label htmlFor="status">{t("user.form.status")}</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((d) => ({ ...d, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("user.form.statusPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">
                  {t("user.status.active")}
                </SelectItem>
                <SelectItem value="inactive">
                  {t("user.status.inactive")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
  );
}
