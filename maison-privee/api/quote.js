const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value, max = 300) {
  return String(value ?? '').trim().replace(/[\u0000-\u001F\u007F]/g, '').slice(0, max);
}

function escapeHtml(value) {
  return clean(value, 4000)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.QUOTE_TO_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Maison Privée <onboarding@resend.dev>';

  if (!apiKey || !toEmail) {
    console.error('Missing RESEND_API_KEY or QUOTE_TO_EMAIL');
    return res.status(500).json({ error: 'Le formulaire email n’est pas encore configuré.' });
  }

  const body = req.body || {};
  if (clean(body.website, 200)) return res.status(200).json({ ok: true });

  const data = {
    name: clean(body.name, 120),
    email: clean(body.email, 160),
    phone: clean(body.phone, 60),
    company: clean(body.company, 120),
    service: clean(body.service, 120),
    destination: clean(body.destination, 120),
    dates: clean(body.dates, 120),
    guests: clean(body.guests, 20),
    budget: clean(body.budget, 120),
    message: clean(body.message, 3000),
    consent: Boolean(body.consent)
  };

  if (!data.name || !EMAIL_RE.test(data.email) || !data.service || !data.message || !data.consent) {
    return res.status(400).json({ error: 'Merci de compléter les champs obligatoires.' });
  }

  const rows = [
    ['Nom', data.name],
    ['Email', data.email],
    ['Téléphone', data.phone || '—'],
    ['Société / agence', data.company || '—'],
    ['Type de demande', data.service],
    ['Destination', data.destination || '—'],
    ['Dates', data.dates || '—'],
    ['Invités', data.guests || '—'],
    ['Budget indicatif', data.budget || '—']
  ];

  const htmlRows = rows.map(([label, value]) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;color:#76634d;font-size:13px;width:34%;"><strong>${escapeHtml(label)}</strong></td>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;color:#171411;font-size:13px;">${escapeHtml(value)}</td>
    </tr>`).join('');

  const html = `
  <div style="font-family:Arial,sans-serif;background:#f6f1e8;padding:28px;color:#171411;">
    <div style="max-width:700px;margin:auto;background:#fff;padding:28px;border:1px solid #e5dacb;">
      <p style="letter-spacing:2px;font-size:11px;color:#a17b49;margin:0 0 10px;">MAISON PRIVÉE · NOUVELLE DEMANDE</p>
      <h1 style="font-family:Georgia,serif;font-weight:500;font-size:30px;margin:0 0 24px;">${escapeHtml(data.service)}</h1>
      <table style="width:100%;border-collapse:collapse;">${htmlRows}</table>
      <div style="margin-top:24px;padding:18px;background:#faf7f2;border-left:3px solid #c7a067;">
        <p style="margin:0 0 8px;color:#76634d;font-size:12px;text-transform:uppercase;letter-spacing:1px;"><strong>Brief</strong></p>
        <p style="white-space:pre-wrap;margin:0;line-height:1.65;font-size:14px;">${escapeHtml(data.message)}</p>
      </div>
      <p style="margin-top:24px;font-size:12px;color:#8b8378;">Répondre au prospect : <a href="mailto:${escapeHtml(data.email)}" style="color:#8d6838;">${escapeHtml(data.email)}</a></p>
    </div>
  </div>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: data.email,
        subject: `Nouveau brief Maison Privée — ${data.name}`,
        html,
        text: `Maison Privée — Nouveau brief

Nom: ${data.name}
Email: ${data.email}
Téléphone: ${data.phone || '—'}
Société / agence: ${data.company || '—'}
Type de demande: ${data.service}
Destination: ${data.destination || '—'}
Dates: ${data.dates || '—'}
Invités: ${data.guests || '—'}
Budget indicatif: ${data.budget || '—'}

Brief:
${data.message}`
      })
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('Resend error:', response.status, result);
      return res.status(502).json({ error: 'L’envoi email a échoué. Réessayez dans un instant.' });
    }

    return res.status(200).json({ ok: true, id: result.id || null });
  } catch (error) {
    console.error('Quote endpoint error:', error);
    return res.status(500).json({ error: 'Impossible d’envoyer la demande pour le moment.' });
  }
}
