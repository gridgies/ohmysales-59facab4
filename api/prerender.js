export const config = { runtime: "edge" };

const BOT_UA = [
  /googlebot/i,
  /bingbot/i,
  /yandex/i,
  /duckduckbot/i,
  /baidu/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i
];

export default async function handler(req) {
  const url = new URL(req.url);
  const ua = req.headers.get("user-agent") || "";

  const isBot = BOT_UA.some((bot) => bot.test(ua));

  if (!isBot) {
    // Not a bot → load normal SPA content
    return fetch(req);
  }

  const prerenderUrl =
    `https://service.prerender.io${url.pathname}${url.search}`;

  const prerenderRes = await fetch(prerenderUrl, {
    headers: {
      "User-Agent": ua,
      "X-Prerender-Token": process.env.PRERENDER_TOKEN
    }
  });

  const html = await prerenderRes.text();

  return new Response(html, {
    status: prerenderRes.status,
    headers: {
      "Content-Type": "text/html"
    }
  });
}