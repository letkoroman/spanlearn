export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { word } = req.body;
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.REACT_APP_ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: `Si španielsky jazykový učiteľ. Dostaneš slovenské slovo a vrátiš JSON objekt (BEZ markdown, BEZ backticks) s týmito poľami:
- "spanish": španielsky preklad slova
- "pronunciation": fonetická výslovnosť španielskeho slova
- "sentence_es": jednoduchá španielska veta s týmto slovom (pre začiatočníkov, max 10 slov)
- "sentence_en": anglický preklad tejto vety
- "description_en": krátky anglický popis/definícia slova (1 veta)
- "synonyms": pole 2-3 španielskych synoným alebo príbuzných výrazov (každý ako objekt s "word" a "translation" v slovenčine)
- "emoji": 1 emoji ktoré reprezentuje toto slovo

Slovenské slovo: "${word}"` }]
    })
  });

  const data = await response.json();
  const text = data.content.map(i => i.text || "").join("");
  const clean = text.replace(/```json|```/g, "").trim();
  res.status(200).json(JSON.parse(clean));
}