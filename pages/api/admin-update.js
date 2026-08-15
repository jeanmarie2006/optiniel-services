import { updateDevis } from "../../lib/db";
import { verifySessionToken, getSessionTokenFromRequest } from "../../lib/session";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    res.setHeader("Allow", ["PATCH"]);
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const email = verifySessionToken(getSessionTokenFromRequest(req));
  if (!email) {
    return res.status(401).json({ error: "Non connecté." });
  }

  const { id, statut, notes } = req.body || {};
  if (!id) {
    return res.status(400).json({ error: "id requis." });
  }

  const fields = {};
  if (statut !== undefined) fields.statut = statut;
  if (notes !== undefined) fields.notes = notes;

  if (Object.keys(fields).length === 0) {
    return res.status(400).json({ error: "Aucun champ à modifier." });
  }

  try {
    const devis = await updateDevis(id, fields);
    return res.status(200).json({ devis });
  } catch (err) {
    console.error("Erreur lors de la mise à jour du devis :", err);
    return res.status(500).json({ error: "Erreur serveur." });
  }
}
