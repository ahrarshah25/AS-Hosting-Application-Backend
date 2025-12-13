import fetch from "node-fetch";

export default async function handler(req, res) {
  // === CORS headers ===
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5500");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { projectName, uploadedFiles } = req.body;

    if (!projectName) return res.status(400).json({ error: "Missing projectName" });

    const vercelRes = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: projectName,
        target: "production",
      }),
    });

    const data = await vercelRes.json();
    res.status(200).json({ success: true, url: data.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}