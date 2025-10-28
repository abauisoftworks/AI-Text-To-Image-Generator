import Bytez from "bytez.js";

const sdk = new Bytez(process.env.BYTEZ_KEY);
const model = sdk.model("stabilityai/stable-diffusion-xl-base-1.0");

export default async function handler(req, res) {
  const { prompt } = req.query;
  if (!prompt) return res.status(400).json({ error: "The Prompt Is Required!" });

  try {
    const { error, output } = await model.run(prompt);

    if (error) return res.status(500).json({ error });

    res.status(200).json({ url: output[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed To Generate The Image." });
  }
}
