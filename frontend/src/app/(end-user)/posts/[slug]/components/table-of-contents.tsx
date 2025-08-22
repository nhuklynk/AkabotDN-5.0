"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract headings from HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headings = doc.querySelectorAll("h2, h3, h4");

    const items: TocItem[] = Array.from(headings).map((heading, index) => {
      const text = heading.textContent || "";
      const level = Number.parseInt(heading.tagName.charAt(1));
      const id = `heading-${index}`;

      return { id, text, level };
    });

    setTocItems(items);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -35% 0%" }
    );

    // Observe all headings in the actual DOM
    const headings = document.querySelectorAll("h2, h3, h4");
    headings.forEach((heading, index) => {
      heading.id = `heading-${index}`;
      observer.observe(heading);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (tocItems.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <List className="w-4 h-4" />
          Mục lục
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <nav className="space-y-1">
          {tocItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.id)}
              className={`block w-full text-left text-sm py-1 px-2 rounded transition-colors ${
                activeId === item.id
                  ? "bg-emerald-50 text-emerald-700 font-medium"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              } ${item.level === 3 ? "ml-4" : item.level === 4 ? "ml-8" : ""}`}
            >
              {item.text}
            </button>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}
