import { NextResponse } from 'next/server';

export async function middleware(req) {
  const botUserAgents = [
    /googlebot/i,
    /bingbot/i,
    /yandex/i,
    /duckduckbot/i,
    /baidu/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /linkedinbot/i
  ];

  const ua = req.headers.get('user-agent') || '';
  const isBot = botUserAgents.some((bot) => bot.test(ua));

  if (!isBot) return NextResponse.next();

  const prerenderURL = `https://service.prerender.io/${req.nextUrl.pathname}${req.nextUrl.search}`;
  const headers = {
    'X-Prerender-Token': process.env.PRERENDER_TOKEN,
    'User-Agent': ua
  };

  const response = await fetch(prerenderURL, { headers });

  const body = await response.text();
  return new NextResponse(body, {
    status: response.status,
    headers: { 'Content-Type': 'text/html' }
  });
}

export const config = {
  matcher: ['/((?!_next/|api/).*)'], // apply to all pages
};