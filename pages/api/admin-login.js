import bcrypt from "bcryptjs";
import { supabase, isSupabaseConfigured } from "../../lib/supabaseClient";
import { createSessionToken, setSessionCookie } from "../../lib/session";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  // --- MODE DEBUG TEMPORAIRE ---
  if (!isSupabaseConfigured) {
    return res.status(500).json({
      error: "DEBUG: Supabase non configuré. SUPABASE_URL présent=" +
        Boolean(process.env.SUPABASE_URL) +
        " / SUPABASE_SERVICE_KEY présent=" +
        Boolean(process.env.SUPABASE_SERVICE_KEY),
    });
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis." });
  }

  const { data: user, error } = await supabase
    .from("admin_users")
    .select("email, password_hash")
    .eq("email", email.toLowerCase().trim())
    .single();

  if (error || !user) {
    return res.status(401).json({
      error: "DEBUG: requête Supabase échouée. Détail: " +
        (error ? JSON.stringify(error) : "aucun utilisateur trouvé pour cet email"),
    });
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    return res.status(401).json({
      error: "DEBUG: utilisateur trouvé (" + user.email + ") mais mot de passe ne correspond pas au hash stocké.",
    });
  }

  const token = createSessionToken(user.email);
  setSessionCookie(res, token);
  return res.status(200).json({ ok: true });
}
