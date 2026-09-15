import { NAV_LINKS } from "@/data/lucidflowContent";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="container-lf flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <Logo />
        <nav className="flex flex-col gap-2" aria-label="Footer">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={`/lucidflow${link.href}`}
              className="text-sm text-muted-grey hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="container-lf py-5 text-xs text-muted-grey">
          <p>© {year} SBA Info Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
