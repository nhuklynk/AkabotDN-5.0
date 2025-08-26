"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Users,
  Database,
  Shield,
  Globe,
  TrendingUp,
  Award,
  Calendar,
  MapPin,
  CheckCircle,
  Star,
  Zap,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Eye,
  Target,
  Heart,
  Lightbulb,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Globe3D } from "@/app/(end-user)/landing-page/components/Globe3D";
import { useLocale } from "@/hooks/useLocale";

interface Expert {
  id: number;
  name: string;
  country: string;
  position: { x: number; y: number };
  avatar: string;
  expertise: string;
}

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const { t } = useLocale();

  const bannerSlides = [
    {
      id: 1,
      title: t("landing.banner.slides.0.title"),
      subtitle: t("landing.banner.slides.0.subtitle"),
      description: t("landing.banner.slides.0.description"),
      backgroundImage: "/international-data-conference.svg",
      ctaText: t("landing.banner.slides.0.ctaText"),
      ctaLink: "/digital-product",
    },
    {
      id: 2,
      title: t("landing.banner.slides.1.title"),
      subtitle: t("landing.banner.slides.1.subtitle"),
      description: t("landing.banner.slides.1.description"),
      backgroundImage: "/international-data-conference.svg",
      ctaText: t("landing.banner.slides.1.ctaText"),
      ctaLink: "/members/register",
    },
    {
      id: 3,
      title: t("landing.banner.slides.2.title"),
      subtitle: t("landing.banner.slides.2.subtitle"),
      description: t("landing.banner.slides.2.description"),
      backgroundImage: "/vietnam-ai-assistant.svg",
      ctaText: t("landing.banner.slides.2.ctaText"),
      ctaLink: "/about-us",
    },
  ];

  const globalExperts = [
    {
      id: 1,
      name: "Prof. Michael Chen",
      country: "USA",
      position: { x: 15, y: 35 },
      avatar: "/icons/expert-placeholder.svg",
      expertise: "AI & Machine Learning",
    },
    {
      id: 2,
      name: "Dr. Yuki Tanaka",
      country: "Japan",
      position: { x: 85, y: 30 },
      avatar: "/icons/expert-placeholder.svg",
      expertise: "Blockchain Technology",
    },
    {
      id: 3,
      name: "Prof. Emma Schmidt",
      country: "Germany",
      position: { x: 50, y: 25 },
      avatar: "/icons/expert-placeholder.svg",
      expertise: "Data Analytics",
    },
    {
      id: 4,
      name: "Dr. Raj Patel",
      country: "India",
      position: { x: 70, y: 45 },
      avatar: "/icons/expert-placeholder.svg",
      expertise: "Cybersecurity",
    },
    {
      id: 5,
      name: "Prof. Sophie Martin",
      country: "France",
      position: { x: 48, y: 28 },
      avatar: "/icons/expert-placeholder.svg",
      expertise: "Data Governance",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length
    );
  };

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const features = [
    {
      icon: <Database className="w-8 h-8 text-[#0033FF]" />,
      title: t("landing.features.items.0.title"),
      description: t("landing.features.items.0.description"),
    },
    {
      icon: <Shield className="w-8 h-8 text-[#0033FF]" />,
      title: t("landing.features.items.1.title"),
      description: t("landing.features.items.1.description"),
    },
    {
      icon: <Globe className="w-8 h-8 text-[#0033FF]" />,
      title: t("landing.features.items.2.title"),
      description: t("landing.features.items.2.description"),
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-[#0033FF]" />,
      title: t("landing.features.items.3.title"),
      description: t("landing.features.items.3.description"),
    },
  ];

  const stats = [
    {
      number: t("landing.stats.items.0.number"),
      label: t("landing.stats.items.0.label"),
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-500 to-purple-600",
    },
    {
      number: t("landing.stats.items.1.number"),
      label: t("landing.stats.items.1.label"),
      icon: <Database className="w-6 h-6" />,
      color: "from-green-500 to-blue-500",
    },
    {
      number: t("landing.stats.items.2.number"),
      label: t("landing.stats.items.2.label"),
      icon: <Globe className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      number: t("landing.stats.items.3.number"),
      label: t("landing.stats.items.3.label"),
      icon: <Star className="w-6 h-6" />,
      color: "from-yellow-500 to-orange-500",
    },
  ];

  const missionVision = {
    mission: {
      title: t("landing.mission.items.mission.title"),
      icon: <Target className="w-8 h-8" />,
      content: t("landing.mission.items.mission.content"),
      color: "from-[#0033FF] to-[#4F46E5]",
    },
    vision: {
      title: t("landing.mission.items.vision.title"),
      icon: <Eye className="w-8 h-8" />,
      content: t("landing.mission.items.vision.content"),
      color: "from-[#977DFF] to-[#8B5CF6]",
    },
    values: {
      title: t("landing.mission.items.values.title"),
      icon: <Heart className="w-8 h-8" />,
      content: t("landing.mission.items.values.content"),
      color: "from-[#0033FF] to-[#977DFF]",
    },
  };

  const upcomingEvents = [
    {
      title: t("landing.events.items.0.title"),
      date: t("landing.events.items.0.date"),
      location: t("landing.events.items.0.location"),
      type: t("landing.events.items.0.type"),
    },
    {
      title: t("landing.events.items.1.title"),
      date: t("landing.events.items.1.date"),
      location: t("landing.events.items.1.location"),
      type: t("landing.events.items.1.type"),
    },
    {
      title: t("landing.events.items.2.title"),
      date: t("landing.events.items.2.date"),
      location: t("landing.events.items.2.location"),
      type: t("landing.events.items.2.type"),
    },
  ];

  const testimonials = [
    {
      name: t("landing.testimonials.items.0.name"),
      position: t("landing.testimonials.items.0.position"),
      content: t("landing.testimonials.items.0.content"),
      avatar: "/icons/expert-placeholder.svg",
    },
    {
      name: t("landing.testimonials.items.1.name"),
      position: t("landing.testimonials.items.1.position"),
      content: t("landing.testimonials.items.1.content"),
      avatar: "/icons/expert-placeholder.svg",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] relative overflow-hidden">
      {/* Dynamic Banner Hero Section */}
      <section className="relative h-screen overflow-hidden z-10">
        {/* Slide Container */}
        <div className="relative h-full">
          {bannerSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              }`}
            >
              {/* Slide Background */}
              <div className="absolute inset-0">
                <Image
                  src={slide.backgroundImage}
                  alt={slide.title}
                  fill
                  className="object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0033FF]/20 to-[#977DFF]/20" />
              </div>

              {/* Slide Content */}
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-4xl">
                    <div className="space-y-6 animate-fadeInUp">
                      <Badge className="bg-gradient-to-r from-[#0033FF] to-[#977DFF] text-[#0033FF] border-0 px-6 py-3 text-base animate-pulse">
                        <Zap className="w-5 h-5 mr-2" />
                        {slide.subtitle}
                      </Badge>

                      <h1 className="text-5xl lg:text-7xl font-bold text-[#0033FF] leading-tight animate-slideInLeft">
                        {slide.title.split(" ").map((word, wordIndex) => (
                          <span
                            key={wordIndex}
                            className="inline-block mr-4 animate-bounce"
                            style={{
                              animationDelay: `${wordIndex * 0.2}s`,
                              animationDuration: "2s",
                              animationIterationCount: "1",
                            }}
                          >
                            {word}
                          </span>
                        ))}
                      </h1>

                      <p className="text-2xl text-[#0600AF]/90 leading-relaxed max-w-3xl animate-slideInRight">
                        {slide.description}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-6 animate-slideInUp">
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-[#0033FF] to-[#977DFF] hover:from-[#977DFF] hover:to-[#0033FF] text-white border-0 px-10 py-4 text-xl transform hover:scale-105 transition-transform"
                          onClick={() => (window.location.href = slide.ctaLink)}
                        >
                          {slide.ctaText}
                          <ArrowRight className="ml-3 w-6 h-6" />
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          className="border-2 border-[#0033FF] text-[#0033FF] hover:bg-[#0033FF] hover:text-white px-10 py-4 text-xl backdrop-blur-sm bg-white/20"
                        >
                          {t("landing.banner.learnMore")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-4 transition-all"
        >
          <ChevronLeft className="w-8 h-8 text-[#0033FF]" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-4 transition-all"
        >
          <ChevronRight className="w-8 h-8 text-[#0033FF]" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-[#0033FF] scale-125"
                  : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#977DFF]/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-48 h-48 bg-[#0033FF]/10 rounded-full blur-2xl animate-bounce"
          style={{ animationDuration: "3s" }}
        />
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-white/50 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#0033FF] mb-4">
              {t("landing.stats.title")}
            </h2>
            <p className="text-xl text-[#0600AF]/70">
              {t("landing.stats.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group relative">
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${stat.color} rounded-3xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}
                >
                  <div className="text-white">{stat.icon}</div>
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-[#0033FF] mb-3 counter animate-pulse">
                  {stat.number}
                </div>
                <div className="text-[#0600AF]/70 font-medium text-lg">
                  {stat.label}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission, Vision & Interactive Globe Section */}
      <section className="relative py-24 z-10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Mission & Vision */}
            <div className="space-y-12">
              <div className="text-center lg:text-left mb-12">
                <h2 className="text-4xl lg:text-5xl font-bold text-[#0033FF] mb-4">
                  {t("landing.mission.title")}
                </h2>
                <p className="text-xl text-[#0600AF]/70">
                  {t("landing.mission.subtitle")}
                </p>
              </div>

              {Object.values(missionVision).map((item, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white transform hover:-translate-y-2"
                >
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-6">
                      <div
                        className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl text-white group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                      >
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-[#0033FF] mb-4 group-hover:text-[#977DFF] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-[#0600AF]/80 leading-relaxed text-lg">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Right: Interactive Globe in Space */}
            <div className="relative flex justify-center items-center">
              <div className="relative w-[500px] h-[500px] mx-auto">
                {/* Cosmic Space Background */}
                <div
                  className="absolute inset-0 rounded-3xl overflow-hidden"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(147, 51, 234, 0.2) 0%, rgba(67, 56, 202, 0.3) 50%, rgba(0, 0, 0, 0.8) 100%)",
                  }}
                >
                  {/* Animated Stars Layer 1 - Small stars */}
                  <div className="absolute inset-0">
                    {[...Array(40)].map((_, i) => (
                      <div
                        key={`star-small-${i}`}
                        className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-60"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animation: `twinkle ${
                            2 + Math.random() * 2
                          }s ease-in-out infinite`,
                          animationDelay: `${Math.random() * 3}s`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Animated Stars Layer 2 - Medium stars */}
                  <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={`star-medium-${i}`}
                        className="absolute w-1 h-1 bg-white rounded-full opacity-80"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animation: `twinkle ${
                            3 + Math.random() * 2
                          }s ease-in-out infinite`,
                          animationDelay: `${Math.random() * 4}s`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Animated Stars Layer 3 - Large stars */}
                  <div className="absolute inset-0">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={`star-large-${i}`}
                        className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-90 shadow-lg shadow-white/50"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animation: `twinkle ${
                            4 + Math.random() * 2
                          }s ease-in-out infinite`,
                          animationDelay: `${Math.random() * 5}s`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Nebula/Cosmic Clouds */}
                  <div
                    className="absolute top-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"
                    style={{
                      animation: "nebulaDrift 8s ease-in-out infinite",
                    }}
                  />
                  <div
                    className="absolute bottom-16 right-12 w-24 h-24 bg-blue-400/15 rounded-full blur-2xl"
                    style={{
                      animation: "nebulaDrift 8s ease-in-out infinite",
                      animationDelay: "2s",
                    }}
                  />
                  <div
                    className="absolute top-1/2 left-8 w-20 h-20 bg-pink-400/10 rounded-full blur-2xl"
                    style={{
                      animation: "nebulaDrift 8s ease-in-out infinite",
                      animationDelay: "4s",
                    }}
                  />

                  {/* Cosmic Ring/Halo around Globe area */}
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white/10 rounded-full"
                    style={{
                      animation: "cosmicRing 20s linear infinite",
                    }}
                  />
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-blue-400/20 rounded-full"
                    style={{
                      animation: "cosmicRing 20s linear infinite reverse",
                      animationDelay: "1s",
                    }}
                  />

                  {/* 3D Earth Canvas - Embedded Mode */}
                  <div className="absolute inset-8 bg-transparent rounded-2xl">
                    <Globe3D
                      mode="embedded"
                      showBackground={false}
                      className="rounded-2xl"
                    />
                  </div>

                  {/* Floating Info Labels */}
                  <div className="absolute top-12 left-12 z-20">
                    <div className="bg-gradient-to-r from-blue-500/80 to-cyan-500/80 backdrop-blur-sm text-white px-3 py-2 rounded-full shadow-lg text-xs font-semibold animate-float border border-white/20">
                      🌐 {t("landing.mission.labels.globalConnection")}
                    </div>
                  </div>

                  <div
                    className="absolute top-16 right-12 z-20 animate-float"
                    style={{ animationDelay: "1s" }}
                  >
                    <div className="bg-gradient-to-r from-purple-500/80 to-violet-500/80 backdrop-blur-sm text-white px-3 py-2 rounded-full shadow-lg text-xs font-semibold border border-white/20">
                      🔒 {t("landing.mission.labels.dataSecurity")}
                    </div>
                  </div>

                  <div
                    className="absolute bottom-16 left-16 z-20 animate-float"
                    style={{ animationDelay: "2s" }}
                  >
                    <div className="bg-gradient-to-r from-pink-500/80 to-rose-500/80 backdrop-blur-sm text-white px-3 py-2 rounded-full shadow-lg text-xs font-semibold border border-white/20">
                      🔄 {t("landing.mission.labels.dataSync")}
                    </div>
                  </div>

                  <div
                    className="absolute bottom-12 right-16 z-20 animate-float"
                    style={{ animationDelay: "3s" }}
                  >
                    <div className="bg-gradient-to-r from-emerald-500/80 to-green-500/80 backdrop-blur-sm text-white px-3 py-2 rounded-full shadow-lg text-xs font-semibold border border-white/20">
                      🤖 {t("landing.mission.labels.ai")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0033FF] mb-4">
              {t("landing.features.title")}
            </h2>
            <p className="text-xl text-[#0600AF]/70 max-w-3xl mx-auto">
              {t("landing.features.subtitle")}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Features Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white"
                >
                  <CardHeader className="text-center pb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl text-[#0033FF]">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-[#0600AF]/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Right: Video */}
            <div className="relative">
              <div className="relative bg-white/90 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-96 object-cover"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src="/videos/data-background.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Video Control Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    onClick={toggleVideo}
                    size="lg"
                    className="bg-white/20 hover:bg-white/40 text-white border-0 backdrop-blur-sm rounded-full w-16 h-16"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </Button>
                </div>

                {/* Video Info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4">
                    <h3 className="font-bold text-[#0033FF] mb-2">
                      {t("landing.features.video.title")}
                    </h3>
                    <p className="text-[#0600AF]/70 text-sm">
                      {t("landing.features.video.description")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#977DFF]/20 rounded-full blur-2xl animate-pulse" />
              <div
                className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-100 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "1s" }}
              />
            </div>
          </div>
        </div>

        {/* CSS Keyframes for Cosmic Animations */}
        <style jsx>{`
          @keyframes twinkle {
            0%,
            100% {
              opacity: 0.3;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.2);
            }
          }

          @keyframes nebulaDrift {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
              opacity: 0.1;
            }
            33% {
              transform: translate(-10px, -10px) scale(1.1);
              opacity: 0.15;
            }
            66% {
              transform: translate(10px, -5px) scale(0.95);
              opacity: 0.08;
            }
          }

          @keyframes cosmicRing {
            0% {
              transform: translate(-50%, -50%) rotate(0deg) scale(1);
              opacity: 0.1;
            }
            50% {
              transform: translate(-50%, -50%) rotate(180deg) scale(1.05);
              opacity: 0.2;
            }
            100% {
              transform: translate(-50%, -50%) rotate(360deg) scale(1);
              opacity: 0.1;
            }
          }
        `}</style>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-gradient-to-r from-slate-50 to-blue-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0033FF] mb-4">
              {t("landing.events.title")}
            </h2>
            <p className="text-xl text-[#0600AF]/70">
              {t("landing.events.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:bg-white"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-gradient-to-r from-[#0033FF] to-[#977DFF] text-white border-0">
                      {event.type}
                    </Badge>
                    <Calendar className="w-5 h-5 text-[#977DFF]" />
                  </div>
                  <CardTitle className="text-xl text-[#0033FF] group-hover:text-[#977DFF] transition-colors">
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-[#0600AF]/70">
                      <Calendar className="w-4 h-4 mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-[#0600AF]/70">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-gradient-to-r from-[#0033FF] to-[#977DFF] hover:from-[#977DFF] hover:to-[#0033FF] text-white border-0">
                    {t("landing.events.registerButton")}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0033FF] mb-4">
              {t("landing.testimonials.title")}
            </h2>
            <p className="text-xl text-[#0600AF]/70">
              {t("landing.testimonials.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-[#0033FF]">
                        {testimonial.name}
                      </h4>
                      <p className="text-[#0600AF]/70 text-sm">
                        {testimonial.position}
                      </p>
                    </div>
                  </div>
                  <p className="text-[#0600AF]/80 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0033FF] to-[#977DFF] text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              {t("landing.cta.title")}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t("landing.cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-[#0033FF] hover:bg-blue-50 px-8 py-3 text-lg"
              >
                {t("landing.cta.memberButton")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-[#0033FF] hover:bg-blue-50 px-8 py-3 text-lg"
              >
                {t("landing.cta.contactButton")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
