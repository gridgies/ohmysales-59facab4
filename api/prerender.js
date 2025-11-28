export default async function handler(req, res) {
  const prerenderToken = 'ohc3SqKlfCGlRnEoaJUV';
  const prerenderUrl = 'https://service.prerender.io';
  
  // Get the original path from query parameter
  const path = req.query.path || '/';
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const url = `${protocol}://${host}${path}`;
  
  console.log('Prerender request for:', url);
  
  try {
    // Forward the request to Prerender.io
    const prerenderResponse = await fetch(`${prerenderUrl}/${encodeURIComponent(url)}`, {
      headers: {
        'X-Prerender-Token': prerenderToken,
        'User-Agent': req.headers['user-agent'] || ''
      }
    });
    
    console.log('Prerender response status:', prerenderResponse.status);
    
    // Get the prerendered HTML
    const html = await prerenderResponse.text();
    
    // Send it back to the bot
    res.setHeader('Content-Type', 'text/html');
    res.status(prerenderResponse.status).send(html);
    
  } catch (error) {
    console.error('Prerender error:', error);
    // If Prerender fails, return 500 error
    res.status(500).send('Prerender service error');
  }
}
