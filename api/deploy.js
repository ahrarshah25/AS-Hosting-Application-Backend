import fetch from "node-fetch";

export default async function handler(req, res) {
  if(req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { projectName, uploadedFiles } = req.body;

    if(!projectName) return res.status(400).json({ error: "Missing projectName" });

    // Trigger Vercel deployment using Vercel API
    const vercelRes = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: projectName,
        target: "production",
        // NOTE: Normally you need to provide files or GitHub repo info
        // yaha simple demo ke liye hum empty object bhej rahe hain
      }),
    });

    const data = await vercelRes.json();
    res.status(200).json({ success: true, url: data.url });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}
