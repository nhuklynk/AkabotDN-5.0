"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/hooks/useLocale";

interface CountdownTimerProps {
  targetDate: string | Date;
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function CountdownTimer({
  targetDate,
  className = "",
}: CountdownTimerProps) {
  const { t } = useLocale();
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeRemaining({
          days,
          hours,
          minutes,
          seconds,
          isExpired: false,
        });
      } else {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
      }
    };

    // Calculate immediately
    calculateTimeRemaining();

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    // Cleanup
    return () => clearInterval(interval);
  }, [targetDate, mounted]);

  if (!mounted) {
    return (
      <div className={`flex justify-center items-center gap-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-16 w-16 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-16 w-16 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-16 w-16 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-16 w-16 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (timeRemaining.isExpired) {
    return (
      <div className={`text-center ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800 text-xl font-semibold">
            {t("countdown.expired")}
          </p>
          <p className="text-red-600 text-sm mt-2">
            {t("countdown.eventStarted")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t("countdown.timeUntilEvent")}
        </h3>
      </div>

      <div className="flex justify-center items-center gap-4">
        {/* Days */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 min-w-[80px] text-center">
          <div className="text-2xl md:text-3xl font-bold text-blue-700">
            {timeRemaining.days.toString().padStart(2, "0")}
          </div>
          <div className="text-xs md:text-sm text-blue-600 font-medium mt-1">
            {t("countdown.days")}
          </div>
        </div>

        {/* Hours */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-4 min-w-[80px] text-center">
          <div className="text-2xl md:text-3xl font-bold text-emerald-700">
            {timeRemaining.hours.toString().padStart(2, "0")}
          </div>
          <div className="text-xs md:text-sm text-emerald-600 font-medium mt-1">
            {t("countdown.hours")}
          </div>
        </div>

        {/* Minutes */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4 min-w-[80px] text-center">
          <div className="text-2xl md:text-3xl font-bold text-orange-700">
            {timeRemaining.minutes.toString().padStart(2, "0")}
          </div>
          <div className="text-xs md:text-sm text-orange-600 font-medium mt-1">
            {t("countdown.minutes")}
          </div>
        </div>

        {/* Seconds */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 min-w-[80px] text-center">
          <div className="text-2xl md:text-3xl font-bold text-purple-700">
            {timeRemaining.seconds.toString().padStart(2, "0")}
          </div>
          <div className="text-xs md:text-sm text-purple-600 font-medium mt-1">
            {t("countdown.seconds")}
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          {t("countdown.startTime")}: {new Date(targetDate).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
