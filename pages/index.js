import Link from "next/link";
import Layout from "../components/Layout";
import RegistrationMark from "../components/RegistrationMark";

const SERVICES = [
  {
    title: "Flyers & dépliants",
    desc: "Supports publicitaires en couleur, formats standards ou sur mesure.",
  },
  {
    title: "Cartes de visite",
    desc: "Un premier contact soigné : papier, finition et lisibilité au rendez-vous.",
  },
  {
    title: "Documents & supports",
    desc: "Rapports, factures, supports administratifs — en petite ou grande quantité.",
  },
];

const STEPS = [
  { n: "01", title: "Décrivez votre besoin", desc: "Format, quantité, délai — via le formulaire de devis." },
  { n: "02", title: "Recevez votre devis", desc: "Réponse rapide, par téléphone ou WhatsApp." },
  { n: "03", title: "Validez et imprimez", desc: "On lance la production dès votre accord." },
];

export default function Home() {
  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink">
        {/* Photo de fond : machine d'impression */}
        <img
          src="/images/hero-machine.jpg"
          alt="Machine d'impression en action"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/50" />

        <div className="relative mx-auto max-w-6xl px-5 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-paper/70 mb-6">
            <RegistrationMark size={16} />
            <span>Imprimerie — Cotonou, Bénin</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.95] text-paper max-w-3xl">
            Ce qui se conçoit bien{" "}
            <span className="text-cyan">s&apos;imprime clairement.</span>
          </h1>
          <p className="mt-6 font-body text-lg text-paper/70 max-w-xl">
            Optiniel Services imprime vos flyers, cartes de visite et documents
            avec précision. Décrivez votre besoin, recevez un devis rapide.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/devis"
              className="bg-navy text-paper px-6 py-3 rounded-sm font-medium hover:bg-navy-light transition-colors focus-ring"
            >
              Demander un devis
            </Link>
            <Link
              href="/services"
              className="border border-paper/30 text-paper px-6 py-3 rounded-sm font-medium hover:border-cyan hover:text-cyan transition-colors focus-ring"
            >
              Voir nos services
            </Link>
          </div>
        </div>

        {/* Registration marks decoratifs aux coins */}
        <RegistrationMark size={28} className="hidden md:block absolute top-8 right-10 text-cyan/30 z-10" />
        <RegistrationMark size={20} className="hidden md:block absolute bottom-10 right-1/3 text-magenta/40 z-10" />
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-navy/60 mb-3">Nos services</p>
        <h2 className="font-display text-3xl md:text-4xl text-ink mb-10">
          Trois métiers, une même exigence
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="group border border-ink/10 rounded-sm p-6 hover:border-navy hover:-translate-y-1.5 hover:shadow-xl active:scale-[0.97] transition-all duration-300 cursor-default"
            >
              <RegistrationMark size={20} className="text-navy mb-4 group-hover:animate-mark-spin" />
              <h3 className="font-display text-xl text-ink mb-2">{s.title}</h3>
              <p className="font-body text-sm text-ink/60">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-navy text-paper">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <p className="font-mono text-xs uppercase tracking-widest text-paper/50 mb-3">Comment ça marche</p>
          <h2 className="font-display text-3xl md:text-4xl mb-10">Du besoin à l&apos;impression</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {STEPS.map((step) => (
              <div key={step.n}>
                <span className="font-mono text-sm text-cyan">{step.n}</span>
                <h3 className="font-display text-xl mt-2 mb-2">{step.title}</h3>
                <p className="font-body text-sm text-paper/60">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-20 text-center">
        <h2 className="font-display text-3xl md:text-4xl text-ink mb-4">
          Un projet à imprimer ?
        </h2>
        <p className="font-body text-ink/60 mb-8 max-w-lg mx-auto">
          Remplissez le formulaire de devis, on vous répond rapidement.
        </p>
        <Link
          href="/devis"
          className="bg-navy text-paper px-7 py-3 rounded-sm font-medium hover:bg-navy-light transition-colors focus-ring inline-block"
        >
          Demander un devis
        </Link>
      </section>
    </Layout>
  );
}
