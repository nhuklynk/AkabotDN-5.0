"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/pagination-component";
import Image from "next/image";
import { Play, Image as ImageIcon, Calendar, Loader2, Expand, X, ZoomIn, ZoomOut, RotateCw, SkipBack, SkipForward } from "lucide-react";
import { useImageMedia, useVideoMedia } from "@/hooks/useMedia";
import { MediaType } from "@/services/end-user/mediaService";
import { useMediaStatistics } from "@/hooks/useMediaStatistics";
import { useTranslation } from "react-i18next";
import { initI18n } from "@/lib/i18n/config";

// Icon mapping for different types
const getIconForType = (type: string) => {
  switch (type.toLowerCase()) {
    case 'images':
      return ImageIcon;
    case 'videos':
      return Play;
    case 'events':
      return Calendar;
    default:
      return ImageIcon;
  }
};

export default function TuLieuPage() {
  // Initialize i18n
  initI18n();
  const { t } = useTranslation();
  
  const [activeTab, setActiveTab] = useState<"images" | "videos">("images");
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [modalImageName, setModalImageName] = useState<string>("");
  const [modalMediaType, setModalMediaType] = useState<string>("");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Hooks for statistics and media data
  const { statistics, loading: statisticsLoading, error: statisticsError } = useMediaStatistics();
  const imageHook = useImageMedia(9);
  const videoHook = useVideoMedia(9);

  // Simple fallback function for translations
  const safeT = (key: string, fallback: string) => {
    try {
      const translated = t(key);
      return translated === key ? fallback : translated;
    } catch {
      return fallback;
    }
  };

  // Select the appropriate hook based on active tab
  const currentHook = activeTab === "images" ? imageHook : videoHook;
  const { media, loading, error, pagination, setCurrentPage } = currentHook;

  // Modal functions
  const openImageModal = (mediaUrl: string, mediaName: string, mediaType: string) => {
    setModalImage(mediaUrl);
    setModalImageName(mediaName);
    setModalMediaType(mediaType);
    setZoomLevel(1); // Reset zoom when opening new media
    setRotation(0); // Reset rotation when opening new media
  };

  const closeImageModal = () => {
    setModalImage(null);
    setModalImageName("");
    setModalMediaType("");
    setZoomLevel(1); // Reset zoom when closing
    setRotation(0); // Reset rotation when closing
  };

  // Zoom functions
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3)); // Max zoom 3x
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5)); // Min zoom 0.5x
  };

  const rotateImage = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // Video control functions
  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.duration || 0,
        videoRef.current.currentTime + 5
      );
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  // Handle keyboard shortcuts for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!modalImage) return;

      switch (e.key) {
        case 'Escape':
          closeImageModal();
          break;
        case '+':
        case '=':
          // Only allow zoom for images
          if (isImage(modalMediaType)) {
            e.preventDefault();
            zoomIn();
          }
          break;
        case '-':
          // Only allow zoom for images
          if (isImage(modalMediaType)) {
            e.preventDefault();
            zoomOut();
          }
          break;
        case 'r':
        case 'R':
          // Only allow rotation for images
          if (isImage(modalMediaType)) {
            e.preventDefault();
            rotateImage();
          }
          break;
        case 'ArrowLeft':
          // Skip backward for videos
          if (isVideo(modalMediaType)) {
            e.preventDefault();
            skipBackward();
          }
          break;
        case 'ArrowRight':
          // Skip forward for videos
          if (isVideo(modalMediaType)) {
            e.preventDefault();
            skipForward();
          }
          break;
        case ' ':
        case 'Space':
          // Toggle play/pause for videos
          if (isVideo(modalMediaType)) {
            e.preventDefault();
            togglePlayPause();
          }
          break;
      }
    };

    if (modalImage) {
      // Lock body scroll when modal is open
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [modalImage, modalMediaType]);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  const isVideo = (mimeType: string) => {
    return mimeType.startsWith('video/');
  };

  const isImage = (mimeType: string) => {
    return mimeType.startsWith('image/');
  };

  const removeFileExtension = (fileName: string) => {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) return fileName;
    return fileName.substring(0, lastDotIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0033FF] to-[#977DFF]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">
            {safeT('header.dropdown.products.documents.page.title', 'Tư liệu & Tài nguyên')}
          </h1>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            {safeT('header.dropdown.products.documents.page.description', 'Truy cập thư viện toàn diện các tài liệu, hình ảnh, video và tài nguyên được tuyển chọn cẩn thận để hỗ trợ nghiên cứu và học tập của bạn.')}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {statisticsLoading ? (
              <div className="flex items-center gap-2 text-white">
                <Loader2 className="h-5 w-5 animate-spin" />
                {safeT('header.navigation.documents.page.loadingStatistics', 'Đang tải thống kê...')}
              </div>
            ) : statisticsError ? (
              <div className="text-white/80">
                {safeT('header.navigation.documents.page.errorLoadingStatistics', 'Lỗi khi tải thống kê')}
              </div>
            ) : (
              statistics.map((stat, index) => {
                const IconComponent = getIconForType(stat.type);
                // Default fallback labels for translation keys
                const fallbackLabels: { [key: string]: string } = {
                  'header.dropdown.products.documents.page.statistics.images': 'Hình ảnh',
                  'header.dropdown.products.documents.page.statistics.videos': 'Video',
                  'header.dropdown.products.documents.page.statistics.events': 'Sự kiện'
                };
                const displayLabel = safeT(stat.label, fallbackLabels[stat.label] || stat.label);
                
                return (
              <div
                key={index}
                className="bg-gradient-to-br from-white/90 to-blue-100/90 backdrop-blur-sm rounded-2xl p-6 text-center min-w-[140px] border border-white/40 hover:from-white hover:to-cyan-100 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <div className="w-8 h-8 mx-auto mb-3 bg-gradient-to-br from-[#0033FF] to-blue-600 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-white" />
                </div>
                <div className="text-3xl font-bold mb-1 text-[#0033FF]">
                      {stat.formatted_count}
                </div>
                <div className="text-sm text-[#0033FF] font-medium">
                  {displayLabel}
                </div>
              </div>
                );
              })
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center gap-2 bg-gradient-to-r from-white/20 to-blue-100/20 backdrop-blur-sm rounded-2xl p-2 max-w-md mx-auto border border-white/40">
            <button
              onClick={() => setActiveTab("images")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "images"
                  ? "bg-gradient-to-r from-white to-cyan-100 text-[#0033FF] shadow-lg"
                  : "text-white hover:bg-white/20"
              }`}
            >
              <ImageIcon className="w-5 h-5" />
              {safeT('header.dropdown.products.documents.page.imagesSection', 'Hình ảnh')}
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "videos"
                  ? "bg-gradient-to-r from-white to-cyan-100 text-[#0033FF] shadow-lg"
                  : "text-white hover:bg-white/20"
              }`}
            >
              <Play className="w-5 h-5" />
              {safeT('header.dropdown.products.documents.page.videosSection', 'Video')}
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#0033FF]" />
              <span className="ml-2 text-[#0033FF] font-medium">
                {activeTab === "images" 
                  ? safeT('common:header.navigation.documents.page.loadingImages', 'Đang tải hình ảnh...')
                  : safeT('common:header.navigation.documents.page.loadingVideos', 'Đang tải video...')
                }
              </span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-600 font-medium">{error}</p>
                <button
                  onClick={() => currentHook.refreshMedia()}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  {safeT('common:common.retry', 'Thử lại')}
                </button>
              </div>
            </div>
          )}

          {/* Content Grid */}
          {!loading && !error && (
            <>
              {media.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
                    <p className="text-gray-600 font-medium">
                      {safeT('common:header.navigation.documents.page.noMediaFound', 'Không tìm thấy tài liệu phù hợp')}
                    </p>
                  </div>
                </div>
              ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {media.map((item) => (
              <Card
                key={item.id}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer bg-white border-slate-200 hover:border-[#977DFF]/60 hover:-translate-y-1 transform-gpu"
              >
                <div className="relative overflow-hidden">
                  <div className="relative w-full h-64">
                          {isImage(item.mime_type) ? (
                            <div className="relative w-full h-full overflow-hidden rounded-t-lg">
                    <Image
                                src={item.media_url}
                                alt={item.file_name}
                                fill
                                className="object-cover group-hover:scale-110 group-hover:brightness-90 transition-all duration-500 ease-out transform-gpu"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/default-image.svg";
                                }}
                              />
                            </div>
                          ) : isVideo(item.mime_type) ? (
                            <div className="relative w-full h-full overflow-hidden rounded-t-lg">
                              <video
                                src={item.media_url}
                                className="w-full h-full object-cover group-hover:scale-110 group-hover:brightness-75 transition-all duration-500 ease-out transform-gpu"
                                preload="metadata"
                                muted
                                playsInline
                                onError={(e) => {
                                  // Hide video and show fallback
                                  const target = e.target as HTMLVideoElement;
                                  target.classList.add('hidden');
                                  const container = target.parentElement;
                                  const fallback = container?.querySelector('.video-fallback') as HTMLElement;
                                  if (fallback) {
                                    fallback.classList.remove('hidden');
                                    fallback.classList.add('flex');
                                  }
                                }}
                                onLoadedData={(e) => {
                                  // Set time to get first frame for thumbnail
                                  const target = e.target as HTMLVideoElement;
                                  target.currentTime = 0.5; // Seek to 0.5 seconds for better frame
                                }}
                                onCanPlay={(e) => {
                                  // Ensure video shows first frame
                                  const target = e.target as HTMLVideoElement;
                                  if (target.currentTime === 0) {
                                    target.currentTime = 0.5;
                                  }
                                }}
                              />
                              {/* Video overlay gradient */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out backdrop-blur-[1px]"></div>
                              {/* Fallback for video load error */}
                              <div className="video-fallback absolute inset-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 items-center justify-center hidden">
                                <div className="text-center">
                                  <div className="w-16 h-16 bg-gradient-to-r from-[#0033FF] to-[#977DFF] rounded-lg flex items-center justify-center mx-auto">
                                    <Play className="w-8 h-8 text-white ml-1" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-[#0033FF] to-[#977DFF] rounded-lg flex items-center justify-center mx-auto">
                                  <ImageIcon className="w-8 h-8 text-white" />
                                </div>
                              </div>
                            </div>
                          )}
                          
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"></div>

                                                    {/* Expand Button for images only */}
                          {isImage(item.mime_type) && (
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openImageModal(item.media_url, removeFileExtension(item.file_name), item.mime_type);
                                }}
                                className="bg-gradient-to-r from-[#0033FF] to-[#977DFF] rounded-full p-3 shadow-xl hover:scale-110 transition-all duration-300 ease-out hover:shadow-2xl backdrop-blur-sm transform hover:rotate-12"
                              >
                                <Expand className="w-4 h-4 text-white" />
                              </button>
                      </div>
                    )}

                    {/* Play Button for videos */}
                          {isVideo(item.mime_type) && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                              <div className="relative">
                                {/* Pulse ring */}
                                <div className="absolute inset-0 bg-gradient-to-r from-[#0033FF] to-[#977DFF] rounded-full animate-ping opacity-30 scale-125"></div>
                                {/* Main button */}
                                <div 
                                  className="relative bg-gradient-to-r from-[#0033FF] to-[#977DFF] rounded-full p-5 shadow-2xl transform scale-90 group-hover:scale-100 transition-all duration-300 ease-out cursor-pointer hover:scale-105 hover:shadow-2xl backdrop-blur-sm ring-4 ring-white/20"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openImageModal(item.media_url, removeFileExtension(item.file_name), item.mime_type);
                                  }}
                                >
                                  <Play className="w-10 h-10 text-white ml-1 drop-shadow-lg" />
                                </div>
                        </div>
                      </div>
                    )}


                  </div>
                </div>

                <CardContent className="p-6">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-bold text-[#0033FF] text-lg leading-tight group-hover:text-[#0600AF] transition-colors duration-300 truncate min-w-0 flex-1">
                            {removeFileExtension(item.file_name)}
                    </h3>
                          <div className="flex items-center gap-1 text-sm text-[#0600AF]/90 flex-shrink-0 whitespace-nowrap">
                      <Calendar className="w-4 h-4" />
                            {formatDate(item.created_at)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-16">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={setCurrentPage}
                    className="justify-center"
                  />
          </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-full max-h-full w-full h-full flex items-center justify-center">
            {/* Control Buttons */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              {/* Zoom Controls - Only for images */}
              {isImage(modalMediaType) && (
                <div className="flex gap-1 bg-white rounded-full p-1">
                  <button
                    onClick={zoomOut}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={zoomLevel <= 0.5}
                  >
                    <ZoomOut className="w-5 h-5 text-gray-800" />
                  </button>
                  <button
                    onClick={rotateImage}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title="Xoay ảnh 90°"
                  >
                    <RotateCw className="w-5 h-5 text-gray-800" />
                  </button>
                  <button
                    onClick={zoomIn}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={zoomLevel >= 3}
                  >
                    <ZoomIn className="w-5 h-5 text-gray-800" />
                  </button>
                </div>
              )}
              
              {/* Video Controls - Only for videos */}
              {isVideo(modalMediaType) && (
                <div className="flex gap-1 bg-white rounded-full p-1">
                  <button
                    onClick={skipBackward}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title="Tua lùi 5 giây"
                  >
                    <SkipBack className="w-5 h-5 text-gray-800" />
                  </button>
                  <button
                    onClick={skipForward}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title="Tua tới 5 giây"
                  >
                    <SkipForward className="w-5 h-5 text-gray-800" />
                  </button>
                </div>
              )}
              
              {/* Close Button */}
              <button
                onClick={closeImageModal}
                className="bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-800" />
              </button>
            </div>

            {/* Zoom Level and Rotation Indicator - Only for images */}
            {isImage(modalMediaType) && (
              <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-60 text-white px-3 py-1 rounded-lg text-sm">
                {Math.round(zoomLevel * 100)}%
                {rotation > 0 && <span className="ml-2">↻ {rotation}°</span>}
              </div>
            )}

            {/* Modal Media Container */}
            <div className="relative w-full h-full flex items-center justify-center">
              {isImage(modalMediaType) ? (
                // Image Display
                <div 
                  className="relative transition-transform duration-200 ease-out max-w-full max-h-full"
                  style={{ 
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                    transformOrigin: 'center center'
                  }}
                >
                  <Image
                    src={modalImage}
                    alt={modalImageName}
                    width={800}
                    height={600}
                    className="object-contain"
                    style={{
                      maxWidth: '90vw',
                      maxHeight: '80vh',
                      width: 'auto',
                      height: 'auto'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/default-image.svg";
                    }}
                    unoptimized={true}
                  />
                </div>
              ) : isVideo(modalMediaType) ? (
                // Video Player
                <video
                  ref={videoRef}
                  src={modalImage}
                  controls
                  autoPlay={false}
                  preload="metadata"
                  className="max-w-full max-h-full rounded-lg"
                  style={{
                    maxWidth: '90vw',
                    maxHeight: '80vh',
                    width: 'auto',
                    height: 'auto'
                  }}
                  onError={(e) => {
                    console.error('Error loading video:', modalImage);
                  }}
                  onLoadStart={() => {
                    console.log('Video loading started:', modalImage);
                  }}
                >
                  <p className="text-white">
                    {safeT('common:common.browserNotSupported', 'Trình duyệt của bạn không hỗ trợ video player.')}
                    <a href={modalImage} className="text-blue-400 underline ml-2">
                      {safeT('common:common.downloadFile', 'Tải file xuống')}
                    </a>
                  </p>
                </video>
              ) : (
                // Fallback for other media types
                <div className="text-white text-center">
                  <p className="mb-4">{safeT('common:common.cannotDisplayFileType', 'Không thể hiển thị loại file này')}</p>
                  <a 
                    href={modalImage} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 underline hover:text-blue-300"
                  >
                    {safeT('common:common.openInNewTab', 'Mở file trong tab mới')}
                  </a>
                </div>
              )}
            </div>

            {/* Media Title */}
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-60 text-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold truncate">{modalImageName}</h3>
            </div>
          </div>

          {/* Click outside to close */}
          <div 
            className="absolute inset-0 -z-10" 
            onClick={closeImageModal}
          ></div>
        </div>
      )}
    </div>
  );
}
