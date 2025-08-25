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

export default function GioiThieuPage() {
  const [activeTab, setActiveTab] = useState("about");
  const { t } = useLocale();

  const menuItems = [
    { id: "about", label: t("aboutUs.menu.about"), icon: Target },
    { id: "executive", label: t("aboutUs.menu.executive"), icon: Users },
    { id: "standing", label: t("aboutUs.menu.standing"), icon: Users },
    { id: "charter", label: t("aboutUs.menu.charter"), icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2E6EE] to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-[#FFCCF2]/30">
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
                    ? "bg-gradient-to-r from-[#FFCCF2] to-[#977DFF] hover:from-[#977DFF] hover:to-[#0033FF] text-white border-0"
                    : "border-[#FFCCF2]/40 text-[#0033FF] hover:bg-gradient-to-r hover:from-[#FFCCF2]/20 hover:to-[#F2E6EE] hover:border-[#977DFF]/50 transition-all duration-300"
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
              {/* Mission & Vision */}
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-[#FFCCF2]/40 shadow-lg bg-white hover:border-[#977DFF]/50 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#FFCCF2] to-[#977DFF] rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#0033FF]">
                        {t("aboutUs.about.mission.title")}
                      </h3>
                    </div>
                    <p className="text-[#0600AF]/90 leading-relaxed">
                      {t("aboutUs.about.mission.content")}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-[#977DFF]/40 shadow-lg bg-white hover:border-[#FFCCF2]/50 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#977DFF] to-[#0033FF] rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#0033FF]">
                        {t("aboutUs.about.vision.title")}
                      </h3>
                    </div>
                    <p className="text-[#0600AF]/90 leading-relaxed">
                      {t("aboutUs.about.vision.content")}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Core Values */}
              <Card className="border-[#FFCCF2]/40 shadow-lg bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFCCF2] to-[#F2E6EE] rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-[#977DFF]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0033FF]">
                      {t("aboutUs.about.coreValues.title")}
                    </h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-[#F2E6EE] to-[#FFCCF2]/30 rounded-lg border border-[#FFCCF2]/40 hover:from-[#FFCCF2]/40 hover:to-[#F2E6EE] transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#FFCCF2] to-[#977DFF] rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-white">1</span>
                      </div>
                      <h4 className="font-semibold text-[#0033FF] mb-2">
                        {t("aboutUs.about.coreValues.items.transparency.title")}
                      </h4>
                      <p className="text-sm text-[#0600AF]/90">
                        {t(
                          "aboutUs.about.coreValues.items.transparency.content"
                        )}
                      </p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-[#FFCCF2]/30 to-[#F2E6EE] rounded-lg border border-[#FFCCF2]/40 hover:from-[#F2E6EE] hover:to-[#FFCCF2]/40 transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#977DFF] to-[#0033FF] rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-white">2</span>
                      </div>
                      <h4 className="font-semibold text-[#0033FF] mb-2">
                        {t("aboutUs.about.coreValues.items.innovation.title")}
                      </h4>
                      <p className="text-sm text-[#0600AF]/90">
                        {t("aboutUs.about.coreValues.items.innovation.content")}
                      </p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-[#F2E6EE] to-[#977DFF]/30 rounded-lg border border-[#977DFF]/40 hover:from-[#977DFF]/40 hover:to-[#F2E6EE] transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#FFCCF2] to-[#F2E6EE] rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-[#977DFF]">
                          3
                        </span>
                      </div>
                      <h4 className="font-semibold text-[#0033FF] mb-2">
                        {t("aboutUs.about.coreValues.items.cooperation.title")}
                      </h4>
                      <p className="text-sm text-[#0600AF]/90">
                        {t(
                          "aboutUs.about.coreValues.items.cooperation.content"
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Formation History */}
              <Card className="border-[#977DFF]/40 shadow-lg bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFCCF2] to-[#977DFF] rounded-full flex items-center justify-center">
                      <History className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0033FF]">
                      {t("aboutUs.about.history.title")}
                    </h3>
                  </div>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <Badge className="bg-gradient-to-r from-[#FFCCF2] to-[#F2E6EE] text-[#0033FF] px-3 py-1 border-0 font-semibold">
                          {t("aboutUs.about.history.items.founding.year")}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0033FF] mb-2">
                          {t("aboutUs.about.history.items.founding.title")}
                        </h4>
                        <p className="text-[#0600AF]/90">
                          {t("aboutUs.about.history.items.founding.content")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <Badge className="bg-gradient-to-r from-[#F2E6EE] to-[#FFCCF2] text-[#0033FF] px-3 py-1 border-0 font-semibold">
                          {t("aboutUs.about.history.items.expansion.year")}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0033FF] mb-2">
                          {t("aboutUs.about.history.items.expansion.title")}
                        </h4>
                        <p className="text-[#0600AF]/90">
                          {t("aboutUs.about.history.items.expansion.content")}
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
              <Card className="border-[#FFCCF2]/40 shadow-lg bg-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-[#0033FF] mb-6 text-center">
                    {t("aboutUs.executive.title")}
                  </h3>
                  <div className="bg-gradient-to-br from-[#F2E6EE] to-[#FFCCF2]/30 p-8 rounded-lg border border-[#FFCCF2]/40">
                    <div className="text-center space-y-8">
                      {/* Chủ tịch */}
                      <div className="flex justify-center">
                        <div className="bg-gradient-to-br from-[#FFCCF2] to-[#977DFF] text-white px-6 py-4 rounded-lg shadow-lg">
                          <div className="font-bold text-lg">
                            {t("aboutUs.executive.chairman.title")}
                          </div>
                          <div className="text-sm opacity-90">
                            {t("aboutUs.executive.chairman.name")}
                          </div>
                        </div>
                      </div>

                      {/* Phó Chủ tịch */}
                      <div className="flex justify-center gap-8">
                        <div className="bg-gradient-to-br from-[#977DFF] to-[#0033FF] text-white px-6 py-4 rounded-lg shadow-lg">
                          <div className="font-bold">
                            {t("aboutUs.executive.viceChairman.fullTime.title")}
                          </div>
                          <div className="text-sm opacity-90">
                            {t(
                              "aboutUs.executive.viceChairman.fullTime.subtitle"
                            )}
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#F2E6EE] to-[#FFCCF2] text-[#0033FF] px-6 py-4 rounded-lg shadow-lg border border-[#FFCCF2]/40">
                          <div className="font-bold">
                            {t("aboutUs.executive.viceChairman.partTime.title")}
                          </div>
                          <div className="text-sm opacity-90">
                            {t(
                              "aboutUs.executive.viceChairman.partTime.subtitle"
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Các ban chuyên môn */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-[#FFCCF2] to-[#F2E6EE] text-[#0033FF] px-4 py-3 rounded-lg shadow border border-[#FFCCF2]/40">
                          <div className="font-semibold">
                            {t("aboutUs.executive.departments.research.title")}
                          </div>
                          <div className="text-sm opacity-90">
                            {t(
                              "aboutUs.executive.departments.research.subtitle"
                            )}
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#F2E6EE] to-[#FFCCF2] text-[#0033FF] px-4 py-3 rounded-lg shadow border border-[#FFCCF2]/40">
                          <div className="font-semibold">
                            {t(
                              "aboutUs.executive.departments.international.title"
                            )}
                          </div>
                          <div className="text-sm opacity-90">
                            {t(
                              "aboutUs.executive.departments.international.subtitle"
                            )}
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#FFCCF2] to-[#977DFF] text-white px-4 py-3 rounded-lg shadow">
                          <div className="font-semibold">
                            {t(
                              "aboutUs.executive.departments.communication.title"
                            )}
                          </div>
                          <div className="text-sm opacity-90">
                            {t(
                              "aboutUs.executive.departments.communication.subtitle"
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Văn phòng */}
                      <div className="flex justify-center">
                        <div className="bg-gradient-to-br from-[#977DFF] to-[#0033FF] text-white px-6 py-4 rounded-lg shadow-lg">
                          <div className="font-bold">
                            {t("aboutUs.executive.office.title")}
                          </div>
                          <div className="text-sm opacity-90">
                            {t("aboutUs.executive.office.subtitle")}
                          </div>
                        </div>
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
              <Card className="border-[#977DFF]/40 shadow-lg bg-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-[#0033FF] mb-6 text-center">
                    {t("aboutUs.standing.title")}
                  </h3>
                  <div className="bg-gradient-to-br from-[#F2E6EE] to-[#FFCCF2]/30 p-8 rounded-lg border border-[#FFCCF2]/40">
                    <div className="text-center space-y-6">
                      {/* Trưởng ban */}
                      <div className="flex justify-center">
                        <div className="bg-gradient-to-br from-[#FFCCF2] to-[#977DFF] text-white px-8 py-4 rounded-lg shadow-lg">
                          <div className="font-bold text-lg">
                            {t("aboutUs.standing.head.title")}
                          </div>
                          <div className="text-sm opacity-90">
                            {t("aboutUs.standing.head.subtitle")}
                          </div>
                        </div>
                      </div>

                      {/* Các thành viên thường vụ */}
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-[#F2E6EE] to-[#FFCCF2] text-[#0033FF] px-4 py-3 rounded-lg shadow border border-[#FFCCF2]/40">
                          <div className="font-semibold text-sm">
                            {t("aboutUs.standing.members.viceChairman.title")}
                          </div>
                          <div className="text-xs opacity-90">
                            {t(
                              "aboutUs.standing.members.viceChairman.subtitle"
                            )}
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#FFCCF2] to-[#F2E6EE] text-[#0033FF] px-4 py-3 rounded-lg shadow border border-[#FFCCF2]/40">
                          <div className="font-semibold text-sm">
                            {t("aboutUs.standing.members.secretary.title")}
                          </div>
                          <div className="text-xs opacity-90">
                            {t("aboutUs.standing.members.secretary.subtitle")}
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#F2E6EE] to-[#977DFF] text-white px-4 py-3 rounded-lg shadow">
                          <div className="font-semibold text-sm">
                            {t("aboutUs.standing.members.viceSecretary.title")}
                          </div>
                          <div className="text-xs opacity-90">
                            {t(
                              "aboutUs.standing.members.viceSecretary.subtitle"
                            )}
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#977DFF] to-[#FFCCF2] text-white px-4 py-3 rounded-lg shadow">
                          <div className="font-semibold text-sm">
                            {t("aboutUs.standing.members.member.title")}
                          </div>
                          <div className="text-xs opacity-90">
                            {t("aboutUs.standing.members.member.subtitle")}
                          </div>
                        </div>
                      </div>

                      {/* Nhiệm vụ */}
                      <div className="bg-white p-6 rounded-lg shadow border-2 border-[#FFCCF2]/40">
                        <h4 className="font-bold text-[#0033FF] mb-4">
                          {t("aboutUs.standing.tasks.title")}
                        </h4>
                        <div className="grid md:grid-cols-3 gap-4 text-left">
                          <ul className="space-y-2 text-sm text-[#0600AF]/90">
                            <li>{t("aboutUs.standing.tasks.items.daily")}</li>
                            <li>
                              {t("aboutUs.standing.tasks.items.resolutions")}
                            </li>
                          </ul>
                          <ul className="space-y-2 text-sm text-[#0600AF]/90">
                            <li>
                              {t("aboutUs.standing.tasks.items.cooperation")}
                            </li>
                            <li>
                              {t("aboutUs.standing.tasks.items.activities")}
                            </li>
                          </ul>
                          <ul className="space-y-2 text-sm text-[#0600AF]/90">
                            <li>
                              {t("aboutUs.standing.tasks.items.management")}
                            </li>
                            <li>{t("aboutUs.standing.tasks.items.reports")}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Điều lệ NDA Section */}
          {activeTab === "charter" && (
            <div className="animate-in fade-in duration-500">
              <Card className="border-[#FFCCF2]/40 shadow-lg bg-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-[#0033FF] mb-6 text-center">
                    {t("aboutUs.charter.title")}
                  </h3>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Charter Preview */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-[#0033FF]">
                        {t("aboutUs.charter.preview.title")}
                      </h4>
                      <div className="border-2 border-[#FFCCF2]/40 rounded-lg p-4 bg-gradient-to-br from-[#F2E6EE] to-[#FFCCF2]/20">
                        <Image
                          src="/vietnamese-legal-document.svg"
                          alt="Điều lệ NDA - Trang 1"
                          width={600}
                          height={800}
                          className="w-full h-auto rounded shadow-lg"
                        />
                      </div>
                    </div>

                    {/* Charter Information */}
                    <div className="space-y-6">
                      <h4 className="text-lg font-semibold text-[#0033FF] mb-4">
                        {t("aboutUs.charter.info.title")}
                      </h4>
                      <div className="bg-gradient-to-br from-[#F2E6EE] to-[#FFCCF2]/30 p-6 rounded-lg border border-[#FFCCF2]/40">
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium text-[#0033FF]">
                              {t("aboutUs.charter.info.fields.name")}
                            </span>
                            <span className="text-[#0600AF]/90">
                              {t("aboutUs.charter.info.document")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-[#0033FF]">
                              {t("aboutUs.charter.info.fields.date")}
                            </span>
                            <span className="text-[#0600AF]/90">
                              {t("aboutUs.charter.info.issueDate")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-[#0033FF]">
                              {t("aboutUs.charter.info.fields.pages")}
                            </span>
                            <span className="text-[#0600AF]/90">
                              {t("aboutUs.charter.info.pages")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-[#0033FF]">
                              {t("aboutUs.charter.info.fields.format")}
                            </span>
                            <span className="text-[#0600AF]/90">
                              {t("aboutUs.charter.info.format")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-[#FFCCF2]/20 to-[#F2E6EE] p-6 rounded-lg border border-[#FFCCF2]/40">
                        <h4 className="text-lg font-semibold text-[#0033FF] mb-4">
                          {t("aboutUs.charter.content.title")}
                        </h4>
                        <ul className="space-y-2 text-sm text-[#0600AF]/90">
                          <li>
                            {t("aboutUs.charter.content.chapters.general")}
                          </li>
                          <li>
                            {t("aboutUs.charter.content.chapters.objectives")}
                          </li>
                          <li>
                            {t("aboutUs.charter.content.chapters.members")}
                          </li>
                          <li>
                            {t("aboutUs.charter.content.chapters.structure")}
                          </li>
                          <li>
                            {t("aboutUs.charter.content.chapters.finance")}
                          </li>
                          <li>
                            {t("aboutUs.charter.content.chapters.relations")}
                          </li>
                          <li>
                            {t("aboutUs.charter.content.chapters.others")}
                          </li>
                        </ul>
                      </div>

                      <div className="text-center">
                        <Button className="bg-gradient-to-r from-[#FFCCF2] to-[#977DFF] hover:from-[#977DFF] hover:to-[#0033FF] text-white px-8 py-3 border-0 transition-all duration-300">
                          <Download className="w-5 h-5 mr-2" />
                          {t("aboutUs.charter.download.button")}
                        </Button>
                        <p className="text-sm text-[#0600AF]/90 mt-2">
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
