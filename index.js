const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ HEALTH CHECK route
app.get("/", (req, res) => {
  res.send("PythOwO Backend API is running.");
});

// 🐍 Code Execution Endpoint
app.post("/run", async (req, res) => {
  const code = req.body.code;
  if (!code || typeof code !== "string") {
    return res.status(400).json({ output: "🚫 Invalid code input." });
  }

  const tempFile = path.join(__dirname, `temp_${Date.now()}.pyowo`);
  fs.writeFileSync(tempFile, code);

  // 🔥 Use full absolute path to pythowo.py
  const pythowoPath = path.join(__dirname, "pythowo.py");

  const proc = spawn("python", [pythowoPath, tempFile]);

  let stdout = "";
  let stderr = "";

  proc.stdout.on("data", (data) => {
    stdout += data.toString();
  });

  proc.stderr.on("data", (data) => {
    stderr += data.toString();
  });

  proc.on("close", () => {
    fs.unlinkSync(tempFile);
    if (stderr) {
      res.json({ output: `❌ ${stderr}` });
    } else {
      res.json({ output: stdout || "(no output)" });
    }
  });
});

// 🚀 Start the server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
