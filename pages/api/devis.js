import { saveDevis } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const { nom, telephone, email, service, quantite, format, description } = req.body || {};

  if (!nom || !telephone || !service || !description) {
    return res.status(400).json({
      error: "Merci de renseigner au minimum : nom, téléphone, service et description.",
    });
  }

  try {
    const saved = await saveDevis({
      nom,
      telephone,
      email: email || null,
      service,
      quantite: quantite || null,
      format: format || null,
      description,
      statut: "nouveau",
    });

    // Notification : pas de service d'email/SMS payant branché ici. La
    // notification se fait côté client : après l'envoi, le formulaire
    // (pages/devis.js) propose un bouton WhatsApp pré-rempli pour que le
    // client relaie sa demande instantanément à l'imprimerie. Les demandes
    // restent aussi consultables sur /admin.

    return res.status(200).json({ success: true, devis: saved });
  } catch (err) {
    console.error("Erreur lors de l'enregistrement du devis :", err);
    return res.status(500).json({ error: "Erreur serveur, merci de réessayer." });
  }
}
