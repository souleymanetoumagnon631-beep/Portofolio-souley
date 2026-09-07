const DEFAULT_TO = 'toumagnonsouleymane503@gmail.com';
const DEFAULT_FROM = 'Souleymane Toumagnon <onboarding@resend.dev>';
const MAX_BODY = 1024 * 1024;

const clean = (value, max = 4000) => String(value ?? '').trim().slice(0, max);

const escapeHtml = (value) =>
  value.replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));

const readBody = (req, limit = MAX_BODY) => new Promise((resolve, reject) => {
  const chunks = [];
  let size = 0;
  req.on('data', (chunk) => {
    size += chunk.length;
    if (size > limit) { reject(new Error('body_too_large')); req.destroy(); return; }
    chunks.push(chunk);
  });
  req.on('end', () => resolve(Buffer.concat(chunks)));
  req.on('error', reject);
});

const parseMultipart = (body, contentType) => {
  const match = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType);
  if (!match) return {};
  const boundary = Buffer.from('--' + (match[1] || match[2]).trim());
  const fields = {};
  let start = body.indexOf(boundary);
  while (start !== -1) {
    const next = body.indexOf(boundary, start + boundary.length);
    if (next === -1) break;
    const part = body.slice(start + boundary.length + 2, next - 2);
    const headerEnd = part.indexOf('\r\n\r\n');
    if (headerEnd !== -1) {
      const header = part.slice(0, headerEnd).toString('utf8');
      const nameMatch = /name="([^"]*)"/i.exec(header);
      if (nameMatch) fields[nameMatch[1]] = part.slice(headerEnd + 4).toString('utf8');
    }
    start = next;
  }
  return fields;
};

export default async function handler(req, res) {
  const json = (data, status = 200) => {
    res.statusCode = status;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    res.end(JSON.stringify(data));
  };

  if (req.method !== 'POST') return json({ message: 'Méthode non autorisée.' }, 405);

  try {
    const contentType = req.headers['content-type'] || '';
    if (!/multipart\/form-data/i.test(contentType)) {
      return json({ message: 'Requête invalide.' }, 400);
    }

    const body = await readBody(req);
    const form = parseMultipart(body, contentType);
    if (clean(form.website, 200)) return json({ message: 'Demande reçue.' });

    const name = clean(form.name, 120);
    const email = clean(form.email, 254);
    const company = clean(form.company, 160);
    const project = clean(form.project, 5000);
    const budget = clean(form.budget, 120);
    const deadline = clean(form.deadline, 120);

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
    if (error.message === 'body_too_large') return json({ message: 'Le contenu envoyé est trop volumineux.' }, 413);
    console.error(error);
    return json({ message: 'Une erreur est survenue. Réessayez ou contactez-moi directement par email.' }, 500);
  }
}
