import fs from "fs";
import path from "path";
import { supabase, isSupabaseConfigured } from "./supabaseClient";

// --- Fallback local (développement uniquement) -----------------------------
// Sur Vercel, le système de fichiers est en lecture seule (sauf /tmp, qui est
// éphémère et perdu à chaque redéploiement/redémarrage). Ce fallback sert
// uniquement à tester le site en local (`npm run dev`) avant d'avoir
// configuré Supabase. En production, configurez SUPABASE_URL et
// SUPABASE_SERVICE_KEY (voir README.md) pour une vraie persistance.
const LOCAL_DB_PATH = path.join(process.env.VERCEL ? "/tmp" : process.cwd(), "devis-local.json");

function readLocal() {
  try {
    return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, "utf-8"));
  } catch {
    return [];
  }
}

function writeLocal(rows) {
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(rows, null, 2));
}

// --- API publique ------------------------------------------------------

export async function saveDevis(entry) {
  const row = {
    ...entry,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from("devis").insert(row).select().single();
    if (error) throw error;
    return data;
  }

  const rows = readLocal();
  const withId = { id: rows.length + 1, ...row };
  rows.unshift(withId);
  writeLocal(rows);
  return withId;
}

export async function listDevis() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("devis")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  }

  return readLocal();
}
