import { supabase, isSupabaseConfigured } from "../../lib/supabaseClient";

// Route appelée automatiquement pour faire une petite requête sur Supabase :
// les projets Supabase gratuits se mettent en pause quand la base n'a pas
// assez d'activité sur une semaine ("quelques requêtes par jour" selon leur
// doc). Deux déclencheurs :
//   - le cron Vercel (vercel.json), limité à 1 fois par jour en gratuit ;
//   - le workflow GitHub .github/workflows/keep-alive.yml, toutes les 6 h.
// Toute anomalie renvoie un code 500 pour apparaître en échec dans les logs
// Vercel / GitHub au lieu de passer inaperçue.
export default async function handler(req, res) {
  if (!isSupabaseConfigured) {
    console.error("keep-alive : SUPABASE_URL ou SUPABASE_SERVICE_KEY manquant, aucune requête envoyée.");
    return res.status(500).json({ ok: false, error: "Supabase n'est pas configuré." });
  }

  try {
    const { error } = await supabase.from("devis").select("id").limit(1);
    if (error) throw error;
    return res.status(200).json({ ok: true, pinged_at: new Date().toISOString() });
  } catch (err) {
    console.error("keep-alive : la requête Supabase a échoué :", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
