import Link from "next/link";
import { useState } from "react";
import RegistrationMark from "./RegistrationMark";

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/devis", label: "Devis" },
  { href: "/apropos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur border-b border-ink/10">
      <div className="mx-auto max-w-6xl px-5 flex items-center justify-between h-16">
        <Link href="/" className="group flex items-center gap-2 focus-ring rounded">
          <span className="text-navy">
            <RegistrationMark size={22} />
          </span>
          <span className="font-display text-xl tracking-wide text-ink">
            OPTINIEL <span className="text-navy">SERVICES</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 font-body text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-ink/80 hover:text-navy transition-colors focus-ring rounded"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/devis"
            className="bg-navy text-paper px-4 py-2 rounded-sm text-sm font-medium hover:bg-navy-light transition-colors focus-ring"
          >
            Demander un devis
          </Link>
        </nav>

        <button
          className="md:hidden text-ink focus-ring rounded p-2"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Ouvrir le menu"
        >
          <span className="block w-6 h-0.5 bg-ink mb-1.5" />
          <span className="block w-6 h-0.5 bg-ink mb-1.5" />
          <span className="block w-6 h-0.5 bg-ink" />
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-ink/10 px-5 py-4 flex flex-col gap-4 font-body bg-paper">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-ink/80 hover:text-navy"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
