"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="bg-gradient-to-b from-[#977DFF] to-[#0600AF]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded flex items-center justify-center overflow-hidden">
                <img
                  src="/icons/logo.png"
                  alt="Hiệp hội Dữ liệu Quốc gia Việt Nam"
                  width={32}
                  height={32}
                  className="object-contain h-8 w-8"
                />
              </div>
              <div>
                <h3 className="font-bold text-white">
                  {t("footer.organization.name")}
                </h3>
                <p className="text-sm text-[#FFCCF2]">
                  {t("footer.organization.subtitle")}
                </p>
              </div>
            </div>
            <p className="text-sm text-white/90 leading-relaxed">
              {t("footer.organization.description")}
            </p>
            <div className="flex space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 text-white hover:text-[#FFCCF2] hover:bg-[#FFCCF2]/10"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 text-white hover:text-[#FFCCF2] hover:bg-[#FFCCF2]/10"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 text-white hover:text-[#FFCCF2] hover:bg-[#FFCCF2]/10"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">
              {t("footer.quickLinks.title")}
            </h4>
            <nav className="flex flex-col space-y-2">
              <a
                href="#"
                className="text-sm text-white/80 hover:text-[#FFCCF2] transition-colors"
              >
                {t("footer.quickLinks.about")}
              </a>
              <a
                href="#"
                className="text-sm text-white/80 hover:text-[#FFCCF2] transition-colors"
              >
                {t("footer.quickLinks.leadership")}
              </a>
              <a
                href="#"
                className="text-sm text-white/80 hover:text-[#FFCCF2] transition-colors"
              >
                {t("footer.quickLinks.executive")}
              </a>
              <a
                href="#"
                className="text-sm text-white/80 hover:text-[#FFCCF2] transition-colors"
              >
                {t("footer.quickLinks.documents")}
              </a>
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">
              {t("footer.services.title")}
            </h4>
            <nav className="flex flex-col space-y-2">
              <a
                href="#"
                className="text-sm text-white/80 hover:text-[#FFCCF2] transition-colors"
              >
                {t("footer.services.digitalProducts")}
              </a>
              <a
                href="#"
                className="text-sm text-white/80 hover:text-[#FFCCF2] transition-colors"
              >
                {t("footer.services.memberRegistration")}
              </a>
              <a
                href="#"
                className="text-sm text-white/80 hover:text-[#FFCCF2] transition-colors"
              >
                {t("footer.services.activities")}
              </a>
              <a
                href="#"
                className="text-sm text-white/80 hover:text-[#FFCCF2] transition-colors"
              >
                {t("footer.services.events")}
              </a>
            </nav>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">
              {t("footer.contact.title")}
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-[#FFCCF2] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-white/80">
                  {t("footer.contact.address")}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-[#FFCCF2]" />
                <p className="text-sm text-white/80">
                  {t("footer.contact.phone")}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-[#FFCCF2]" />
                <p className="text-sm text-white/80">
                  {t("footer.contact.email")}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-sm font-medium text-white">
                {t("footer.newsletter.title")}
              </h5>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder={t("footer.newsletter.placeholder")}
                  className="text-sm border-[#FFCCF2]/30 focus:border-[#FFCCF2] focus:ring-[#FFCCF2]/20"
                />
                <Button
                  size="sm"
                  className="bg-[#0033FF] hover:bg-[#0600AF] text-white border-0"
                >
                  {t("footer.newsletter.button")}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#FFCCF2]/20 mt-12 pt-8 text-center">
          <p className="text-sm text-white/80">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
