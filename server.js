const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs-extra");
const path = require("path");
const { pipeline } = require("@xenova/transformers");

const app = express();
app.use(bodyParser.json());

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt required" });

  const outputPath = path.join("outputs", Date.now() + "-anime.png");

  try {
    const pipe = await pipeline("text-to-image", "Xenova/stable-diffusion-anime");
    const image = await pipe(prompt, { width: 512, height: 512 });

    // Save image to outputs
    const buffer = Buffer.from(await image.arrayBuffer());
    await fs.outputFile(outputPath, buffer);

    res.sendFile(path.resolve(outputPath));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Anime Node.js API running on http://localhost:3000"));
