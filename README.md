# Optiniel Services — Site web (imprimerie)

Site vitrine + demande de devis en ligne, construit avec **Next.js** (front-end
et back-end réunis) et pensé pour un déploiement gratuit sur **Vercel** +
**Supabase**.

## Pages du site

- `/` — Accueil
- `/services` — Catalogue des prestations
- `/realisations` — Portfolio
- `/devis` — Formulaire de demande de devis (relié à l'API)
- `/contact` — Coordonnées + lien WhatsApp
- `/apropos` — Présentation de l'entreprise
- `/admin` — Espace pour consulter les demandes de devis reçues (protégé par mot de passe)

## 1. Installer et lancer en local

```bash
npm install
npm run dev
```

Le site est alors accessible sur http://localhost:3000. Sans configuration
supplémentaire, les demandes de devis sont enregistrées dans un fichier local
`devis-local.json` (uniquement pour tester — voir étape 2 pour la vraie base
de données).

## 2. Créer la base de données (Supabase, gratuit)

1. Créez un compte sur https://supabase.com et créez un nouveau projet (gratuit).
2. Dans l'éditeur SQL du projet, exécutez :

```sql
create table devis (
  id bigint generated always as identity primary key,
  nom text not null,
  telephone text not null,
  email text,
  service text not null,
  quantite text,
  format text,
  description text not null,
  statut text default 'nouveau',
  created_at timestamptz default now()
);
```

3. Allez dans **Project Settings > API** et récupérez :
   - `Project URL` → variable `SUPABASE_URL`
   - `service_role` key (⚠️ secrète, ne jamais l'exposer côté client) → variable `SUPABASE_SERVICE_KEY`

4. Copiez `.env.example` en `.env.local` et renseignez ces valeurs, plus un
   `ADMIN_PASSWORD` de votre choix pour protéger `/admin`.

## 3. Déployer sur Vercel (gratuit)

1. Poussez ce projet sur un dépôt GitHub.
2. Sur https://vercel.com, cliquez sur **Add New > Project** et importez le dépôt.
3. Dans **Environment Variables**, ajoutez les 3 variables du fichier `.env.local`
   (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `ADMIN_PASSWORD`).
4. Cliquez sur **Deploy**. Le site sera en ligne sur une URL `*.vercel.app`
   (vous pourrez ensuite y attacher un nom de domaine personnalisé, aussi
   gratuitement si Vercel gère le domaine, ou via un CNAME sinon).

## 4. À compléter avant mise en ligne définitive

Cherchez les balises `[À compléter : ...]` dans le code (`Footer.js`,
`contact.js`, `apropos.js`) et remplacez-les par les vraies informations :
adresse, téléphone, email.

Dans `pages/contact.js`, remplacez `WHATSAPP_NUMBER` par le vrai numéro
WhatsApp (format international, sans le `+`, ex : `22997000000`).

## 5. Prochaines évolutions possibles (V2)

- Paiement Mobile Money (MTN MoMo / Moov Money) au moment de la commande.
- Upload de fichiers à imprimer directement dans le formulaire de devis
  (nécessite un espace de stockage, ex : Supabase Storage).
- Notification automatique (email ou WhatsApp Business API) à chaque
  nouvelle demande de devis.
- Espace client avec historique des commandes.

## Stack technique

- **Front-end** : Next.js (React), Tailwind CSS
- **Back-end** : API routes Next.js
- **Base de données** : Supabase (PostgreSQL gratuit)
- **Hébergement** : Vercel (gratuit)
