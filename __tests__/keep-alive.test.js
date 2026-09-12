import { describe, it, expect, vi, beforeEach } from "vitest";
import fs from "fs";
import path from "path";

const root = process.cwd();

function mockRes() {
  const res = { statusCode: null, body: null };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (body) => {
    res.body = body;
    return res;
  };
  return res;
}

// Charge pages/api/keep-alive.js avec un faux client Supabase.
async function loadHandler({ configured, limitImpl }) {
  vi.resetModules();
  const limit = vi.fn(limitImpl);
  const select = vi.fn(() => ({ limit }));
  const from = vi.fn(() => ({ select }));
  vi.doMock("../lib/supabaseClient", () => ({
    isSupabaseConfigured: configured,
    supabase: configured ? { from } : null,
  }));
  const { default: handler } = await import("../pages/api/keep-alive");
  return { handler, from, select, limit };
}

describe("/api/keep-alive", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("fait une vraie requête sur la base quand Supabase est configuré", async () => {
    const { handler, from, select, limit } = await loadHandler({
      configured: true,
      limitImpl: async () => ({ data: [{ id: 1 }], error: null }),
    });
    const res = mockRes();
    await handler({ method: "GET", headers: {} }, res);

    expect(from).toHaveBeenCalledWith("devis");
    expect(select).toHaveBeenCalledWith("id");
    expect(limit).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it("renvoie 500 si Supabase répond une erreur (projet en pause, table absente...)", async () => {
    const { handler } = await loadHandler({
      configured: true,
      limitImpl: async () => ({ data: null, error: { message: "fetch failed" } }),
    });
    const res = mockRes();
    await handler({ method: "GET", headers: {} }, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ ok: false, error: "fetch failed" });
  });

  it("renvoie 500 si la requête plante (DNS introuvable, réseau)", async () => {
    const { handler } = await loadHandler({
      configured: true,
      limitImpl: async () => {
        throw new TypeError("fetch failed");
      },
    });
    const res = mockRes();
    await handler({ method: "GET", headers: {} }, res);

    expect(res.statusCode).toBe(500);
    expect(res.body.ok).toBe(false);
  });

  // Avant correction : 200 { ok: true, skipped } -> le cron Vercel affichait
  // "succès" alors qu'aucune requête n'atteignait la base.
  it("échoue (500) si les variables Supabase manquent, au lieu de faire semblant de réussir", async () => {
    const { handler } = await loadHandler({ configured: false });
    const res = mockRes();
    await handler({ method: "GET", headers: {} }, res);

    expect(res.statusCode).toBe(500);
    expect(res.body.ok).toBe(false);
  });
});

describe("planification du keep-alive", () => {
  it("vercel.json (en minuscules) déclare un cron vers une route qui existe", () => {
    expect(fs.readdirSync(root)).toContain("vercel.json");
    const config = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf-8"));
    const cron = config.crons.find((c) => c.path === "/api/keep-alive");
    expect(cron).toBeDefined();
    expect(fs.existsSync(path.join(root, "pages/api/keep-alive.js"))).toBe(true);
  });

  // Supabase demande "quelques requêtes par jour" ; le cron Vercel gratuit
  // est limité à une exécution par jour, il faut donc un appel complémentaire.
  it("un workflow GitHub appelle /api/keep-alive plusieurs fois par jour et échoue visiblement", () => {
    const file = path.join(root, ".github/workflows/keep-alive.yml");
    expect(fs.existsSync(file)).toBe(true);
    const yml = fs.readFileSync(file, "utf-8");

    const cron = yml.match(/cron:\s*["']([^"']+)["']/);
    expect(cron).not.toBeNull();
    const hours = cron[1].trim().split(/\s+/)[1];
    expect(hours === "*" || hours.startsWith("*/") || hours.includes(",")).toBe(true);

    expect(yml).toContain("/api/keep-alive");
    expect(yml).toContain("--fail");
  });
});
