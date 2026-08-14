import Link from "next/link";
import Layout from "../components/Layout";
import RegistrationMark from "../components/RegistrationMark";

const CATALOGUE = [
  {
    category: "Flyers & dépliants",
    items: [
      { name: "Flyer A6, quadrichromie", detail: "À partir de 100 exemplaires" },
      { name: "Flyer A5, quadrichromie", detail: "À partir de 100 exemplaires" },
      { name: "Dépliant 3 volets A4", detail: "Recto-verso, pliage inclus" },
    ],
  },
  {
    category: "Cartes de visite",
    items: [
      { name: "Carte standard 300g", detail: "Recto ou recto-verso" },
      { name: "Carte pelliculée", detail: "Finition mate ou brillante" },
    ],
  },
  {
    category: "Documents & supports",
    items: [
      { name: "Impression de documents N&B", detail: "Rapports, factures, dossiers" },
      { name: "Impression couleur", detail: "Présentations, supports administratifs" },
    ],
  },
];

export default function Services() {
  return (
    <Layout title="Services — Optiniel Services">
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-10">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-navy/70 mb-4">
          <RegistrationMark size={16} />
          <span>Catalogue</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-ink mb-4">Nos services</h1>
        <p className="font-body text-ink/60 max-w-xl">
          Les tarifs varient selon le format, le papier et la quantité. Pour un
          prix précis, faites une demande de devis — c&apos;est gratuit et rapide.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 space-y-14">
        {CATALOGUE.map((cat) => (
          <div key={cat.category}>
            <h2 className="font-display text-2xl text-navy mb-5">{cat.category}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {cat.items.map((item) => (
                <div
                  key={item.name}
                  className="group border border-ink/10 rounded-sm p-5 flex items-start gap-3 hover:border-navy hover:-translate-y-1 hover:shadow-lg active:scale-[0.97] transition-all duration-300 cursor-default"
                >
                  <RegistrationMark size={16} className="text-navy mt-1 shrink-0 group-hover:animate-mark-spin" />
                  <div>
                    <p className="font-body font-medium text-ink">{item.name}</p>
                    <p className="font-mono text-xs text-ink/50 mt-1">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-paper-warm rounded-sm p-8 text-center hover:shadow-lg transition-shadow duration-300">
          <p className="font-body text-ink/70 mb-5">
            Vous ne trouvez pas exactement ce qu&apos;il vous faut ?
          </p>
          <Link
            href="/devis"
            className="bg-navy text-paper px-6 py-3 rounded-sm font-medium hover:bg-navy-light transition-colors focus-ring inline-block"
          >
            Décrivez votre besoin
          </Link>
        </div>
      </section>
    </Layout>
  );
}
