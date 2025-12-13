const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: ".env.local" });

const app = express();
app.use(cors());

app.get("/config", (req, res) => {
  res.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    emailjsServiceId: process.env.EMAILJS_SERVICE_ID,
    emailjsTempelateId: process.env.EMAILJS_TEMPELATE_ID,
  });
});

module.exports = app;