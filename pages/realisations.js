import Layout from "../components/Layout";
import RegistrationMark from "../components/RegistrationMark";

// Photos locales dans /public/images/ (remplacez-les par vos vraies photos
// de réalisations au fur et à mesure — même nom de fichier ou mettez à jour
// le champ "img" ci-dessous).
const REALISATIONS = [
  {
    title: "Cartes de visite — Cabinet comptable",
    tag: "Carte de visite",
    img: "/images/cartes-visite.jpg",
  },
  {
    title: "Flyers événementiels",
    tag: "Flyer A5",
    img: "/images/flyers.jpg",
  },
  {
    title: "Dépliant présentation d'entreprise",
    tag: "Dépliant 3 volets",
    img: "/images/flyers.jpg",
  },
  {
    title: "Support administratif",
    tag: "Document",
    img: "/images/documents.jpg",
  },
];

export default function Realisations() {
  return (
    <Layout title="Réalisations — Optiniel Services">
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-10">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-navy/70 mb-4">
          <RegistrationMark size={16} />
          <span>Portfolio</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-ink mb-4">Nos réalisations</h1>
        <p className="font-body text-ink/60 max-w-xl">
          Un aperçu de travaux déjà livrés. Les photos seront ajoutées au fil
          des projets.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 grid sm:grid-cols-2 md:grid-cols-4 gap-5">
        {REALISATIONS.map((r) => (
          <div
            key={r.title}
            className="group border border-ink/10 rounded-sm overflow-hidden hover:border-navy hover:-translate-y-1.5 hover:shadow-xl active:scale-[0.97] transition-all duration-300"
          >
            <div className="aspect-[4/5] bg-paper-warm overflow-hidden">
              <img
                src={r.img}
                alt={r.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-navy/60 mb-1">{r.tag}</p>
              <p className="font-body text-sm text-ink">{r.title}</p>
            </div>
          </div>
        ))}
      </section>
    </Layout>
  );
}
