"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Search, Home } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import LanguageSwitcher from "@/components/language-switcher";
import { useLocale } from "@/hooks/useLocale";
import Image from "next/image";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLocale();

  return (
    <>
      {/* Banner Section */}
      <div className="relative w-full bg-gradient-to-r from-white via-slate-50 to-blue-50 border-b border-slate-200 overflow-hidden">
        {/* Background Image */}
        <Image
          src="/images/background-banner.png"
          alt="Background Banner"
          fill
          className="object-cover z-0"
          priority
        />
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-slate-50/60 to-blue-50/60 z-10"></div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 z-20">
          <div className="flex items-center justify-center">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fadeIn">
              {/* Logo */}
              <div className="flex-shrink-0 transform hover:scale-105 transition-transform duration-300">
                <Image
                  src="/icons/logo.png"
                  alt="Logo Hiệp hội Dữ liệu Quốc gia Việt Nam"
                  width={70}
                  height={70}
                  className="object-contain drop-shadow-lg"
                />
              </div>

              {/* Text Content */}
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold text-[#0033FF] mb-1 leading-tight tracking-wide drop-shadow-sm">
                  HIỆP HỘI DỮ LIỆU QUỐC GIA
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-[#0033FF] font-semibold tracking-wider drop-shadow-sm">
                  NATIONAL DATA ASSOCIATION
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#977DFF]/20 bg-[#FFFFFF] backdrop-blur supports-[backdrop-filter]:bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* PHẦN 1: Logo và Tên Website */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#0033FF] to-[#977DFF] flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-200">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="hidden lg:block">
                  <h1 className="text-sm font-bold text-[#0033FF] group-hover:text-[#0600AF] transition-colors leading-tight">
                    {t("header.title")}
                  </h1>
                  <p className="text-xs text-[#977DFF] font-medium">
                    {t("header.subtitle")}
                  </p>
                </div>
              </Link>
            </div>

            {/* PHẦN 2: Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link
                href="/about-us"
                className="px-4 py-2 text-sm font-medium text-[#0600AF] hover:text-[#0033FF] hover:bg-[#FFCCF2]/10 rounded-lg transition-all duration-200"
              >
                {t("header.nav.about")}
              </Link>

              {/* Dropdown: Sản phẩm & Dịch vụ */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center px-4 py-2 text-sm font-medium text-[#0600AF] hover:text-[#0033FF] hover:bg-[#FFCCF2]/10 rounded-lg transition-all duration-200 data-[state=open]:bg-[#FFCCF2]/10 data-[state=open]:text-[#0033FF]">
                  {t("header.nav.products")}
                  <ChevronDown className="ml-1 h-3.5 w-3.5 transition-transform duration-200 data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="w-56 bg-white/95 backdrop-blur border-[#977DFF]/20 shadow-xl"
                >
                  <DropdownMenuItem asChild>
                    <Link href="/activities" className="cursor-pointer">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {t("header.dropdown.products.activities.title")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {t("header.dropdown.products.activities.desc")}
                        </span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/digital-product" className="cursor-pointer">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {t("header.dropdown.products.digitalProducts.title")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {t("header.dropdown.products.digitalProducts.desc")}
                        </span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/documents" className="cursor-pointer">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {t("header.dropdown.products.documents.title")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {t("header.dropdown.products.documents.desc")}
                        </span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                href="/posts"
                className="px-4 py-2 text-sm font-medium text-[#0600AF] hover:text-[#0033FF] hover:bg-[#FFCCF2]/10 rounded-lg transition-all duration-200"
              >
                {t("header.nav.posts")}
              </Link>

              {/* Dropdown: Hội viên */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center px-4 py-2 text-sm font-medium text-[#0600AF] hover:text-[#0033FF] hover:bg-[#FFCCF2]/10 rounded-lg transition-all duration-200 data-[state=open]:bg-[#FFCCF2]/10 data-[state=open]:text-[#0033FF]">
                  {t("header.nav.members")}
                  <ChevronDown className="ml-1 h-3.5 w-3.5 transition-transform duration-200 data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="w-48 bg-white/95 backdrop-blur border-[#977DFF]/20 shadow-xl"
                >
                  <DropdownMenuItem asChild>
                    <Link href="/members/lists" className="cursor-pointer">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {t("header.dropdown.members.list.title")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {t("header.dropdown.members.list.desc")}
                        </span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/members/register" className="cursor-pointer">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {t("header.dropdown.members.register.title")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {t("header.dropdown.members.register.desc")}
                        </span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Dropdown: Hỗ trợ */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center px-4 py-2 text-sm font-medium text-[#0600AF] hover:text-[#0033FF] hover:bg-[#FFCCF2]/10 rounded-lg transition-all duration-200 data-[state=open]:bg-[#FFCCF2]/10 data-[state=open]:text-[#0033FF]">
                  {t("header.nav.support")}
                  <ChevronDown className="ml-1 h-3.5 w-3.5 transition-transform duration-200 data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="w-44 bg-white/95 backdrop-blur border-[#977DFF]/20 shadow-xl"
                >
                  <DropdownMenuItem asChild>
                    <Link href="/faq" className="cursor-pointer">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {t("header.dropdown.support.faq.title")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {t("header.dropdown.support.faq.desc")}
                        </span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/contact" className="cursor-pointer">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {t("header.dropdown.support.contact.title")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {t("header.dropdown.support.contact.desc")}
                        </span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* PHẦN 3: Search và Language Switcher */}
            <div className="flex items-center space-x-2">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden sm:flex text-[#0600AF] hover:text-[#0033FF] hover:bg-[#FFCCF2]/10 transition-all duration-200"
              >
                <Link href="/search" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span className="hidden md:inline text-sm font-medium">
                    {t("header.nav.search")}
                  </span>
                </Link>
              </Button>

              {/* Language Switcher */}
              <div className="hidden sm:flex">
                <LanguageSwitcher compact />
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-[#0033FF] hover:text-[#0600AF] hover:bg-[#FFCCF2]/10 transition-all duration-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-[#977DFF]/20 bg-white/95 backdrop-blur mt-1">
              <nav className="py-4 space-y-2">
                <Link
                  href="/about-us"
                  className="block text-base font-medium text-[#0600AF] hover:text-[#0033FF] transition-colors py-3 px-4 rounded-lg hover:bg-[#FFCCF2]/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("header.nav.about")}
                </Link>

                {/* Mobile Sản phẩm & Dịch vụ */}
                <div className="space-y-1">
                  <div className="text-base font-medium text-[#0600AF] py-3 px-4">
                    {t("header.nav.products")}
                  </div>
                  <div className="ml-4 space-y-1 border-l-2 border-[#977DFF]/20 pl-4">
                    <Link
                      href="/activities"
                      className="block text-sm text-[#0600AF] hover:text-[#0033FF] transition-colors py-2 px-4 rounded-lg hover:bg-[#FFCCF2]/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("header.dropdown.products.activities.title")}
                    </Link>
                    <Link
                      href="/digital-product"
                      className="block text-sm text-[#0600AF] hover:text-[#0033FF] transition-colors py-2 px-4 rounded-lg hover:bg-[#FFCCF2]/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("header.dropdown.products.digitalProducts.title")}
                    </Link>
                    <Link
                      href="/documents"
                      className="block text-sm text-[#0600AF] hover:text-[#0033FF] transition-colors py-2 px-4 rounded-lg hover:bg-[#FFCCF2]/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("header.dropdown.products.documents.title")}
                    </Link>
                  </div>
                </div>

                <Link
                  href="/posts"
                  className="block text-base font-medium text-[#0600AF] hover:text-[#0033FF] transition-colors py-3 px-4 rounded-lg hover:bg-[#FFCCF2]/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("header.nav.posts")}
                </Link>

                {/* Mobile Hội viên */}
                <div className="space-y-1">
                  <div className="text-base font-medium text-[#0600AF] py-3 px-4">
                    {t("header.nav.members")}
                  </div>
                  <div className="ml-4 space-y-1 border-l-2 border-[#977DFF]/20 pl-4">
                    <Link
                      href="/members/lists"
                      className="block text-sm text-[#0600AF] hover:text-[#0033FF] transition-colors py-2 px-4 rounded-lg hover:bg-[#FFCCF2]/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("header.dropdown.members.list.title")}
                    </Link>
                    <Link
                      href="/members/register"
                      className="block text-sm text-[#0600AF] hover:text-[#0033FF] transition-colors py-2 px-4 rounded-lg hover:bg-[#FFCCF2]/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("header.dropdown.members.register.title")}
                    </Link>
                  </div>
                </div>

                {/* Mobile Hỗ trợ */}
                <div className="space-y-1">
                  <div className="text-base font-medium text-[#0600AF] py-3 px-4">
                    {t("header.nav.support")}
                  </div>
                  <div className="ml-4 space-y-1 border-l-2 border-[#977DFF]/20 pl-4">
                    <Link
                      href="/faq"
                      className="block text-sm text-[#0600AF] hover:text-[#0033FF] transition-colors py-2 px-4 rounded-lg hover:bg-[#FFCCF2]/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("header.dropdown.support.faq.title")}
                    </Link>
                    <Link
                      href="/contact"
                      className="block text-sm text-[#0600AF] hover:text-[#0033FF] transition-colors py-2 px-4 rounded-lg hover:bg-[#FFCCF2]/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("header.dropdown.support.contact.title")}
                    </Link>
                  </div>
                </div>

                {/* Mobile Search và Language */}
                <div className="pt-4 border-t border-[#977DFF]/20 space-y-2">
                  <Link
                    href="/search"
                    className="flex items-center gap-3 text-base font-medium text-[#0600AF] hover:text-[#0033FF] transition-colors py-3 px-4 rounded-lg hover:bg-[#FFCCF2]/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Search className="h-4 w-4" />
                    {t("header.nav.search")}
                  </Link>
                  <div className="px-4 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#0600AF]">
                        {t("header.mobile.language")}
                      </span>
                      <LanguageSwitcher />
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
