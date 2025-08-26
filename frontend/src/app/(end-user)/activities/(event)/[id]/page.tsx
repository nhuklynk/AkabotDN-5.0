"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "@/components/countdown-timer";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Share2,
  BookOpen,
} from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { useEventById } from "@/hooks/useEvents";
import { formatDate } from "@/utils/dateUtils";

export default function EventDetailPage() {
  const { t } = useLocale();
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const [mounted, setMounted] = useState(false);

  const { event, loading, error } = useEventById(eventId);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/home">
                  {t("activities.breadcrumb.home")}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/activities">
                  {t("activities.breadcrumb.activities")}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t("events.eventNotFound")}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="text-center py-16">
            <div className="mb-6">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {t("events.eventNotFound")}
            </h1>
            <p className="text-muted-foreground mb-8">
              {error || t("events.eventNotFoundDescription")}
            </p>
          </div>
        </main>
      </div>
    );
  }

  const startTime = new Date(event.start_time);
  const endTime = event.end_time ? new Date(event.end_time) : null;
  const now = new Date();
  const isUpcoming = startTime > now;
  const isOngoing = startTime <= now && (!endTime || endTime > now);
  const isPast = Boolean(endTime && endTime < now);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/home">
                {t("activities.breadcrumb.home")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/activities">
                {t("activities.breadcrumb.activities")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{event.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Image */}
            <div className="relative h-64 md:h-80 mb-8 rounded-lg overflow-hidden">
              <Image
                src={event.thumbnail_url_id || "/icons/event-placeholder.svg"}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />

              {/* Event Status Badge */}
              <div className="absolute top-4 left-4">
                <Badge
                  variant={
                    isUpcoming
                      ? "default"
                      : isOngoing
                      ? "destructive"
                      : "secondary"
                  }
                  className={`text-sm px-3 py-1 ${
                    isUpcoming
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : isOngoing
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-gray-100 text-gray-800 border-gray-200"
                  }`}
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  {isUpcoming
                    ? t("events.upcoming")
                    : isOngoing
                    ? t("events.ongoing")
                    : t("events.past")}
                </Badge>
              </div>

              {/* Share Button */}
              <div className="absolute top-4 right-4">
                <Button size="sm" variant="secondary">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Event Title and Description */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-4">
                {event.title}
              </h1>

              {event.description && (
                <div className="prose max-w-none text-muted-foreground">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              )}
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">
                  {t("events.tags")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <Badge key={tag.id} variant="outline" className="px-3 py-1">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 bg-white shadow-sm border-b border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {t("events.eventDetails")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Countdown Timer */}
                {event.countdown_enabled && isUpcoming && (
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      {t("events.countdown")}
                    </h4>
                    <CountdownTimer targetDate={event.start_time} />
                  </div>
                )}

                {/* Date & Time */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">
                        {t("events.startDate")}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {mounted ? formatDate(event.start_time) : "Loading..."}
                      </p>
                    </div>
                  </div>

                  {event.end_time && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground">
                          {t("events.endDate")}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {mounted ? formatDate(event.end_time) : "Loading..."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Location */}
                {event.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">
                        {t("events.location")}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {event.location}
                      </p>
                    </div>
                  </div>
                )}

                {/* Categories */}
                {event.categories && event.categories.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">
                      {t("events.categories")}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {event.categories.map((category) => (
                        <Badge
                          key={category.id}
                          variant="secondary"
                          className="bg-emerald-100 text-emerald-800 border-emerald-200"
                        >
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t">
                  <Button className="w-full" size="lg" disabled={isPast}>
                    <Users className="w-4 h-4 mr-2" />
                    {isPast ? t("events.eventEnded") : t("events.registerNow")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
