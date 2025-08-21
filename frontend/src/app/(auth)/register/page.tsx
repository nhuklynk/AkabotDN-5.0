"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { loginSuccess } from "@/features/auth/authSlice";

type Role = "admin" | "editor" | "user";

export default function RegisterPage() {
  const router = useRouter();
  const params = useSearchParams();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<Role>("user");
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const redirectByRole = (r: Role) =>
    r === "admin"
      ? "/admin/user-management"
      : r === "editor"
      ? "/admin/post-management"
      : "/admin";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    setSubmitting(true);
    try {
      // Mock register success → auto login
      const user = { id: 1, name, email, role } as any;
      const token = "mock-token";
      dispatch(loginSuccess({ user, token }));
      const next = params.get("next");
      router.replace(next || redirectByRole(role));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left visual panel */}
      <div className="hidden md:flex flex-col justify-between bg-gradient-primary p-8 text-white">
        <div>
          <h2 className="text-3xl font-semibold">Tạo tài khoản mới</h2>
          <p className="text-white/80 mt-2">Tham gia hệ thống CMS cộng đồng.</p>
        </div>
        <div className="opacity-90 flex items-end justify-between gap-6">
          <img
            src="/cms-illustration.svg"
            alt="CMS Illustration"
            className="w-3/4 md:w-4/5 drop-shadow"
          />
        </div>
        <div>
          <div>
            <h3 className="text-lg font-medium">CMS Community</h3>
            <p className="text-white/70">
              Bắt đầu trải nghiệm quản trị hiện đại.
            </p>
          </div>
        </div>
      </div>
      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-background">
        <Card className="w-full max-w-md shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Đăng ký</CardTitle>
            <CardDescription>Tạo tài khoản mới để tiếp tục</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 hover:border-[#4285F4] hover:bg-[#4285F4]/10 hover:text-[#4285F4]"
              >
                <img src="/icons/google.svg" alt="Google" className="h-4 w-4" />
                Tiếp tục với Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 hover:border-[#1877F2] hover:bg-[#1877F2]/10 hover:text-[#1877F2]"
              >
                <img src="/icons/facebook.svg" alt="Facebook" className="h-4 w-4" />
                Tiếp tục với Facebook
              </Button>
            </div>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">hoặc</span>
              </div>
            </div>
            <form className="space-y-4" onSubmit={onSubmit}>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div>
                <Label htmlFor="name">Họ tên</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={
                        showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirm">Xác nhận</Label>
                  <div className="relative">
                    <Input
                      id="confirm"
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-muted-foreground">
                  <input type="checkbox" className="h-4 w-4" /> Tôi đồng ý với
                  các điều khoản
                </label>
                <Link href="/login" className="text-primary hover:underline">
                  Đã có tài khoản? Đăng nhập
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
