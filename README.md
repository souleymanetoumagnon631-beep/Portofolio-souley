# Souleymane Toumagnon — Portfolio

## Production Vercel

Structure :

- `index.html` — site
- `styles.css` — styles
- `script.js` — interactions
- `api/contact.mjs` — réception des demandes de devis
- `public/herovideo.mp4` — vidéo Hero à ajouter
- `public/images/` — images à ajouter

### Variables Vercel

Obligatoire :

`RESEND_API_KEY`

Optionnelles :

`QUOTE_TO_EMAIL` — par défaut `toumagnonsouleymane503@gmail.com`
`RESEND_FROM_EMAIL` — par défaut `Souleymane Toumagnon <onboarding@resend.dev>`

### Sans domaine

Le sender `onboarding@resend.dev` convient pour le test initial vers l'adresse email associée au compte Resend. Pour envoyer vers d'autres destinataires, Resend demande ensuite de vérifier un domaine.

### Assets

Ajoute :

`public/herovideo.mp4`
`public/images/profile/profile.jpg`
`public/images/projects/...`
`public/images/about/about.jpg`
