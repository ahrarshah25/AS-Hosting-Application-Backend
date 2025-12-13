import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // === CORS headers ===
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5500"); // allow your frontend
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { projectName, files } = req.body;

    if (!projectName || !files)
      return res.status(400).json({ error: "Missing projectName or files" });

    const uploadedFiles = [];

    for (const file of files) {
      const { data, error } = await supabase.storage
        .from("projects")
        .upload(`${projectName}/${file.name}`, Buffer.from(file.data, "base64"), { upsert: true });

      if (error) throw error;
      uploadedFiles.push(data.path);
    }

    res.status(200).json({ success: true, uploadedFiles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}
