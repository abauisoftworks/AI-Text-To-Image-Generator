import fetch from "node-fetch";

export default async function handler(req, res) {
  const { prompt } = req.query;
  if (!prompt) return res.status(400).json({ output: null });
  const encodedPrompt = encodeURIComponent(prompt);
  try {
    const response = await fetch(`https://api.bytez.com/models/stabilityai/stable-diffusion-xl-base-1.0/`, {
      method: "POST",
      headers: {
        "Authorization": process.env.BYTEZ_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: encodedPrompt })
    });
    const data = await response.json();
    if (data.output) {
      return res.status(200).json({ output: data.output });
    } else {
      return res.status(200).json({ output: null });
    }
  } catch {
    return res.status(500).json({ output: null });
  }
}
