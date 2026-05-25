"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function CatalogNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeMenu]);

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 border-b ${
        scrolled || isOpen
          ? "bg-black/95 backdrop-blur-md shadow-lg shadow-purple/20 border-white/10"
          : "bg-black/70 backdrop-blur-sm border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple to-purple-light flex items-center justify-center shadow-lg shadow-purple/30 group-hover:shadow-purple/50 transition-shadow">
            <span className="text-gold font-bold text-lg">A</span>
          </span>
          <div className="hidden sm:block">
            <span className="text-white font-bold text-lg leading-tight block">African Skills</span>
            <span className="text-gold/80 text-[10px] font-semibold uppercase tracking-widest">
              Academy
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#courses"
            className="text-white/75 hover:text-gold transition-colors text-sm font-medium"
          >
            Programs
          </Link>
          <Link
            href="#why-us"
            className="text-white/75 hover:text-gold transition-colors text-sm font-medium"
          >
            Why Us
          </Link>
          <Link
            href="/contact"
            className="text-white/75 hover:text-gold transition-colors text-sm font-medium"
          >
            Contact
          </Link>
          <Button href="#courses" size="sm">
            View Programs →
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/10"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((o) => !o)}
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-black/98 border-t border-white/10 px-4 py-6 space-y-1">
          <Link href="#courses" className="block text-white/80 py-3 px-2 rounded-lg hover:bg-white/5" onClick={closeMenu}>
            Programs
          </Link>
          <Link href="#why-us" className="block text-white/80 py-3 px-2 rounded-lg hover:bg-white/5" onClick={closeMenu}>
            Why Us
          </Link>
          <Link href="/contact" className="block text-white/80 py-3 px-2 rounded-lg hover:bg-white/5" onClick={closeMenu}>
            Contact
          </Link>
          <div className="pt-3">
            <Button href="#courses" size="sm" className="w-full" onClick={closeMenu}>
              View Programs →
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
