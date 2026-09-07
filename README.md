# Souleymane Toumagnon — Portfolio

Site statique (HTML/CSS/JS natifs) + une fonction serverless Vercel (`api/contact.mjs`) pour le formulaire de devis.

## Structure

- `index.html` — site
- `styles.css` — styles
- `script.js` — interactions (hero vidéo scrubée, animations)
- `assets/` — vidéo hero (`hero-scrub.mp4`), poster, images → servies sous `/assets/`
- `public/images/` — images projets + section à propos → servies sous `/public/images/`
- `images/og.jpg` — image de partage social (og:image)
- `api/contact.mjs` — fonction serverless : réception des demandes de devis via Resend
- `confidentialite.html`, `robots.txt`, `sitemap.xml`
- `vercel.json` — configuration (framework `null` = statique, cache long sur les assets)

## Déploiement Vercel

Aucun build : Vercel sert le dossier tel quel et compile automatiquement `api/` en fonction serverless.

### Option 1 — Git (recommandé)

1. Poussez ce dossier sur GitHub.
2. Sur [vercel.com](https://vercel.com) → **Add New… → Project** → importez le dépôt.
3. Framework Preset : **Other** (déjà fixé dans `vercel.json`). Laissez les réglages de build par défaut.
4. Renseignez les variables d'environnement (voir ci-dessous).
5. **Deploy**.

### Option 2 — CLI

```bash
npm i -g vercel
vercel login
vercel            # aperçu (preview)
vercel --prod     # production
```

### Variables Vercel

Obligatoire :

`RESEND_API_KEY`

Optionnelles :

`QUOTE_TO_EMAIL` — par défaut `toumagnonsouleymane503@gmail.com`
`RESEND_FROM_EMAIL` — par défaut `Souleymane Toumagnon <onboarding@resend.dev>`

### Sans domaine

Le sender `onboarding@resend.dev` convient pour le test initial vers l'adresse email associée au compte Resend. Pour envoyer vers d'autres destinataires, Resend demande ensuite de vérifier un domaine.

## Domaine

`robots.txt` et `sitemap.xml` pointent vers `https://portofolio-souley.vercel.app/`. Si vous ajoutez un domaine personnalisé, remplacez cette URL dans ces deux fichiers.

