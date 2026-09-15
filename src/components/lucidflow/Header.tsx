import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/data/lucidflowContent";
import { trackCtaClick } from "@/hooks/useAnalytics";
import { Button } from "./Button";
import { useEnquiry } from "./EnquiryProvider";
import { Logo } from "./Logo";

// For smooth scrolling to anchor links
const Link = ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href?.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      target?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return <a href={href} onClick={handleClick} {...props}>{children}</a>;
};

export function Header() {
  const { openEnquiry } = useEnquiry();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const openScan = (location: string, label: string) => {
    trackCtaClick({
      ctaLabel: label,
      ctaLocation: location,
      preferredEngagement: "scan",
    });
    openEnquiry({
      preferredEngagement: "scan",
      sourceSection: location,
      ctaLabel: label,
      heading: "Request a Journey Assurance Scan",
    });
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-crimson bg-[#050505]/94 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[80px] w-full max-w-[1440px] items-center justify-between gap-3 px-5 sm:h-[88px] sm:px-6 lg:h-[100px] lg:px-12 xl:px-[72px]">
        <Link href="/lucidflow" className="shrink-0" aria-label="LucidFlow home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={`/lucidflow${link.href}`}
              className="text-sm font-medium text-soft-grey transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            size="sm"
            className="hidden lg:inline-flex"
            onClick={() => openScan("header", "Request a Journey Assurance Scan")}
          >
            Request a Journey Assurance Scan
          </Button>
          <Button
            size="sm"
            className="max-w-[9.5rem] px-3 text-xs lg:hidden"
            onClick={() => openScan("header_mobile", "Request a Journey Assurance Scan")}
          >
            Request a Journey Assurance Scan
          </Button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-white/15 text-white lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="mobile-navigation"
          className="border-t border-white/10 bg-near-black lg:hidden"
        >
          <nav className="container-lf flex flex-col py-4" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={`/lucidflow${link.href}`}
                className="flex min-h-12 items-center border-b border-white/8 text-base text-white"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
