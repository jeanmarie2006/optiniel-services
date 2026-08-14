import RegistrationMark from "./RegistrationMark";

export default function Footer() {
  return (
    <footer className="bg-ink text-paper/90 mt-24">
      <div className="mx-auto max-w-6xl px-5 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <RegistrationMark size={18} className="text-cyan" />
            <span className="font-display text-lg tracking-wide">OPTINIEL SERVICES</span>
          </div>
          <p className="font-body text-sm text-paper/60 max-w-xs">
            Imprimerie de précision — flyers, cartes de visite et documents,
            pensés et imprimés avec soin.
          </p>
        </div>

        <div className="font-body text-sm">
          <p className="font-mono text-xs uppercase tracking-widest text-paper/40 mb-3">Contact</p>
          <p className="text-paper/70">Cotonou, quartier Sainte Rita</p>
          <p className="text-paper/70">
            <a href="tel:+2290145087412" className="hover:text-cyan">
              +229 01 45 08 74 12
            </a>
          </p>
          <p className="text-paper/70">
            <a href="mailto:optinieladomou41@gmail.com" className="hover:text-cyan">
              optinieladomou41@gmail.com
            </a>
          </p>
        </div>

        <div className="font-body text-sm">
          <p className="font-mono text-xs uppercase tracking-widest text-paper/40 mb-3">Horaires</p>
          <p className="text-paper/70">Lun – Ven : 8h – 18h</p>
          <p className="text-paper/70">Sam : 8h – 13h</p>
        </div>
      </div>
      <div className="border-t border-paper/10 py-5 text-center font-mono text-xs text-paper/40">
        © {new Date().getFullYear()} Optiniel Services — Tous droits réservés
      </div>
    </footer>
  );
}
