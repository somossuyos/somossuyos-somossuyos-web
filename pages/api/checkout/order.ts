import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Proxy servidor → microservicio /order.
 * El token de autorización no debe vivir en el bundle del cliente.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const base = process.env.MICROSERVICE_URL?.replace(/\/$/, '');
  const token = process.env.MICROSERVICE_BEARER_TOKEN;

  if (!base) {
    return res.status(500).json({ error: 'MICROSERVICE_URL is not configured' });
  }
  if (!token) {
    return res.status(500).json({ error: 'MICROSERVICE_BEARER_TOKEN is not configured' });
  }

  try {
    const upstream = await fetch(`${base}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(req.body),
    });

    const contentType = upstream.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      const json = await upstream.json();
      return res.status(upstream.status).json(json);
    }

    const text = await upstream.text();
    return res.status(upstream.status).send(text);
  } catch {
    return res.status(502).json({ error: 'Upstream request failed' });
  }
}
