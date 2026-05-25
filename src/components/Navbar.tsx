"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import type { CoursePageData } from "@/lib/courses/types";

type NavbarProps = { data: CoursePageData };

export default function Navbar({ data }: NavbarProps) {
  const { navLinks, badge, brandName, checkoutPath } = data;
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
      className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 ${
        scrolled || isOpen
          ? "bg-black/95 backdrop-blur-md shadow-lg shadow-purple/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-10 h-10 rounded-xl bg-purple flex items-center justify-center">
            <span className="text-white font-bold text-lg">{badge}</span>
          </span>
          <span className="text-white font-bold text-lg hidden sm:block">{brandName}</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8 list-none">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-white/80 hover:text-gold transition-colors text-sm font-medium"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block shrink-0">
          <Button href={checkoutPath} size="sm">
            Enroll Now
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden text-white p-2 -mr-2"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          id="mobile-nav"
          className="md:hidden bg-black/98 backdrop-blur-lg border-t border-white/10 max-h-[calc(100vh-5rem)] overflow-y-auto"
        >
          <ul className="px-4 py-4 flex flex-col gap-1 list-none">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block text-white/80 hover:text-gold transition-colors py-3"
                  onClick={closeMenu}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <Button href={checkoutPath} size="sm" className="w-full">
                Enroll Now
              </Button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}