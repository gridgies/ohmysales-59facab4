export const config = { runtime: "edge" };

/**
 * A list of bots/user agents that should be prerendered.
 * Add or remove entries as needed.
 */
const BOT_UA = [
  /googlebot/i,
  /bingbot/i,
  /yandex/i,
  /duckduckbot/i,
  /baidu/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /prerender/i
];

function isBot(ua = "") {
  if (!ua) return false;
  return BOT_UA.some((r) => r.test(ua));
}

/**
 * Edge function: proxies bot requests to Prerender service,
 * lets normal users fetch the app as usual.
 */
export default async function handler(req) {
  try {
    const ua = req.headers.get("user-agent") || "";
    const url = new URL(req.url);

    // If not a bot, just let the request pass through to static assets / SPA
    if (!isBot(ua)) {
      // Proxy the original request as-is (keeps method / headers)
      return fetch(req);
    }

    // Build the Prerender service URL
    const prerenderUrl = `https://service.prerender.io${url.pathname}${url.search}`;

    const prerenderRes = await fetch(prerenderUrl, {
      method: "GET",
      headers: {
        "User-Agent": ua,
        "X-Prerender-Token": process.env.PRERENDER_TOKEN || ""
      }
    });

    const html = await prerenderRes.text();

    // Relay the prerendered HTML back to the crawler
    const headers = new Headers();
    headers.set("Content-Type", "text/html; charset=utf-8");
    // Optional: allow Vercel to cache prerendered responses if you want
    headers.set("Cache-Control", "public, max-age=0, must-revalidate");

    return new Response(html, {
      status: prerenderRes.status,
      headers
    });
  } catch (err) {
    // Fail safe: return a server error so crawling doesn't silently succeed with SPA
    return new Response("Prerender proxy error", { status: 500 });
  }
}