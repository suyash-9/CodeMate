const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 8000;

app.use(cors());
app.use(bodyParser.json());

// Judge0 API endpoint for submissions
const JUDGE0_URL = "http://localhost:2358/submissions?base64_encoded=false&wait=true";

// Language ID mapping for Judge0
const languageIds = {
  Cpp: 54,
  Java: 62,
  Python: 71,
  Javascript: 63,
};

// Endpoint to receive code, language, and input from the frontend
app.post("/compile", async (req, res) => {
  const { code, input, lang } = req.body;
  const languageId = languageIds[lang];

  if (!languageId) {
    return res.status(400).json({ output: "Error: Unsupported language." });
  }

  try {
    // Sending the code and input to Judge0 API
    const response = await axios.post(JUDGE0_URL, {
      source_code: code,
      language_id: languageId,
      stdin: input,
    });

    // Extracting the output or error message
    const { stdout, stderr } = response.data;
    res.json({ output: stderr || stdout });
  } catch (error) {
    res.status(500).json({ output: `Error: ${error.message}` });
  }
});

// Basic route to test server
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
