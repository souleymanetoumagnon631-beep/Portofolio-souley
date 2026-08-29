const DEFAULT_TO = 'toumagnonsouleymane503@gmail.com';
const DEFAULT_FROM = 'Souleymane Toumagnon <onboarding@resend.dev>';

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });

const clean = (value, max = 4000) => String(value ?? '').trim().slice(0, max);

const escapeHtml = (value) =>
  value.replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));

export default async function handler(request) {
  if (request.method !== 'POST') return json({ message: 'Méthode non autorisée.' }, 405);

  try {
    const form = await request.formData();
    if (clean(form.get('website'), 200)) return json({ message: 'Demande reçue.' });

    const name = clean(form.get('name'), 120);
    const email = clean(form.get('email'), 254);
    const company = clean(form.get('company'), 160);
    const project = clean(form.get('project'), 5000);
    const budget = clean(form.get('budget'), 120);
    const deadline = clean(form.get('deadline'), 120);

    if (!name || !project || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ message: 'Vérifiez votre nom, votre email et la description du projet.' }, 400);
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.QUOTE_TO_EMAIL || DEFAULT_TO;
    const from = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;

    if (!apiKey) {
      console.error('Missing RESEND_API_KEY');
      return json({ message: 'Le service de devis est momentanément indisponible. Contactez-moi directement par email.' }, 500);
    }

    const subject = `Nouvelle demande de devis — ${name}${company ? ` / ${company}` : ''}`;
    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:680px">
        <h2>Nouvelle demande de devis</h2>
        <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
        <p><strong>Email :</strong> ${escapeHtml(email)}</p>
        <p><strong>Entreprise :</strong> ${escapeHtml(company || 'Non renseignée')}</p>
        <p><strong>Budget :</strong> ${escapeHtml(budget || 'Non renseigné')}</p>
        <p><strong>Délai :</strong> ${escapeHtml(deadline || 'Non renseigné')}</p>
        <hr>
        <p><strong>Projet</strong></p>
        <p>${escapeHtml(project).replace(/\n/g, '<br>')}</p>
      </div>`;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject,
        html,
        text: `Nouvelle demande de devis\n\nNom: ${name}\nEmail: ${email}\nEntreprise: ${company || 'Non renseignée'}\nBudget: ${budget || 'Non renseigné'}\nDélai: ${deadline || 'Non renseigné'}\n\nProjet:\n${project}`,
      }),
    });

    if (!resendResponse.ok) {
      console.error('Resend error:', await resendResponse.text());
      return json({ message: 'Impossible d’envoyer la demande pour le moment.' }, 502);
    }

    return json({ message: 'Votre demande a bien été envoyée. Je reviens vers vous rapidement.' });
  } catch (error) {
    console.error(error);
    return json({ message: 'Une erreur est survenue. Réessayez ou contactez-moi directement par email.' }, 500);
  }
}
