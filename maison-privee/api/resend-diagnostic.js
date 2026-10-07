export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (req.query.token !== 'mp-resend-diag-20261007') {
    return res.status(404).json({ ok: false });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.QUOTE_TO_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Maison Privée <onboarding@resend.dev>';

  const diagnostics = {
    hasApiKey: Boolean(apiKey),
    apiKeyShape: Boolean(apiKey && apiKey.startsWith('re_')),
    hasToEmail: Boolean(toEmail),
    toEmailShape: Boolean(toEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)),
    hasCustomFrom: Boolean(process.env.RESEND_FROM_EMAIL),
    fromUsesResendTestDomain: fromEmail.includes('@resend.dev')
  };

  if (!apiKey || !toEmail) {
    return res.status(500).json({ ok: false, stage: 'env', diagnostics });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject: 'Maison Privée — test Resend',
        html: '<p>Test de connexion Resend pour Maison Privée.</p>'
      })
    });

    const result = await response.json().catch(() => ({}));

    return res.status(response.ok ? 200 : 502).json({
      ok: response.ok,
      stage: 'resend',
      diagnostics,
      resendStatus: response.status,
      resendName: result?.name || null,
      resendMessage: result?.message || result?.error || null,
      resendCode: result?.code || null,
      id: response.ok ? (result?.id || null) : null
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      stage: 'network',
      diagnostics,
      message: error?.message || 'Unknown error'
    });
  }
}