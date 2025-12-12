export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
  if (!SCRIPT_URL) return res.status(500).json({ ok: false, error: "Missing GOOGLE_SCRIPT_URL env var" });

  try {
    let payload = req.body;
    if (typeof payload === "string") {
      try { payload = JSON.parse(payload); } catch { /* keep as string */ }
    }

    const r = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await r.text();
    if (!r.ok) {
      return res.status(r.status || 500).json({ ok: false, error: text || "Upstream error" });
    }
    return res.status(200).json({ ok: true, upstream: text });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
