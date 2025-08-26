"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";
import Image from "next/image";
import { useLocale } from "@/hooks/useLocale";

interface FlipBookProps {
  pages: string[]; // Array of image URLs
  title?: string;
  className?: string;
}

export default function FlipBook({
  pages,
  title = "Document",
  className = "",
}: FlipBookProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLocale();

  const totalPages = pages.length;
  const isLastPage = currentPage >= totalPages - 1;
  const isFirstPage = currentPage <= 0;

  // Next page function
  const nextPage = () => {
    if (isLastPage || isFlipping) return;

    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage((prev) => prev + 1);
    }, 400); // Page change in middle of animation
    setTimeout(() => {
      setIsFlipping(false);
    }, 800); // Animation complete
  };

  // Previous page function
  const prevPage = () => {
    if (isFirstPage || isFlipping) return;

    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage((prev) => prev - 1);
    }, 400); // Page change in middle of animation
    setTimeout(() => {
      setIsFlipping(false);
    }, 800); // Animation complete
  };

  // Go to specific page
  const goToPage = (pageIndex: number) => {
    if (
      pageIndex < 0 ||
      pageIndex >= totalPages ||
      isFlipping ||
      pageIndex === currentPage
    )
      return;

    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage(pageIndex);
    }, 400);
    setTimeout(() => {
      setIsFlipping(false);
    }, 800);
  };

  // Zoom controls
  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));
  const resetZoom = () => setZoom(1);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          nextPage();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prevPage();
          break;
        case "Escape":
          setIsFullscreen(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPage, isFlipping]);

  return (
    <div
      className={`flipbook-container ${className} ${
        isFullscreen
          ? "w-full min-h-screen bg-gradient-to-br from-slate-50 via-gray-50/80 to-white"
          : ""
      }`}
      ref={containerRef}
    >
      {/* Header Controls - Modern Glass Morphism */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg rounded-t-2xl gap-3 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-start">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#0033FF]/10 to-[#977DFF]/10 rounded-full border border-[#0033FF]/20">
            <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#0033FF] to-[#977DFF] bg-clip-text text-transparent truncate max-w-[200px] sm:max-w-none">
              {title}
            </h3>
          </div>
          <div className="px-2 sm:px-3 py-1 bg-gradient-to-r from-slate-100 to-blue-50 rounded-full border border-slate-200/50">
            <span className="text-xs sm:text-sm font-medium text-[#0600AF]">
              {currentPage + 1} / {totalPages}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
          {/* Modern Zoom Controls */}
          <div className="flex items-center gap-1 p-1 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 shadow-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomOut}
              disabled={zoom <= 0.5}
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg hover:bg-white/80 disabled:opacity-40 transition-all duration-200"
              title={t("flipbook.controls.zoomOut")}
            >
              <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4 text-[#0033FF]" />
            </Button>
            <div className="px-1 sm:px-2 py-1 min-w-[2.5rem] sm:min-w-[3.5rem] text-center">
              <span className="text-xs font-semibold text-[#0600AF]">
                {Math.round(zoom * 100)}%
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomIn}
              disabled={zoom >= 3}
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg hover:bg-white/80 disabled:opacity-40 transition-all duration-200"
              title={t("flipbook.controls.zoomIn")}
            >
              <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4 text-[#0033FF]" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetZoom}
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg hover:bg-white/80 transition-all duration-200"
              title={t("flipbook.controls.reset")}
            >
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 text-[#977DFF]" />
            </Button>
          </div>

          {/* Modern Fullscreen Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#0033FF] to-[#977DFF] hover:from-[#977DFF] hover:to-[#0033FF] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            title={
              isFullscreen
                ? t("flipbook.controls.exitFullscreen")
                : t("flipbook.controls.fullscreen")
            }
          >
            <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>

      {/* Main FlipBook Area - Modern Design */}
      <div
        className="relative bg-gradient-to-br from-slate-50 via-gray-50/30 to-slate-100/50 overflow-hidden backdrop-blur-sm"
        style={{
          height: isFullscreen ? "calc(100vh - 120px)" : "800px",
          minHeight: isFullscreen ? "600px" : "400px",
        }}
      >
        {/* Modern Book Shadow/Base */}
        <div className="absolute inset-6 bg-gradient-to-br from-slate-900/10 to-gray-900/20 rounded-2xl transform rotate-1 blur-sm"></div>
        <div className="absolute inset-5 bg-gradient-to-br from-slate-800/10 to-gray-800/15 rounded-2xl transform rotate-0.5 blur-sm"></div>
        <div className="absolute inset-4 bg-gradient-to-br from-white/40 to-gray-100/60 rounded-2xl backdrop-blur-sm"></div>

        {/* Pages Container */}
        <div className="relative h-full flex items-center justify-center p-8">
          <div
            className="relative bg-white/98 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-white/30 book-perspective"
            style={{
              width: isFullscreen
                ? typeof window !== "undefined" && window.innerWidth < 768
                  ? "75vw"
                  : typeof window !== "undefined" && window.innerWidth < 1024
                  ? "65vw"
                  : "55vw"
                : "350px",
              height: isFullscreen
                ? typeof window !== "undefined" && window.innerWidth < 768
                  ? "85vh"
                  : "88vh"
                : "750px",
              maxWidth: isFullscreen ? "800px" : "500px",
              maxHeight: isFullscreen ? "90vh" : "1000px",
              aspectRatio: "1 / 1.5", // Taller rectangle ratio for documents
              transform: `scale(${zoom})`,
              transformOrigin: "center",
              boxShadow:
                "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.3)",
            }}
          >
            {/* Current Page */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              {pages[currentPage] && (
                <Image
                  src={pages[currentPage]}
                  alt={`${title} - Trang ${currentPage + 1}`}
                  fill
                  className="object-contain bg-white"
                  quality={95}
                  priority={currentPage <= 2}
                />
              )}
            </div>

            {/* Next Page (for flipping effect) */}
            {!isLastPage && (
              <div
                className={`absolute inset-0 bg-white cursor-pointer rounded-2xl overflow-hidden transition-transform duration-700 ease-in-out origin-left ${
                  isFlipping ? "flip-page" : ""
                }`}
                onClick={nextPage}
                style={{
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  transform: isFlipping ? "rotateY(-180deg)" : "rotateY(0deg)",
                }}
              >
                {pages[currentPage + 1] && (
                  <Image
                    src={pages[currentPage + 1]}
                    alt={`${title} - Trang ${currentPage + 2}`}
                    fill
                    className="object-contain bg-white"
                    quality={95}
                  />
                )}
              </div>
            )}

            {/* Modern Page Curl Effect */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-transparent via-gray-100/20 to-slate-300/30 transform rotate-45 translate-x-8 -translate-y-8 pointer-events-none rounded-full blur-sm"></div>
            <div className="absolute top-1 right-1 w-8 h-8 bg-gradient-to-br from-transparent to-slate-400/20 transform rotate-45 translate-x-4 -translate-y-4 pointer-events-none"></div>
          </div>
        </div>

        {/* Modern Navigation Buttons */}
        <Button
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-white/90 backdrop-blur-xl hover:bg-white border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-30 disabled:hover:shadow-xl z-20"
          onClick={prevPage}
          disabled={isFirstPage || isFlipping}
        >
          <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7 text-[#0033FF]" />
        </Button>

        <Button
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-white/90 backdrop-blur-xl hover:bg-white border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-30 disabled:hover:shadow-xl z-20"
          onClick={nextPage}
          disabled={isLastPage || isFlipping}
        >
          <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 text-[#0033FF]" />
        </Button>
      </div>

      {/* Modern Bottom Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 bg-white/80 backdrop-blur-xl border-t border-white/20 shadow-lg rounded-b-2xl gap-4 sm:gap-0">
        {/* Modern Page Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 order-2 sm:order-1">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={isFirstPage || isFlipping}
            className="px-3 sm:px-4 py-2 h-9 sm:h-10 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl hover:bg-white/80 hover:border-[#0033FF]/30 disabled:opacity-40 transition-all duration-200 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4 sm:mr-2 text-[#0033FF]" />
            <span className="hidden sm:inline font-medium text-[#0033FF]">
              {t("flipbook.navigation.previousPage")}
            </span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={isLastPage || isFlipping}
            className="px-3 sm:px-4 py-2 h-9 sm:h-10 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl hover:bg-white/80 hover:border-[#977DFF]/30 disabled:opacity-40 transition-all duration-200 shadow-sm"
          >
            <span className="hidden sm:inline font-medium text-[#977DFF]">
              {t("flipbook.navigation.nextPage")}
            </span>
            <ChevronRight className="w-4 h-4 sm:ml-2 text-[#977DFF]" />
          </Button>
        </div>

        {/* Modern Page Indicators */}
        <div className="flex gap-1 sm:gap-2 p-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 shadow-sm order-1 sm:order-2 max-w-[200px] sm:max-w-none overflow-x-auto">
          {pages.slice(0, Math.min(pages.length, 12)).map((_, index) => (
            <button
              key={index}
              className={`relative transition-all duration-300 flex-shrink-0 ${
                index === currentPage
                  ? "w-6 sm:w-8 h-2 sm:h-3 bg-gradient-to-r from-[#0033FF] to-[#977DFF] rounded-full scale-110 shadow-lg"
                  : "w-2 sm:w-3 h-2 sm:h-3 bg-slate-300/80 hover:bg-slate-400/80 rounded-full hover:scale-110"
              }`}
              onClick={() => goToPage(index)}
            />
          ))}
          {pages.length > 12 && (
            <div className="flex items-center px-1 sm:px-2">
              <span className="text-xs text-[#0600AF]/60 font-medium">...</span>
            </div>
          )}
        </div>

        {/* Modern Page Input */}
        <div className="flex items-center gap-2 sm:gap-3 p-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 shadow-sm order-3">
          <span className="text-xs sm:text-sm font-medium text-[#0600AF]">
            {t("flipbook.navigation.goTo")}
          </span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage + 1}
            onChange={(e) => goToPage(parseInt(e.target.value) - 1)}
            className="w-10 sm:w-14 h-7 sm:h-8 text-center text-xs sm:text-sm font-semibold bg-white/80 border border-white/60 rounded-lg focus:border-[#0033FF] focus:ring-2 focus:ring-[#0033FF]/20 transition-all duration-200"
          />
          <span className="text-xs sm:text-sm font-medium text-[#0600AF]/70">
            {t("flipbook.navigation.pageOf")} {totalPages}
          </span>
        </div>
      </div>

      {/* Modern Custom CSS for 3D effects */}
      <style jsx>{`
        .book-perspective {
          perspective: 2000px;
          perspective-origin: center center;
        }

        .flip-page {
          animation: flipPageAnimation 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)
            forwards;
        }

        @keyframes flipPageAnimation {
          0% {
            transform: rotateY(0deg);
            box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1);
            filter: brightness(1);
          }
          20% {
            transform: rotateY(-30deg);
            box-shadow: 0 15px 40px -5px rgba(0, 0, 0, 0.15);
            filter: brightness(0.98);
          }
          50% {
            transform: rotateY(-90deg);
            box-shadow: 0 20px 50px -5px rgba(0, 0, 0, 0.2);
            filter: brightness(0.94);
          }
          80% {
            transform: rotateY(-150deg);
            box-shadow: 0 15px 40px -5px rgba(0, 0, 0, 0.15);
            filter: brightness(0.98);
          }
          100% {
            transform: rotateY(-180deg);
            box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1);
            filter: brightness(1);
          }
        }

        /* Smooth transition for non-animated state */
        .transition-transform {
          transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Modern Scrollbar Styling */
        .flipbook-container::-webkit-scrollbar {
          display: none;
        }

        .flipbook-container {
          scrollbar-width: none;
        }

        /* Enhanced Glass Morphism */
        .backdrop-blur-xl {
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }

        /* Modern Button Hover Effects */
        .flipbook-container button:hover {
          transform: translateY(-1px);
        }

        .flipbook-container button:active {
          transform: translateY(0);
        }

        /* Smooth Zoom Transition */
        .book-perspective > div {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Enhanced Shadow Effects */
        .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 25px 25px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.3);
        }

        /* Modern Gradient Text */
        .bg-clip-text {
          -webkit-background-clip: text;
          background-clip: text;
        }
      `}</style>
    </div>
  );
}
