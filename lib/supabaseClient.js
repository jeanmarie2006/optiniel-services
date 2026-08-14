import { createClient } from "@supabase/supabase-js";

// Ces variables doivent être définies dans .env.local (et dans les
// "Environment Variables" du projet Vercel). Voir le README pour la
// procédure de création d'un projet Supabase gratuit.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_SERVICE_KEY);

// On utilise la clé "service_role" côté serveur uniquement (jamais exposée
// au navigateur) car les routes API doivent pouvoir écrire dans la table
// même si des règles RLS restrictives sont activées.
export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  : null;
