export const config = { runtime: "edge" };

export default async function handler(req) {
  return new Response("EDGE FUNCTION OK", { status: 200 });
}