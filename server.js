require('dotenv').config(); 
const express = require('express');
const fetch = require('node-fetch'); 
const cors = require('cors');

const app = express();
const port = 3000;


const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
  console.error("\n*** ERROR: GEMINI_API_KEY is not set. ***");
  console.error("1. Rename '.env.example' to '.env'");
  console.error("2. Get a key from https://aistudio.google.com/app/apikey");
  console.error("3. Paste your key into the .env file.\n");
  process.exit(1);
}


const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

app.use(cors());
app.use(express.json()); 

app.post('/api/explain', async (req, res) => {
  const { scenario, inputs, outputs } = req.body;

  
  if (!scenario || !inputs || !outputs) {
    return res.status(400).json({ error: 'Missing scenario, inputs, or outputs' });
  }

 
  const promptContent = `
You are an expert AI assistant for a "Wireless and Mobile Networks" university course project.
Your task is to provide a detailed, user-friendly, and educational explanation for a calculation performed by a web application.

**Scenario:** ${scenario}

**User-Provided Inputs:**
\`\`\`json
${JSON.stringify(inputs, null, 2)}
\`\`\`

**Calculator-Computed Results:**
\`\`\`json
${JSON.stringify(outputs, null, 2)}
\`\`\`

---

**Your Task:**

Please provide an explanation that covers the following points in a clear, step-by-step manner:

1. **Input Validation & Introduction:**
    * Briefly state the purpose of this calculation in the context of wireless networks.
    * Comment on the user's inputs, mentioning if they are typical or valid for such a scenario (e.g., "A source encoder rate of 0.25 is typical for voice compression...").

2. **Methodology & Formulas:**
    * Go through **each result** one by one.
    * For each result, state the **name of the parameter** and the **formula** used to calculate it.
    * Show how the user's input values are **substituted into the formula**.
    * Explain the reasoning and significance behind each calculation step.

3. **Conclusion & Significance:**
    * Summarize what the final results mean in a practical, real-world sense. For example, what does the required transmit power imply for the type of device needed? What does the spectral efficiency indicate about the system's performance?

**Formatting:**
* Use Markdown for clear formatting.
* Use headings (\`##\`), bold text (\`**text**\`), lists, and code blocks for formulas and values.
`;

  try {
    const geminiRequestBody = {
      contents: [{
        parts: [{
          text: promptContent
        }]
      }]
    };

    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geminiRequestBody),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        console.error('Error from Gemini API:', errorBody);
        throw new Error(`Google API responded with status ${response.status}: ${errorBody.error.message}`);
    }

    const data = await response.json();
    const explanation = data.candidates[0].content.parts[0].text;
    res.json({ explanation });

  } catch (error) {
    console.error('Error calling Google Gemini API:', error);
    res.status(500).json({ error: `Failed to get explanation from AI assistant. ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`AI explanation server running at http://localhost:${port}`);
  console.log("Waiting for requests from the frontend...");
});
