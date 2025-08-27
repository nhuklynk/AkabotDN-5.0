"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";
import { truncateText } from "@/utils/textUtils";
import { useLocale } from "@/hooks/useLocale";
import { useEvents } from "@/hooks/useEvents";

interface EventsGridProps {
  showUpcoming?: boolean;
  limit?: number;
}

export function EventsGrid({
  showUpcoming = true,
  limit = 6,
}: EventsGridProps) {
  const { t } = useLocale();
  const [mounted, setMounted] = useState(false);

  const { events, loading, error } = useEvents({
    initialLimit: limit,
    upcoming: showUpcoming,
  });
  console.log(events);

  // Set mounted state for client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg" />
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error && events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error}</p>
      </div>
    );
  }

  // Use fallback if no events
  const displayEvents = events.length > 0 ? events : [];

  if (displayEvents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t("events.noEvents")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayEvents.slice(0, limit).map((event) => {
        const startTime = new Date(event.start_time);
        const endTime = event.end_time ? new Date(event.end_time) : null;
        const now = new Date();
        const isUpcoming = startTime > now;
        const isOngoing = startTime <= now && (!endTime || endTime > now);
        const isPast = endTime && endTime < now;

        return (
          <Card
            key={event.id}
            className="group hover:shadow-lg transition-shadow border-slate-200 shadow-lg overflow-hidden"
          >
            <Link href={`/activities/${event.id}`}>
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={event.thumbnail_url_id || "/icons/event-placeholder.svg"}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Event Status Badge */}
                <div className="absolute top-3 left-3">
                  <Badge
                    variant={
                      isUpcoming
                        ? "default"
                        : isOngoing
                        ? "destructive"
                        : "secondary"
                    }
                    className={
                      isUpcoming
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : isOngoing
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-gray-100 text-gray-800 border-gray-200"
                    }
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    {isUpcoming
                      ? t("events.upcoming")
                      : isOngoing
                      ? t("events.ongoing")
                      : t("events.past")}
                  </Badge>
                </div>

                {/* Countdown Badge */}
                {event.countdown_enabled && isUpcoming && (
                  <div className="absolute top-3 right-3">
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800 border-yellow-200"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {t("events.countdown")}
                    </Badge>
                  </div>
                )}

                {/* Category Badge */}
                {event.categories && event.categories.length > 0 && (
                  <div className="absolute bottom-3 right-3">
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-800 border-emerald-200"
                    >
                      {event.categories[0].name}
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader>
                <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {truncateText(event.title, 60)}
                </CardTitle>

                {/* Event Meta */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {mounted
                        ? formatDate(event.start_time)
                        : event.start_time.split("T")[0]}
                    </span>
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {truncateText(
                    event.description || t("events.noDescription"),
                    120
                  )}
                </p>

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {event.tags.slice(0, 2).map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="text-xs px-2 py-0.5"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                    {event.tags.length > 2 && (
                      <span className="text-xs text-muted-foreground">
                        +{event.tags.length - 2} {t("events.moreTags")}
                      </span>
                    )}
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  {t("events.viewDetails")}
                </Button>
              </CardContent>
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
