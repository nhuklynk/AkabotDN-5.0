"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#977DFF]/20 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded  flex items-center justify-center overflow-hidden">
                <img
                  src="/icons/logo.png"
                  alt="Hiệp hội Dữ liệu Quốc gia Việt Nam"
                  width={32}
                  height={32}
                  className="object-contain h-8 w-8"
                />
              </div>
              <div className="hidden sm:block">
                <Link href="/">
                  <h1 className="text-lg font-bold text-[#0033FF] hover:text-[#0600AF] transition-colors cursor-pointer">
                    HIỆP HỘI DỮ LIỆU QUỐC GIA
                  </h1>
                  <p className="text-xs text-[#977DFF]">VIỆT NAM</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/about-us"
              className="text-sm font-medium text-[#0600AF] hover:text-[#0033FF] transition-colors"
            >
              GIỚI THIỆU
            </Link>

            <Link
              href="/activities"
              className="text-sm font-medium text-[#0600AF] hover:text-[#0033FF] transition-colors"
            >
              HOẠT ĐỘNG CỦA HIỆP HỘI
            </Link>

            <Link
              href="/posts"
              className="text-sm font-medium text-[#0600AF] hover:text-[#0033FF] transition-colors"
            >
              BÀI ĐĂNG
            </Link>

            <Link
              href="/documents"
              className="text-sm font-medium text-[#0600AF] hover:text-[#0033FF] transition-colors"
            >
              TƯ LIỆU
            </Link>
            <Link
              href="/digital-product"
              className="text-sm font-medium text-[#0600AF] hover:text-[#0033FF] transition-colors"
            >
              SẢN PHẨM SỐ
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-sm font-medium text-[#0600AF] hover:text-[#0033FF] transition-colors">
                HỘI VIÊN <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-[#977DFF]/20">
                <DropdownMenuItem asChild>
                  <Link href="/members/lists">Danh sách hội viên</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/members/register">Đăng ký hội viên</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/contact"
              className="text-sm font-medium text-[#0600AF] hover:text-[#0033FF] transition-colors"
            >
              LIÊN HỆ
            </Link>
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-[#0033FF] hover:text-[#0600AF] hover:bg-[#FFCCF2]/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[#977DFF]/20 bg-white/95 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="#"
                className="text-sm font-medium text-[#0600AF] hover:text-[#0033FF] transition-colors"
              >
                GIỚI THIỆU
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-[#0600AF] hover:text-[#0033FF] transition-colors"
              >
                HOẠT ĐỘNG
              </Link>
              <Link
                href="/bai-dang"
                className="text-sm font-medium text-[#0600AF] hover:text-[#0033FF] transition-colors"
              >
                BÀI ĐĂNG
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-[#0600AF] hover:text-[#0033FF] transition-colors"
              >
                VĂN BẢN HIỆP HỘI
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-[#0600AF] hover:text-[#0033FF] transition-colors"
              >
                SẢN PHẨM SỐ
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-[#0600AF] hover:text-[#0033FF] transition-colors"
              >
                HỘI VIÊN
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-[#0600AF] hover:text-[#0033FF] transition-colors"
              >
                LIÊN HỆ
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
