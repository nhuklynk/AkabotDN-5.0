"use client";

import { MapPin, Phone, Mail, User, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/useLocale";

export default function ContactPage() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0033FF] to-[#977DFF] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t("contact.hero.title")}
            </h1>
            <p className="text-xl text-white/90 mb-8">
              {t("contact.hero.subtitle")}
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>{t("contact.hero.phone")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>{t("contact.hero.email")}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{t("contact.hero.address")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Main Content - Contact Info & Map */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Contact Information & Quick Contact */}
          <div className="space-y-6">
            {/* Contact Information Card */}
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#0033FF]">
                  {t("contact.info.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-[#0033FF] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0600AF]">
                      {t("contact.info.contactPerson.title")}
                    </p>
                    <p className="text-[#0600AF]/80">
                      {t("contact.info.contactPerson.name")}
                    </p>
                    <p className="text-sm text-[#0600AF]/60">
                      {t("contact.info.contactPerson.position")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#0033FF] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0600AF]">
                      {t("contact.info.office.title")}
                    </p>
                    <p className="text-[#0600AF]/80 whitespace-pre-line">
                      {t("contact.info.office.address")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#0033FF] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0600AF]">
                      {t("contact.info.phone.title")}
                    </p>
                    <p className="text-[#0600AF]/80">
                      {t("contact.info.phone.number")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#0033FF] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0600AF]">
                      {t("contact.info.email.title")}
                    </p>
                    <div className="space-y-1">
                      <p className="text-[#0600AF]/80">
                        {t("contact.info.email.primary")}
                      </p>
                      <p className="text-[#0600AF]/80">
                        {t("contact.info.email.secondary")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#0033FF] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0600AF]">
                      {t("contact.info.workingHours.title")}
                    </p>
                    <div className="text-[#0600AF]/80 text-sm">
                      <p>{t("contact.info.workingHours.weekdays")}</p>
                      <p>{t("contact.info.workingHours.saturday")}</p>
                      <p>{t("contact.info.workingHours.sunday")}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact Card */}
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-[#0033FF] mb-3">
                  {t("contact.quickContact.title")}
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#977DFF]/30 text-[#0033FF] hover:bg-[#977DFF]/10"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    {t("contact.quickContact.call")}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#977DFF]/30 text-[#0033FF] hover:bg-[#977DFF]/10"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    {t("contact.quickContact.email")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Map Section */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-[#0033FF] flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  {t("contact.map.title")}
                </CardTitle>
                <p className="text-[#0600AF]/70">{t("contact.map.subtitle")}</p>
              </CardHeader>
              <CardContent>
                <div className="aspect-square lg:aspect-[4/3] bg-gradient-to-br from-slate-50 to-blue-100 rounded-lg overflow-hidden border border-slate-200">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6962326256447!2d105.84117731533447!3d21.01624939383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab86a2e8c4e7%3A0x5c4a8b8b8b8b8b8b!2sCung%20V%C4%83n%20h%C3%B3a%20Thanh%20ni%C3%AAn!5e0!3m2!1svi!2s!4v1635000000000!5m2!1svi!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={t("contact.map.title")}
                  ></iframe>
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200">
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-[#0033FF] mb-1">
                        {t("contact.map.fullAddress.title")}
                      </p>
                      <p className="text-sm text-[#0600AF]/80 whitespace-pre-line">
                        {t("contact.map.fullAddress.content")}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#0033FF] mb-1">
                        {t("contact.map.transportation.title")}
                      </p>
                      <p className="text-sm text-[#0600AF]/80 whitespace-pre-line">
                        {t("contact.map.transportation.content")}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#0033FF] mb-1">
                        {t("contact.map.postalCode.title")}
                      </p>
                      <p className="text-sm text-[#0600AF]/80 whitespace-pre-line">
                        {t("contact.map.postalCode.content")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
