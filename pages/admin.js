import { useState, useEffect, useMemo } from "react";
import Layout from "../components/Layout";
import RegistrationMark from "../components/RegistrationMark";

const STATUTS = ["nouveau", "en_cours", "termine"];
const STATUT_LABELS = { nouveau: "Nouveau", en_cours: "En cours", termine: "Terminé" };

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [devis, setDevis] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState("tous");
  const [savingId, setSavingId] = useState(null);

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

  async function updateField(id, fields) {
    setSavingId(id);
    try {
      const res = await fetch("/api/admin-update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...fields }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur.");
      setDevis((prev) => prev.map((d) => (d.id === id ? { ...d, ...fields } : d)));
    } catch (err) {
      alert("Erreur lors de la sauvegarde : " + err.message);
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer définitivement cette demande de devis ?")) return;
    try {
      const res = await fetch("/api/admin-delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur.");
      setDevis((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression : " + err.message);
    }
  }

  function exportCSV() {
    const rows = filteredDevis;
    const header = ["id", "nom", "telephone", "email", "service", "quantite", "format", "description", "statut", "notes", "created_at"];
    const csvLines = [
      header.join(","),
      ...rows.map((d) =>
        header
          .map((key) => {
            const value = d[key] ?? "";
            const escaped = String(value).replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(",")
      ),
    ];
    const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `devis-optiniel-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filteredDevis = useMemo(() => {
    if (!devis) return [];
    return devis.filter((d) => {
      if (statutFilter !== "tous" && (d.statut || "nouveau") !== statutFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const haystack = `${d.nom} ${d.telephone} ${d.email || ""} ${d.service}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [devis, search, statutFilter]);

  const stats = useMemo(() => {
    if (!devis) return null;
    const byStatut = { nouveau: 0, en_cours: 0, termine: 0 };
    const byService = {};
    devis.forEach((d) => {
      const s = d.statut || "nouveau";
      byStatut[s] = (byStatut[s] || 0) + 1;
      byService[d.service] = (byService[d.service] || 0) + 1;
    });
    const thisMonth = new Date().toISOString().slice(0, 7);
    const ceMois = devis.filter((d) => (d.created_at || "").slice(0, 7) === thisMonth).length;
    return { total: devis.length, byStatut, byService, ceMois };
  }, [devis]);

  return (
    <Layout title="Administration — Optiniel Services">
      <section className="mx-auto max-w-5xl px-5 pt-16 pb-24">
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

            {/* Statistiques */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <div className="border border-ink/10 rounded-sm p-4">
                  <p className="font-mono text-xs text-ink/50 uppercase">Total</p>
                  <p className="font-display text-2xl text-ink">{stats.total}</p>
                </div>
                <div className="border border-ink/10 rounded-sm p-4">
                  <p className="font-mono text-xs text-ink/50 uppercase">Ce mois-ci</p>
                  <p className="font-display text-2xl text-ink">{stats.ceMois}</p>
                </div>
                <div className="border border-ink/10 rounded-sm p-4">
                  <p className="font-mono text-xs text-ink/50 uppercase">Nouveaux</p>
                  <p className="font-display text-2xl text-ink">{stats.byStatut.nouveau}</p>
                </div>
                <div className="border border-ink/10 rounded-sm p-4">
                  <p className="font-mono text-xs text-ink/50 uppercase">Terminés</p>
                  <p className="font-display text-2xl text-ink">{stats.byStatut.termine}</p>
                </div>
              </div>
            )}

            {/* Recherche / filtre / export */}
            <div className="flex flex-wrap gap-3 mb-6 items-center">
              <input
                type="text"
                placeholder="Rechercher (nom, téléphone, email, service)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 min-w-[220px] border border-ink/15 rounded-sm px-3 py-2 font-body text-sm"
              />
              <select
                value={statutFilter}
                onChange={(e) => setStatutFilter(e.target.value)}
                className="border border-ink/15 rounded-sm px-3 py-2 font-body text-sm"
              >
                <option value="tous">Tous les statuts</option>
                {STATUTS.map((s) => (
                  <option key={s} value={s}>
                    {STATUT_LABELS[s]}
                  </option>
                ))}
              </select>
              <button
                onClick={exportCSV}
                className="border border-navy text-navy px-4 py-2 rounded-sm text-sm font-medium hover:bg-navy hover:text-paper transition-colors"
              >
                Exporter CSV
              </button>
            </div>

            {filteredDevis.length === 0 ? (
              <p className="font-body text-ink/60">Aucune demande ne correspond.</p>
            ) : (
              <div className="space-y-4">
                {filteredDevis.map((d) => (
                  <div key={d.id} className="border border-ink/10 rounded-sm p-5">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <p className="font-display text-lg text-ink">{d.nom}</p>
                      <select
                        value={d.statut || "nouveau"}
                        disabled={savingId === d.id}
                        onChange={(e) => updateField(d.id, { statut: e.target.value })}
                        className="font-mono text-xs uppercase tracking-wide border border-ink/15 rounded-sm px-2 py-1"
                      >
                        {STATUTS.map((s) => (
                          <option key={s} value={s}>
                            {STATUT_LABELS[s]}
                          </option>
                        ))}
                      </select>
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

                    <label className="block mt-3">
                      <span className="font-mono text-[11px] text-ink/40 uppercase">Notes internes</span>
                      <textarea
                        defaultValue={d.notes || ""}
                        onBlur={(e) => {
                          if (e.target.value !== (d.notes || "")) {
                            updateField(d.id, { notes: e.target.value });
                          }
                        }}
                        rows={2}
                        placeholder="Ajouter une note (sauvegarde automatique en quittant le champ)..."
                        className="w-full border border-ink/10 rounded-sm px-2 py-1.5 font-body text-sm mt-1"
                      />
                    </label>

                    <div className="flex justify-between items-center mt-3">
                      <p className="font-mono text-[11px] text-ink/40">
                        {new Date(d.created_at).toLocaleString("fr-FR")}
                      </p>
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="font-body text-xs text-red-600 hover:underline"
                      >
                        Supprimer
                      </button>
                    </div>
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
