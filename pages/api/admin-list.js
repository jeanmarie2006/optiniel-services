import { listDevis } from "../../lib/db";
import { verifySessionToken, getSessionTokenFromRequest } from "../../lib/session";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const token = getSessionTokenFromRequest(req);
  const email = verifySessionToken(token);
  if (!email) {
    return res.status(401).json({ error: "Non connecté." });
  }

  try {
    const devis = await listDevis();
    return res.status(200).json({ devis });
  } catch (err) {
    console.error("Erreur lors de la récupération des devis :", err);
    return res.status(500).json({ error: "Erreur serveur." });
  }
}
