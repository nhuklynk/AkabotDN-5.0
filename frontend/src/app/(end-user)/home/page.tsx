import { HeroSection } from "@/app/(end-user)/home/components/hero-section";
import { NewsSection } from "@/app/(end-user)/home/components/news-section";
import { ProductsSection } from "@/app/(end-user)/home/components/products-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <NewsSection />
      <ProductsSection />
    </>
  );
}
