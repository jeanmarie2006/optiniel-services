import { supabase, isSupabaseConfigured } from "../../lib/supabaseClient";

// Route appelée automatiquement une fois par jour (voir vercel.json) pour
// faire une petite requête sur Supabase. Les projets Supabase gratuits se
// mettent en pause après ~1 semaine sans aucune activité sur la base : ce
// "ping" quotidien suffit à rester actif indéfiniment, sans rien changer
// au fonctionnement du site.
export default async function handler(req, res) {
  if (!isSupabaseConfigured) {
    return res.status(200).json({ ok: true, skipped: "supabase-non-configure" });
  }

  try {
    const { error } = await supabase.from("devis").select("id").limit(1);
    if (error) throw error;
    return res.status(200).json({ ok: true, pinged_at: new Date().toISOString() });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
