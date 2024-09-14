const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const { Ollama } = require('ollama');

const ollama = new Ollama({ host: 'http://localhost:11434' });

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


app.post("/chat", async (req, res) => {
  // try {
  //   const userMessage = req.body.message;    

  //   // Send the message to Ollama via HTTP request
  //   const output = await ollama.generate({
  //     model: 'gemma:2b',
  //     prompt: userMessage,
  //     stream: false
  //   });

  //   // Extract the response from Ollama
  //   const ollamaMessage = output.message.content;

  //   // Send Ollama's response back to the client
  //   res.json({ response: ollamaMessage });
  // } catch (error) {
  //   console.error('Error communicating with Ollama:', error);
  //   res.status(500).json({ error: 'Failed to process message with Ollama' });
  // }
  try {
    const userMessage = req.body.message;

    // Send the message to Ollama via an HTTP request using axios
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'gemma:2b',
      prompt: userMessage,
      stream: false
    });

    // Extract the response from Ollama
    const ollamaMessage = response.data.response;

    // Send Ollama's response back to the client
    res.json({ response: ollamaMessage });
  } catch (error) {
    console.error('Error communicating with Ollama:', error);
    res.status(500).json({ error: 'Failed to process message with Ollama' });
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
