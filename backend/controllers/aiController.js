const generateAIContent = async (req, res) => {
  try {
    const { contents } = req.body;

    if (!contents) {
      return res
        .status(400)
        .json({ message: "Missing 'contents' in request body" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res
        .status(500)
        .json({ message: "Gemini API key not configured on server" });
    }

    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    });

    if (!response.ok) {
      const errData = await response.json();
      return res
        .status(response.status)
        .json({ message: "Gemini API error", error: errData });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "AI generation failed", error: error.message });
  }
};

module.exports = { generateAIContent };
