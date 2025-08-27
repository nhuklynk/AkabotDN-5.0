"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
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
import { useLogin } from "@/hooks/auth/useLogin";

type Role = "admin" | "editor" | "user";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, loading, error } = useLogin();

  const redirectByRole = (role: Role) => {
    switch (role) {
      case "admin":
        return "/admin/user-management";
      case "editor":
        return "/admin/post-management";
      default:
        return "/admin";
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!email || !password) throw new Error("Vui lòng nhập đầy đủ thông tin");
      const res = await login({ email, password });
      const next = params.get("next");
      router.replace(next || redirectByRole((res.user.role as Role) || "user"));
    } catch (err: any) {
      // noop: hook already dispatches failure; local alert for UX
      alert(err?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <Card className="w-full max-w-md shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Đăng nhập</CardTitle>
        <CardDescription>Nhập thông tin tài khoản để tiếp tục</CardDescription>
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
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="h-4 w-4" /> Ghi nhớ đăng nhập
              </label>
              <Link
                href="/forgot-password"
                className="text-primary hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>
          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Đăng ký
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between bg-gradient-primary p-8 text-white">
        <div>
          <h2 className="text-3xl font-semibold">Chào mừng trở lại</h2>
          <p className="text-white/80 mt-2">
            Quản trị nội dung nhanh chóng và bảo mật.
          </p>
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
              Tối ưu trải nghiệm quản trị nội dung.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel (form) */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-background">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}