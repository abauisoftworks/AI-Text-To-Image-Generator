import fetch from "node-fetch";

export default async function handler(req, res) {
  const { prompt } = req.query;

  if (!prompt || prompt.length > 500) {
    return res.status(400).json({ error: "Prompt missing or too long" });
  }

  try {
    const apiKey = process.env.BYTEZ_KEY;

    const response = await fetch("https://api.bytez.com/models/stabilityai/stable-diffusion-xl-base-1.0", {
      method: "POST",
      headers: {
        "Authorization": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: prompt,
        width: 512,
        height: 512
      })
    });

    const data = await response.json();
    
    if (!data.output || !data.output[0] || !data.output[0].url) {
      return res.status(500).json({ error: "AI Failed To Generate Image" });
    }

    res.json({ url: data.output[0].url });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
}
