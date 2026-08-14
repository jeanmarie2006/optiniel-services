import Layout from "../components/Layout";
import RegistrationMark from "../components/RegistrationMark";

// Numéro WhatsApp de l'imprimerie, au format international sans le "+".
const WHATSAPP_NUMBER = "2290145087412";
const PHONE_DISPLAY = "+229 01 45 08 74 12";
const WHATSAPP_DEFAULT_MESSAGE =
  "Bonjour Optiniel Services, je vous contacte depuis votre site web. J'aimerais avoir des informations sur vos services d'impression.";

export default function Contact() {
  return (
    <Layout title="Contact — Optiniel Services">
      <section className="mx-auto max-w-4xl px-5 pt-16 pb-24">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-navy/70 mb-4">
          <RegistrationMark size={16} />
          <span>Contact</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-ink mb-4">Nous contacter</h1>
        <p className="font-body text-ink/60 mb-12 max-w-lg">
          La façon la plus rapide de nous joindre reste WhatsApp. Pour une
          demande détaillée, utilisez le formulaire de devis.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="border border-ink/10 rounded-sm p-7 hover:border-navy hover:-translate-y-1.5 hover:shadow-xl active:scale-[0.98] transition-all duration-300">
            <RegistrationMark size={20} className="text-navy mb-4" />
            <h2 className="font-display text-xl text-ink mb-3">Coordonnées</h2>
            <ul className="font-body text-sm text-ink/70 space-y-2">
              <li>📍 Cotonou, quartier Sainte Rita, Bénin</li>
              <li>
                📞{" "}
                <a href={`tel:+${WHATSAPP_NUMBER}`} className="hover:text-navy">
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                ✉️{" "}
                <a href="mailto:optinieladomou41@gmail.com" className="hover:text-navy">
                  optinieladomou41@gmail.com
                </a>
              </li>
              <li>🕗 Lun – Ven : 8h – 18h · Sam : 8h – 13h</li>
            </ul>
          </div>

          <div className="border border-navy rounded-sm p-7 bg-paper-warm flex flex-col hover:-translate-y-1.5 hover:shadow-xl active:scale-[0.98] transition-all duration-300">
            <RegistrationMark size={20} className="text-navy mb-4" />
            <h2 className="font-display text-xl text-ink mb-3">Discuter sur WhatsApp</h2>
            <p className="font-body text-sm text-ink/60 mb-6">
              Posez votre question directement, on vous répond rapidement.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto bg-navy text-paper text-center px-6 py-3 rounded-sm font-medium hover:bg-navy-light transition-colors focus-ring"
            >
              Ouvrir WhatsApp
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
