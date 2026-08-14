import bcrypt from "bcryptjs";
import { supabase, isSupabaseConfigured } from "../../lib/supabaseClient";
import { createSessionToken, setSessionCookie } from "../../lib/session";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  if (!isSupabaseConfigured) {
    return res.status(500).json({ error: "Supabase n'est pas configuré." });
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

  // Message volontairement identique en cas d'email inconnu ou de mauvais
  // mot de passe, pour ne pas révéler quels emails existent en base.
  if (error || !user) {
    return res.status(401).json({ error: "Identifiants incorrects." });
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    return res.status(401).json({ error: "Identifiants incorrects." });
  }

  const token = createSessionToken(user.email);
  setSessionCookie(res, token);
  return res.status(200).json({ ok: true });
}
