import { useState } from "react";

const GREEN = "#58CC02";
const GREEN_DARK = "#45A800";
const GREEN_BG = "#F0FDE4";
const YELLOW = "#FFC800";
const BLUE = "#1CB0F6";
const BLUE_BG = "#E8F6FF";
const ORANGE = "#FF9600";
const ORANGE_BG = "#FFF3E0";
const PURPLE = "#CE82FF";
const PURPLE_BG = "#F5EEFF";
const GRAY = "#AFAFAF";

export default function App() {
  const [word, setWord] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [streak, setStreak] = useState(0);

  async function translate() {
    if (!word.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/translate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ word: word.trim() })
});
const parsed = await res.json();
setResult(parsed);
setStreak(s => s + 1);
    } catch (e) {
      setError("Nastala chyba. Skús to znova.");
    }
    setLoading(false);
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", maxWidth: 560, margin: "0 auto", padding: "1.5rem 1rem" }}>
      <h2 className="sr-only">Španielsky učebný nástroj</h2>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 40, marginBottom: 4 }}>🦜</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: GREEN_DARK, letterSpacing: -0.5 }}>SpanLearn</div>
        <div style={{ fontSize: 13, color: GRAY }}>Nauč sa španielčinu slovíčko po slovíčku</div>
        {streak > 0 && (
          <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 6,
            background: YELLOW, borderRadius: 20, padding: "4px 14px", fontSize: 13, fontWeight: 600, color: "#7A5800" }}>
            🔥 {streak} v sérii!
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
        <input
          value={word}
          onChange={e => setWord(e.target.value)}
          onKeyDown={e => e.key === "Enter" && translate()}
          placeholder="Zadaj slovenské slovo..."
          style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: `2px solid ${GREEN}`,
            fontSize: 16, outline: "none", fontFamily: "inherit", color: "#333" }}
        />
        <button
          onClick={translate}
          disabled={loading || !word.trim()}
          style={{ padding: "12px 20px", borderRadius: 12, border: "none",
            background: loading || !word.trim() ? GRAY : GREEN,
            color: "#fff", fontWeight: 700, fontSize: 15, cursor: loading || !word.trim() ? "default" : "pointer",
            transition: "background 0.2s", letterSpacing: 0.3 }}>
          {loading ? "..." : "Preložiť"}
        </button>
      </div>

      {error && (
        <div style={{ background: "#FFECEC", border: "1px solid #FFB3B3", borderRadius: 10, padding: "10px 14px",
          color: "#C0392B", fontSize: 14, marginBottom: "1rem" }}>{error}</div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "2rem", color: GRAY }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>⏳</div>
          <div style={{ fontSize: 14 }}>Generujem preklad...</div>
        </div>
      )}

      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Main word card */}
          <div style={{ background: GREEN, borderRadius: 16, padding: "1.25rem 1.5rem", color: "#fff" }}>
            <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.85, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
              Slovensky → Španielsky
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{result.spanish}</div>
                <div style={{ fontSize: 14, opacity: 0.85, marginTop: 2 }}>/{result.pronunciation}/</div>
              </div>
              <div style={{ fontSize: 44 }}>{result.emoji}</div>
            </div>
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.3)",
              fontSize: 13, opacity: 0.9 }}>
              🇸🇰 <strong>{word}</strong>
            </div>
          </div>

          {/* Description */}
          <div style={{ background: BLUE_BG, borderRadius: 14, padding: "1rem 1.25rem",
            border: `1.5px solid ${BLUE}` }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: BLUE, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
              📖 Definícia
            </div>
            <div style={{ fontSize: 14, color: "#1a1a2e", lineHeight: 1.6 }}>{result.description_en}</div>
          </div>

          {/* Sentence */}
          <div style={{ background: ORANGE_BG, borderRadius: 14, padding: "1rem 1.25rem",
            border: `1.5px solid ${ORANGE}` }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: ORANGE, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
              💬 Veta v španielčine
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#5A3800", marginBottom: 6, lineHeight: 1.5 }}>
              🇪🇸 {result.sentence_es}
            </div>
            <div style={{ fontSize: 13, color: "#7A5800", lineHeight: 1.5 }}>
              🇬🇧 {result.sentence_en}
            </div>
          </div>

          {/* Synonyms */}
          <div style={{ background: PURPLE_BG, borderRadius: 14, padding: "1rem 1.25rem",
            border: `1.5px solid ${PURPLE}` }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#9B5CF6", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
              🔁 Synonymá / Príbuzné výrazy
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {result.synonyms?.map((s, i) => (
                <div key={i} style={{ background: "#fff", border: `1.5px solid ${PURPLE}`,
                  borderRadius: 10, padding: "6px 14px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#7C3AED" }}>{s.word}</span>
                  <span style={{ fontSize: 11, color: "#9B5CF6", marginTop: 1 }}>{s.translation}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Try another */}
          <button
            onClick={() => { setWord(""); setResult(null); }}
            style={{ marginTop: 4, padding: "12px", borderRadius: 12, border: `2px solid ${GREEN}`,
              background: "#fff", color: GREEN_DARK, fontWeight: 700, fontSize: 14, cursor: "pointer",
              letterSpacing: 0.3 }}>
            + Ďalšie slovo
          </button>
        </div>
      )}

      {!result && !loading && (
        <div style={{ textAlign: "center", padding: "1.5rem", color: GRAY }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🇪🇸</div>
          <div style={{ fontSize: 14 }}>Zadaj akékoľvek slovenské slovo a ja ho preložím!</div>
          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
            {["pes", "more", "šťastie", "auto", "kvet"].map(w => (
              <button key={w} onClick={() => { setWord(w); }}
                style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${GREEN}`,
                  background: GREEN_BG, color: GREEN_DARK, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                {w}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}