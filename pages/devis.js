import { useState } from "react";
import Layout from "../components/Layout";
import RegistrationMark from "../components/RegistrationMark";

const SERVICES = [
  "Flyers / dépliants",
  "Cartes de visite",
  "Documents & supports",
  "Autre (précisez dans la description)",
];

// Numéro WhatsApp de l'imprimerie (même numéro que sur la page contact).
const WHATSAPP_NUMBER = "2290145087412";

function buildWhatsappMessage(f) {
  const lignes = [
    "Bonjour Optiniel Services, voici ma demande de devis :",
    `Nom : ${f.nom}`,
    `Téléphone : ${f.telephone}`,
    f.email ? `Email : ${f.email}` : null,
    `Service : ${f.service}`,
    f.quantite ? `Quantité : ${f.quantite}` : null,
    f.format ? `Format / précisions : ${f.format}` : null,
    `Description : ${f.description}`,
  ].filter(Boolean);
  return lignes.join("\n");
}

const initialForm = {
  nom: "",
  telephone: "",
  email: "",
  service: SERVICES[0],
  quantite: "",
  format: "",
  description: "",
};

export default function Devis() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [lastSubmitted, setLastSubmitted] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue.");
      }

      setStatus("success");
      setLastSubmitted(form);
      setForm(initialForm);

      // Envoi direct : on ouvre automatiquement WhatsApp avec la demande
      // déjà écrite. (Les navigateurs peuvent bloquer les popups ouvertes
      // hors d'un clic direct de l'utilisateur — le bouton ci-dessous reste
      // affiché comme solution de secours si l'ouverture automatique ne
      // marche pas.)
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        buildWhatsappMessage(form)
      )}`;
      window.open(waUrl, "_blank");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  }

  return (
    <Layout title="Demander un devis — Optiniel Services">
      <section className="mx-auto max-w-2xl px-5 pt-16 pb-24">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-navy/70 mb-4">
          <RegistrationMark size={16} />
          <span>Devis gratuit</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-ink mb-3">Demander un devis</h1>
        <p className="font-body text-ink/60 mb-10">
          Décrivez votre besoin, nous vous répondons rapidement par téléphone
          ou WhatsApp.
        </p>

        {status === "success" ? (
          <div className="border border-navy/30 bg-paper-warm rounded-sm p-8 text-center">
            <RegistrationMark size={28} className="text-navy mx-auto mb-4" />
            <h2 className="font-display text-2xl text-ink mb-2">Demande envoyée</h2>
            <p className="font-body text-ink/60 mb-6">
              Merci ! Votre demande a bien été reçue. Un onglet WhatsApp
              vient de s&apos;ouvrir avec votre demande déjà écrite — il ne
              reste plus qu&apos;à appuyer sur envoyer. Si rien ne s&apos;est
              ouvert, utilisez le bouton ci-dessous :
            </p>
            {lastSubmitted && (
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  buildWhatsappMessage(lastSubmitted)
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-navy text-paper px-6 py-3 rounded-sm font-medium hover:bg-navy-light transition-colors focus-ring"
              >
                Envoyer ma demande sur WhatsApp
              </a>
            )}
            <div>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 font-body text-sm text-navy underline focus-ring"
              >
                Envoyer une autre demande
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Nom complet" required>
                <input
                  required
                  value={form.nom}
                  onChange={(e) => update("nom", e.target.value)}
                  className="input"
                  placeholder="Votre nom"
                />
              </Field>
              <Field label="Téléphone / WhatsApp" required>
                <input
                  required
                  value={form.telephone}
                  onChange={(e) => update("telephone", e.target.value)}
                  className="input"
                  placeholder="+229 ..."
                />
              </Field>
            </div>

            <Field label="Email (optionnel)">
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="input"
                placeholder="vous@exemple.com"
              />
            </Field>

            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Service souhaité" required>
                <select
                  value={form.service}
                  onChange={(e) => update("service", e.target.value)}
                  className="input"
                >
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Quantité souhaitée">
                <input
                  value={form.quantite}
                  onChange={(e) => update("quantite", e.target.value)}
                  className="input"
                  placeholder="ex : 500"
                />
              </Field>
            </div>

            <Field label="Format / précisions techniques">
              <input
                value={form.format}
                onChange={(e) => update("format", e.target.value)}
                className="input"
                placeholder="ex : A5, recto-verso"
              />
            </Field>

            <Field label="Description de votre besoin" required>
              <textarea
                required
                rows={5}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                className="input resize-none"
                placeholder="Décrivez votre projet, le délai souhaité, etc."
              />
            </Field>

            {status === "error" && (
              <p className="font-body text-sm text-red-600">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-navy text-paper px-6 py-3 rounded-sm font-medium hover:bg-navy-light transition-colors focus-ring disabled:opacity-60"
            >
              {status === "sending" ? "Envoi en cours..." : "Envoyer la demande"}
            </button>
          </form>
        )}
      </section>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid rgba(11, 14, 20, 0.15);
          border-radius: 2px;
          padding: 0.65rem 0.85rem;
          font-family: var(--font-body);
          font-size: 0.95rem;
          background: #fff;
        }
        .input:focus {
          outline: 2px solid #0F1B3D;
          outline-offset: 1px;
        }
      `}</style>
    </Layout>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="font-body text-sm text-ink/70 mb-1.5 block">
        {label} {required && <span className="text-navy">*</span>}
      </span>
      {children}
    </label>
  );
}
