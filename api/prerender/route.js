export const config = {
  runtime: "edge",
};

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
  const ua = req.headers.get("user-agent") || "";
  const url = new URL(req.url);
  const isBot = BOT_UA.some(bot => bot.test(ua));

  if (!isBot) {
    return fetch(req); // normal user
  }

  const prerenderURL =
    `https://service.prerender.io${url.pathname}${url.search}`;

  const response = await fetch(prerenderURL, {
    headers: {
      "X-Prerender-Token": process.env.PRERENDER_TOKEN,
      "User-Agent": ua,
    },
  });

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      "Content-Type": "text/html",
    },
  });
}