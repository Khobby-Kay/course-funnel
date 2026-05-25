import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "/contact" },
] as const;

const SOCIAL = [
  { label: "Facebook", icon: "f" },
  { label: "Instagram", icon: "ig" },
  { label: "X", icon: "x" },
  { label: "LinkedIn", icon: "in" },
] as const;

export default function Footer() {
  return (
    <footer className="bg-black text-white py-14 border-t border-white/10">
      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mb-10">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-3">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple to-purple-light flex items-center justify-center font-bold text-gold">
                A
              </span>
              <div>
                <span className="font-bold text-lg block leading-tight">African Skills Academy</span>
                <span className="text-white/40 text-xs">Skills that pay · Lifetime access</span>
              </div>
            </Link>
            <p className="text-white/50 text-sm max-w-xs leading-relaxed">
              Professional online training for Africans building income through digital skills.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-6 list-none">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex gap-3 list-none">
            {SOCIAL.map((social) => (
              <li key={social.label}>
                <span
                  role="link"
                  aria-label={`${social.label} (coming soon)`}
                  aria-disabled="true"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold opacity-50 cursor-not-allowed"
                >
                  {social.icon}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-8">
          <p className="text-white/40 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} African Skills Academy. All rights reserved.
          </p>
          <p className="text-white/30 text-xs flex flex-wrap justify-center gap-x-3 gap-y-1">
            <span>🔒 Secure payments</span>
            <span>·</span>
            <span>30-day guarantee</span>
            <span>·</span>
            <span>MoMo · Cards</span>
          </p>
        </div>
      </article>
    </footer>
  );
}
