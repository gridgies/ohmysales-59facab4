/**
 * Vercel Serverless Function for Prerender.io Integration (Vite compatible)
 *
 * This is a fallback approach if Prerender.io's Vercel integration isn't available.
 * For best results, use Prerender.io's official Vercel integration from:
 * https://vercel.com/integrations/prerender
 */

export default async function handler(req, res) {
  const prerenderToken = process.env.PRERENDER_TOKEN;

  if (!prerenderToken) {
    return res.status(500).json({
      error: 'PRERENDER_TOKEN not configured',
      message: 'Add PRERENDER_TOKEN to Vercel environment variables'
    });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      error: 'Missing URL parameter',
      message: 'Usage: /api/prerender?url=https://ohmysales.app/sale/123'
    });
  }

  try {
    const prerenderUrl = `https://service.prerender.io/${encodeURIComponent(url)}`;

    const response = await fetch(prerenderUrl, {
      headers: {
        'X-Prerender-Token': prerenderToken
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Prerender.io error',
        status: response.status
      });
    }

    const html = await response.text();

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Prerender', 'true');
    return res.send(html);

  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch pre-rendered content',
      message: error.message
    });
  }
}
