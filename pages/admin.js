import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import RegistrationMark from "../components/RegistrationMark";

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [devis, setDevis] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // Au chargement, on vérifie si une session valide existe déjà (cookie),
  // pour éviter de redemander la connexion à chaque rafraîchissement.
  useEffect(() => {
    fetch("/api/admin-list")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setDevis(data.devis);
      })
      .finally(() => setCheckingSession(false));
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur.");

      const listRes = await fetch("/api/admin-list");
      const listData = await listRes.json();
      if (!listRes.ok) throw new Error(listData.error || "Erreur.");
      setDevis(listData.devis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin-logout", { method: "POST" });
    setDevis(null);
    setEmail("");
    setPassword("");
  }

  return (
    <Layout title="Administration — Optiniel Services">
      <section className="mx-auto max-w-4xl px-5 pt-16 pb-24">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-navy/70 mb-4">
          <RegistrationMark size={16} />
          <span>Espace admin</span>
        </div>
        <h1 className="font-display text-4xl text-ink mb-8">Demandes de devis</h1>

        {checkingSession ? (
          <p className="font-body text-ink/60">Chargement...</p>
        ) : devis === null ? (
          <form onSubmit={handleLogin} className="max-w-sm space-y-4">
            <label className="block">
              <span className="font-body text-sm text-ink/70 mb-1.5 block">Email admin</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-ink/15 rounded-sm px-3 py-2 font-body"
              />
            </label>
            <label className="block">
              <span className="font-body text-sm text-ink/70 mb-1.5 block">Mot de passe</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-ink/15 rounded-sm px-3 py-2 font-body"
              />
            </label>
            {error && <p className="font-body text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-navy text-paper px-5 py-2.5 rounded-sm font-medium hover:bg-navy-light transition-colors focus-ring"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        ) : (
          <>
            <button
              onClick={handleLogout}
              className="mb-6 text-sm font-body text-navy underline hover:no-underline"
            >
              Se déconnecter
            </button>
            {devis.length === 0 ? (
              <p className="font-body text-ink/60">Aucune demande de devis pour le moment.</p>
            ) : (
              <div className="space-y-4">
                {devis.map((d) => (
                  <div key={d.id} className="border border-ink/10 rounded-sm p-5">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <p className="font-display text-lg text-ink">{d.nom}</p>
                      <span className="font-mono text-xs text-navy uppercase tracking-wide">
                        {d.statut || "nouveau"}
                      </span>
                    </div>
                    <p className="font-body text-sm text-ink/60 mt-1">
                      {d.telephone} {d.email ? `· ${d.email}` : ""}
                    </p>
                    <p className="font-body text-sm text-ink mt-3">
                      <span className="text-navy font-medium">{d.service}</span>
                      {d.quantite ? ` · Quantité : ${d.quantite}` : ""}
                      {d.format ? ` · Format : ${d.format}` : ""}
                    </p>
                    {d.description && (
                      <p className="font-body text-sm text-ink/70 mt-2">{d.description}</p>
                    )}
                    <p className="font-mono text-[11px] text-ink/40 mt-3">
                      {new Date(d.created_at).toLocaleString("fr-FR")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </Layout>
  );
}
