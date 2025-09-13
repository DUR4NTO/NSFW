const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const { pipeline } = require("@xenova/transformers");

const app = express();

// GET /generate?prompt=anime+girl+blue+hair
app.get("/generate", async (req, res) => {
  const prompt = req.query.prompt;
  if (!prompt) return res.status(400).send("❌ Error: 'prompt' query required");

  const outputPath = path.join("outputs", Date.now() + "-anime.png");

  try {
    const pipe = await pipeline("text-to-image", "Xenova/stable-diffusion-anime");
    const image = await pipe(prompt, { width: 512, height: 512 });

    const buffer = Buffer.from(await image.arrayBuffer());
    await fs.outputFile(outputPath, buffer);

    res.setHeader("Content-Type", "image/png");
    res.send(buffer); // Direct image response
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error generating image");
  }
});

app.listen(3000, () => console.log("Anime Node.js GET API running on http://localhost:3000"));
