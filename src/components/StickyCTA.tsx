"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import type { CoursePageData } from "@/lib/courses/types";

const SCROLL_THRESHOLD = 600;

type StickyCTAProps = { data: CoursePageData };

export default function StickyCTA({ data }: StickyCTAProps) {
  const { ctas, checkoutPath } = data;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-black/95 backdrop-blur-md border-t border-gold/20 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <Button href={checkoutPath} size="md" className="w-full">
        {ctas.sticky} →
      </Button>
    </aside>
  );
}
