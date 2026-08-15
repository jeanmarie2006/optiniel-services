import { deleteDevis } from "../../lib/db";
import { verifySessionToken, getSessionTokenFromRequest } from "../../lib/session";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const email = verifySessionToken(getSessionTokenFromRequest(req));
  if (!email) {
    return res.status(401).json({ error: "Non connecté." });
  }

  const { id } = req.body || {};
  if (!id) {
    return res.status(400).json({ error: "id requis." });
  }

  try {
    await deleteDevis(id);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Erreur lors de la suppression du devis :", err);
    return res.status(500).json({ error: "Erreur serveur." });
  }
}
