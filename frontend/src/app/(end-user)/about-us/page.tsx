"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Target,
  Heart,
  History,
  FileText,
  Download,
} from "lucide-react";
import Image from "next/image";
import { useLocale } from "@/hooks/useLocale";
import FlipBook from "@/components/FlipBook";
import { generateCharterPages } from "@/utils/flipbook-helper";

export default function GioiThieuPage() {
  const [activeTab, setActiveTab] = useState("about");
  const { t } = useLocale();

  // Generate charter pages URLs (assuming we have 25 pages)
  const charterPages = generateCharterPages(25);

  const menuItems = [
    { id: "about", label: t("aboutUs.menu.about"), icon: Target },
    { id: "executive", label: t("aboutUs.menu.executive"), icon: Users },
    { id: "standing", label: t("aboutUs.menu.standing"), icon: Users },
    { id: "charter", label: t("aboutUs.menu.charter"), icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#0033FF] mb-4">
              {t("aboutUs.header.title")}
            </h1>
            <p className="text-lg text-[#0600AF] max-w-3xl mx-auto">
              {t("aboutUs.header.subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "outline"}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-6 py-3 ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-[#0033FF] to-[#977DFF] hover:from-[#977DFF] hover:to-[#0033FF] text-white border-0"
                    : "border-slate-300 text-[#0033FF] hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-[#977DFF]/50 transition-all duration-300"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            );
          })}
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Về NDA Section */}
          {activeTab === "about" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Key Statistics */}
              <Card className="border-slate-200 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 mb-8">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-[#0033FF] mb-2">
                      {t("aboutUs.about.stats.title")}
                    </h3>
                    <p className="text-[#0600AF]/80">
                      {t("aboutUs.about.stats.subtitle")}
                    </p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-white rounded-lg shadow border">
                      <div className="text-3xl font-bold text-[#0033FF] mb-2">
                        300+
                      </div>
                      <p className="text-[#0600AF]/90">
                        {t("aboutUs.about.stats.members")}
                      </p>
                    </div>
                    <div className="text-center p-6 bg-white rounded-lg shadow border">
                      <div className="text-3xl font-bold text-[#977DFF] mb-2">
                        54
                      </div>
                      <p className="text-[#0600AF]/90">
                        {t("aboutUs.about.stats.fields")}
                      </p>
                    </div>
                    <div className="text-center p-6 bg-white rounded-lg shadow border">
                      <div className="text-3xl font-bold text-[#0033FF] mb-2">
                        100+
                      </div>
                      <p className="text-[#0600AF]/90">
                        {t("aboutUs.about.stats.partners")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mission & Vision */}
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-slate-200 shadow-lg bg-white hover:border-[#977DFF]/50 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#0033FF] to-[#977DFF] rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#0033FF]">
                        {t("aboutUs.about.mission.title")}
                      </h3>
                    </div>
                    <div className="text-[#0600AF]/90 leading-relaxed space-y-3">
                      <p>{t("aboutUs.about.mission.content1")}</p>
                      <p>{t("aboutUs.about.mission.content2")}</p>
                      <p>{t("aboutUs.about.mission.content3")}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#977DFF]/40 shadow-lg bg-white hover:border-slate-300 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#977DFF] to-[#0033FF] rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#0033FF]">
                        {t("aboutUs.about.tasks.title")}
                      </h3>
                    </div>
                    <div className="text-[#0600AF]/90 leading-relaxed">
                      <ul className="space-y-2 text-sm">
                        <li>• {t("aboutUs.about.tasks.legal")}</li>
                        <li>• {t("aboutUs.about.tasks.data")}</li>
                        <li>• {t("aboutUs.about.tasks.technology")}</li>
                        <li>• {t("aboutUs.about.tasks.promotion")}</li>
                        <li>• {t("aboutUs.about.tasks.support")}</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Định hướng phát triển */}
              <Card className="border-slate-200 shadow-lg bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-[#977DFF]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0033FF]">
                      {t("aboutUs.about.development.title")}
                    </h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-[#0033FF] mb-2">
                          🏢 {t("aboutUs.about.development.market.title")}
                        </h4>
                        <p className="text-sm text-[#0600AF]/90">
                          {t("aboutUs.about.development.market.content")}
                        </p>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-100 rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-[#0033FF] mb-2">
                          🤖 {t("aboutUs.about.development.ai.title")}
                        </h4>
                        <p className="text-sm text-[#0600AF]/90">
                          {t("aboutUs.about.development.ai.content")}
                        </p>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-blue-100 to-slate-100 rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-[#0033FF] mb-2">
                          🎓 {t("aboutUs.about.development.education.title")}
                        </h4>
                        <p className="text-sm text-[#0600AF]/90">
                          {t("aboutUs.about.development.education.content")}
                        </p>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-[#977DFF]/10 to-blue-50 rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-[#0033FF] mb-2">
                          🏆 {t("aboutUs.about.development.competition.title")}
                        </h4>
                        <p className="text-sm text-[#0600AF]/90">
                          {t("aboutUs.about.development.competition.content")}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-[#0033FF] mb-2">
                          🇻🇳 {t("aboutUs.about.development.autonomy.title")}
                        </h4>
                        <p className="text-sm text-[#0600AF]/90">
                          {t("aboutUs.about.development.autonomy.content")}
                        </p>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-[#0033FF] mb-2">
                          🏗️{" "}
                          {t("aboutUs.about.development.infrastructure.title")}
                        </h4>
                        <p className="text-sm text-[#0600AF]/90">
                          {t(
                            "aboutUs.about.development.infrastructure.content"
                          )}
                        </p>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-indigo-50 to-slate-100 rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-[#0033FF] mb-2">
                          🌐 {t("aboutUs.about.development.cooperation.title")}
                        </h4>
                        <p className="text-sm text-[#0600AF]/90">
                          {t("aboutUs.about.development.cooperation.content")}
                        </p>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-[#0033FF] mb-2">
                          🔒 {t("aboutUs.about.development.security.title")}
                        </h4>
                        <p className="text-sm text-[#0600AF]/90">
                          {t("aboutUs.about.development.security.content")}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Leadership Section */}
              <Card className="border-slate-200 shadow-lg bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0033FF] to-[#977DFF] rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0033FF]">
                      {t("aboutUs.about.leadership.title")}
                    </h3>
                  </div>

                  {/* Leadership Details */}
                  <div className="mb-6 space-y-4">
                    {/* Chủ tịch */}
                    <div className="bg-gradient-to-br from-[#0033FF] to-[#977DFF] text-white p-6 rounded-lg shadow-lg">
                      <div className="text-center">
                        <h4 className="text-lg font-bold mb-2">
                          {t("aboutUs.about.leadership.chairman.title")}
                        </h4>
                        <p className="text-xl font-semibold">
                          {t("aboutUs.about.leadership.chairman.name")}
                        </p>
                        <p className="text-sm opacity-90">
                          {t("aboutUs.about.leadership.chairman.position")}
                        </p>
                      </div>
                    </div>

                    {/* Phó Chủ tịch thường trực */}
                    <div className="bg-gradient-to-br from-[#977DFF] to-[#0033FF] text-white p-6 rounded-lg shadow-lg">
                      <div className="text-center">
                        <h4 className="text-lg font-bold mb-2">
                          {t(
                            "aboutUs.about.leadership.viceChairmanPermanent.title"
                          )}
                        </h4>
                        <p className="text-xl font-semibold">
                          {t(
                            "aboutUs.about.leadership.viceChairmanPermanent.name"
                          )}
                        </p>
                        <p className="text-sm opacity-90">
                          {t(
                            "aboutUs.about.leadership.viceChairmanPermanent.position"
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Các Phó Chủ tịch */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-slate-100 to-blue-100 text-[#0033FF] p-4 rounded-lg shadow border border-slate-200">
                        <h5 className="font-semibold mb-1">
                          {t("aboutUs.about.leadership.viceChairmen.title")}
                        </h5>
                        <p className="font-medium">
                          {t(
                            "aboutUs.about.leadership.viceChairmen.nguyen_ngoc_cuong.name"
                          )}
                        </p>
                        <p className="text-xs opacity-90">
                          {t(
                            "aboutUs.about.leadership.viceChairmen.nguyen_ngoc_cuong.position"
                          )}
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-blue-100 to-indigo-100 text-[#0033FF] p-4 rounded-lg shadow border border-slate-200">
                        <h5 className="font-semibold mb-1">
                          {t("aboutUs.about.leadership.viceChairmen.title")}
                        </h5>
                        <p className="font-medium">
                          {t(
                            "aboutUs.about.leadership.viceChairmen.tran_minh_son.name"
                          )}
                        </p>
                        <p className="text-xs opacity-90">
                          {t(
                            "aboutUs.about.leadership.viceChairmen.tran_minh_son.position"
                          )}
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-indigo-100 to-slate-100 text-[#0033FF] p-4 rounded-lg shadow border border-slate-200">
                        <h5 className="font-semibold mb-1">
                          {t("aboutUs.about.leadership.viceChairmen.title")}
                        </h5>
                        <p className="font-medium">
                          {t(
                            "aboutUs.about.leadership.viceChairmen.nguyen_thieu_nam.name"
                          )}
                        </p>
                        <p className="text-xs opacity-90">
                          {t(
                            "aboutUs.about.leadership.viceChairmen.nguyen_thieu_nam.position"
                          )}
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-slate-50 to-blue-100 text-[#0033FF] p-4 rounded-lg shadow border border-slate-200">
                        <h5 className="font-semibold mb-1">
                          {t("aboutUs.about.leadership.viceChairmen.title")}
                        </h5>
                        <p className="font-medium">
                          {t(
                            "aboutUs.about.leadership.viceChairmen.truong_gia_binh.name"
                          )}
                        </p>
                        <p className="text-xs opacity-90">
                          {t(
                            "aboutUs.about.leadership.viceChairmen.truong_gia_binh.position"
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Tổng Thư ký */}
                    <div className="bg-gradient-to-br from-green-100 to-emerald-100 text-[#0033FF] p-4 rounded-lg shadow border border-slate-200">
                      <div className="text-center">
                        <h5 className="font-semibold mb-1">
                          {t("aboutUs.about.leadership.secretaryGeneral.title")}
                        </h5>
                        <p className="font-medium">
                          {t("aboutUs.about.leadership.secretaryGeneral.name")}
                        </p>
                        <p className="text-sm opacity-90">
                          {t(
                            "aboutUs.about.leadership.secretaryGeneral.position1"
                          )}
                        </p>
                        <p className="text-xs opacity-80">
                          {t(
                            "aboutUs.about.leadership.secretaryGeneral.position2"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Leadership Chart Image */}
                  <div className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-slate-200">
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-semibold text-[#0033FF] mb-2">
                        {t("aboutUs.about.leadership.organizationChart")}
                      </h4>
                    </div>
                    <div className="flex justify-center">
                      <div className="border-2 border-slate-200 rounded-lg p-4 bg-white shadow-lg max-w-5xl">
                        <Image
                          src="/images/danh_sach_chu_tich_va_pho_chu_tich.png"
                          alt="Danh sách Chủ tịch và Phó Chủ tịch Hiệp hội Dữ liệu Quốc gia (2025-2030)"
                          width={1400}
                          height={1000}
                          className="w-full h-auto rounded shadow-sm"
                          priority
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Formation History */}
              <Card className="border-slate-200 shadow-lg bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0033FF] to-[#977DFF] rounded-full flex items-center justify-center">
                      <History className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0033FF]">
                      {t("aboutUs.about.history.title")}
                    </h3>
                  </div>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-[#0033FF] px-3 py-1 border-0 font-semibold">
                          10/01/2025
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0033FF] mb-2">
                          {t("aboutUs.about.history.establishment.title")}
                        </h4>
                        <p className="text-[#0600AF]/90">
                          {t("aboutUs.about.history.establishment.content")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <Badge className="bg-gradient-to-r from-indigo-100 to-blue-100 text-[#0033FF] px-3 py-1 border-0 font-semibold">
                          22/03/2025
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0033FF] mb-2">
                          {t("aboutUs.about.history.launch.title")}
                        </h4>
                        <p className="text-[#0600AF]/90">
                          {t("aboutUs.about.history.launch.content")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-[#0033FF] px-3 py-1 border-0 font-semibold">
                          2025-2030
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0033FF] mb-2">
                          {t("aboutUs.about.history.firstTerm.title")}
                        </h4>
                        <p className="text-[#0600AF]/90">
                          {t("aboutUs.about.history.firstTerm.content")}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Ban Chấp hành Section */}
          {activeTab === "executive" && (
            <div className="animate-in fade-in duration-500">
              <Card className="border-slate-200 shadow-lg bg-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-[#0033FF] mb-6 text-center">
                    {t("aboutUs.executive.title")}
                  </h3>

                  {/* Cơ cấu tổ chức Ban chuyên môn */}
                  <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-slate-200">
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-semibold text-[#0033FF] mb-2">
                        {t("aboutUs.executive.organizationChart")}
                      </h4>
                    </div>
                    <div className="flex justify-center">
                      <div className="border-2 border-slate-200 rounded-lg p-4 bg-white shadow-lg max-w-5xl">
                        <Image
                          src="/images/co_cau_to_chuc_ban_chuyen_mon_hiep_hoi_du_lieu_quoc_gia.png"
                          alt="Sơ đồ cơ cấu tổ chức các Ban chuyên môn thuộc Hiệp hội Dữ liệu Quốc gia"
                          width={1400}
                          height={1000}
                          className="w-full h-auto rounded shadow-sm"
                          priority
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Ban Thường vụ Section */}
          {activeTab === "standing" && (
            <div className="animate-in fade-in duration-500">
              <Card className="border-slate-200 shadow-lg bg-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-[#0033FF] mb-6 text-center">
                    {t("aboutUs.standing.title")}
                  </h3>

                  {/* Ban Thường vụ Image */}
                  <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-slate-200">
                    <div className="flex justify-center">
                      <div className="border-2 border-slate-200 rounded-lg p-4 bg-white shadow-lg max-w-4xl">
                        <Image
                          src="/images/Ban_Thuong_Vu_final.png"
                          alt="Danh sách Ban Thường vụ Hiệp hội Dữ liệu Quốc gia (2025-2030)"
                          width={1200}
                          height={800}
                          className="w-full h-auto rounded shadow-sm"
                          priority
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Điều lệ NDA Section - Modern Design */}
          {activeTab === "charter" && (
            <div className="animate-in fade-in duration-700">
              <Card className="border-white/20 shadow-2xl bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm">
                <CardContent className="p-10">
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#0033FF]/10 to-[#977DFF]/10 rounded-2xl border border-[#0033FF]/20 backdrop-blur-sm mb-4">
                      <FileText className="w-8 h-8 text-[#0033FF]" />
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-[#0033FF] to-[#977DFF] bg-clip-text text-transparent">
                        {t("aboutUs.charter.title")}
                      </h3>
                    </div>
                    <p className="text-[#0600AF]/80 text-lg font-medium">
                      {t("aboutUs.charter.subtitle")}
                    </p>
                  </div>

                  {/* Modern Interactive FlipBook */}
                  <div className="mb-12 relative">
                    {/* Background Decoration */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-[#0033FF]/5 to-[#977DFF]/5 rounded-3xl blur-xl"></div>
                    <div className="relative">
                      <FlipBook
                        pages={
                          charterPages.length > 0
                            ? charterPages
                            : [
                                "/vietnamese-legal-document.svg",
                                "/vietnam-data-association-structure.svg",
                                "/vietnam-data-mining-economy.svg",
                                "/vietnam-ai-assistant.svg",
                              ]
                        }
                        title={t("flipbook.title")}
                        className="rounded-2xl shadow-2xl"
                      />
                    </div>
                  </div>

                  {/* Modern Charter Information */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Document Info Card */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#0033FF] to-[#977DFF] rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-[#0033FF]">
                          {t("aboutUs.charter.info.title")}
                        </h4>
                      </div>
                      <div className="bg-white/70 backdrop-blur-sm p-5 rounded-xl border border-white/30 shadow-lg">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                            <span className="font-medium text-[#0033FF] text-sm">
                              📄 {t("aboutUs.charter.info.fields.name")}
                            </span>
                            <span className="font-medium text-[#0600AF] text-sm">
                              {t("aboutUs.charter.info.document")}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg">
                            <span className="font-medium text-[#0033FF] text-sm">
                              📅 {t("aboutUs.charter.info.fields.date")}
                            </span>
                            <span className="font-medium text-[#0600AF] text-sm">
                              {t("aboutUs.charter.info.issueDate")}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-gradient-to-r from-indigo-50 to-slate-50 rounded-lg">
                            <span className="font-medium text-[#0033FF] text-sm">
                              📊 {t("aboutUs.charter.info.fields.pages")}
                            </span>
                            <span className="font-medium text-[#0600AF] text-sm">
                              {t("aboutUs.charter.info.pages")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Overview Card */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#977DFF] to-[#0033FF] rounded-lg flex items-center justify-center">
                          <Target className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-[#0033FF]">
                          {t("aboutUs.charter.content.title")}
                        </h4>
                      </div>
                      <div className="bg-white/70 backdrop-blur-sm p-5 rounded-xl border border-white/30 shadow-lg">
                        <div className="grid gap-2">
                          {[
                            {
                              icon: "📋",
                              title: t(
                                "aboutUs.charter.content.chapters.general"
                              ),
                              color: "from-blue-50 to-indigo-50",
                            },
                            {
                              icon: "🎯",
                              title: t(
                                "aboutUs.charter.content.chapters.responsibilities"
                              ),
                              color: "from-indigo-50 to-slate-50",
                            },
                            {
                              icon: "👥",
                              title: t(
                                "aboutUs.charter.content.chapters.members"
                              ),
                              color: "from-slate-50 to-blue-50",
                            },
                            {
                              icon: "🏢",
                              title: t(
                                "aboutUs.charter.content.chapters.rewards"
                              ),
                              color: "from-blue-50 to-indigo-50",
                            },
                            {
                              icon: "💰",
                              title: t(
                                "aboutUs.charter.content.chapters.implementation"
                              ),
                              color: "from-indigo-50 to-slate-50",
                            },
                          ].map((item, index) => (
                            <div
                              key={index}
                              className={`flex items-center gap-2 p-2 bg-gradient-to-r ${item.color} rounded-lg transition-all duration-200 hover:scale-102 cursor-pointer`}
                            >
                              <span className="text-sm">{item.icon}</span>
                              <span className="font-medium text-[#0600AF] text-xs">
                                {item.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-center">
                        <Button className="bg-gradient-to-r from-[#0033FF] to-[#977DFF] hover:from-[#977DFF] hover:to-[#0033FF] text-white px-6 py-2 text-sm font-semibold border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-2 transform hover:scale-105">
                          <Download className="w-4 h-4 mr-2" />
                          {t("aboutUs.charter.download.button")}
                        </Button>
                        <p className="text-xs text-[#0600AF]/80 font-medium">
                          {t("aboutUs.charter.download.info")}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
