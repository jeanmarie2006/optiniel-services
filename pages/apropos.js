import Layout from "../components/Layout";
import RegistrationMark from "../components/RegistrationMark";

export default function Apropos() {
  return (
    <Layout title="À propos — Optiniel Services">
      <section className="mx-auto max-w-3xl px-5 pt-16 pb-24">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-navy/70 mb-4">
          <RegistrationMark size={16} />
          <span>À propos</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-ink mb-6">Optiniel Services</h1>
        <p className="font-body text-lg text-ink/70 leading-relaxed mb-6">
          Optiniel Services est une imprimerie basée à Cotonou, spécialisée
          dans l&apos;impression de flyers, cartes de visite et documents pour
          particuliers, entreprises et institutions.
        </p>
        <p className="font-body text-lg text-ink/70 leading-relaxed mb-6">
          Notre priorité est simple : livrer un travail net, dans les délais
          annoncés, sans mauvaise surprise sur le prix. Nous travaillons avec
          du matériel d&apos;impression professionnel, régulièrement entretenu,
          qui garantit des couleurs fidèles et des finitions soignées — que ce
          soit pour une carte de visite en petite quantité ou une commande de
          flyers en grand volume.
        </p>
        <p className="font-body text-lg text-ink/70 leading-relaxed mb-6">
          Contrairement à beaucoup d&apos;imprimeries, chez Optiniel Services
          chaque commande est vérifiée avant impression et avant livraison :
          ce contrôle qualité systématique, combiné à des tarifs clairs et
          compétitifs, fait la différence entre un travail bâclé et un
          résultat sur lequel vous pouvez compter.
        </p>
        <div className="grid sm:grid-cols-3 gap-6 mt-12">
          {[
            { label: "Précision", desc: "Chaque impression est vérifiée avant livraison." },
            { label: "Réactivité", desc: "Devis rapide, délais tenus." },
            { label: "Proximité", desc: "Un échange direct, du devis à la livraison." },
          ].map((v) => (
            <div
              key={v.label}
              className="group border-t-2 border-navy pt-4 hover:-translate-y-1.5 hover:shadow-lg hover:bg-paper-warm active:scale-[0.97] transition-all duration-300 px-3 -mx-3 rounded-b-sm"
            >
              <RegistrationMark size={18} className="text-navy mb-3 group-hover:animate-mark-spin" />
              <p className="font-display text-lg text-ink">{v.label}</p>
              <p className="font-body text-sm text-ink/60 mt-1">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
