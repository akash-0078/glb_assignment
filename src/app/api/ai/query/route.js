import fs from "fs";
import path from "path";

const KB_PATH = path.resolve(process.cwd(), "public/kb.json");

function loadKB() {
  const raw = fs.readFileSync(KB_PATH, "utf-8");
  return JSON.parse(raw);
}

// Simple relevance scoring
function simpleRetrieve(kb, question) {
  const q = question.toLowerCase();
  let best;
  let bestScore = 0;

  for (const entry of kb) {
    const text = (entry.title + " " + entry.content).toLowerCase();
    const tokens = q.split(/\W+/).filter(Boolean);
    let score = 0;
    for (const t of tokens) {
      if (t.length <= 2) continue;
      if (text.includes(t)) score += 1;
      if (text.includes(t.slice(0, Math.max(3, Math.floor(t.length / 2))))) score += 0.2;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }
  return { best, score: bestScore };
}

// ✅ This replaces "export default handler"
export async function POST(req) {
  try {
    const body = await req.json();
    const { question } = body;

    if (!question || typeof question !== "string") {
      return new Response(JSON.stringify({ answer: "Please send { question: string } in the body." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const kb = loadKB();
    const { best, score } = simpleRetrieve(kb, question);
    const KB_ACCEPT_THRESHOLD = 1.0;

    // 1️⃣ Local KB answer
    if (best && score >= KB_ACCEPT_THRESHOLD) {
      const answer = `**${best.title}**\n\n${best.content}`;
      return new Response(JSON.stringify({ answer, source: `kb:${best.id}`, debug: { score } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2️⃣ Optional OpenAI integration
    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (OPENAI_KEY) {
      const systemMessages = [
        {
          role: "system",
          content:
            "You are a helpful support assistant for a simple blogging platform. Use the knowledge base provided when answering. If the KB doesn't answer the question, say you don't know and suggest contacting support."
        },
        {
          role: "system",
          content: `Knowledge Base:\n${kb.map((e) => `- ${e.title}: ${e.content}`).join("\n")}`
        },
      ];

      const payload = {
        model: "gpt-3.5-turbo",
        messages: [...systemMessages, { role: "user", content: question }],
        max_tokens: 300,
        temperature: 0.0,
      };

      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      if (!r.ok) {
        const txt = await r.text();
        return new Response(JSON.stringify({ answer: "AI service error", source: "openai", debug: { status: r.status, txt } }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      const j = await r.json();
      const content = j.choices?.[0]?.message?.content ?? "Sorry, I couldn't get an answer.";
      return new Response(JSON.stringify({ answer: content, source: "openai", debug: { usage: j.usage } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3️⃣ Fallback: "I don't know"
    const fallback = best
      ? `**${best.title}**\n\n${best.content}`
      : "Sorry — I don't have an answer in my knowledge base. Please contact support at support@example.com.";

    return new Response(JSON.stringify({ answer: fallback, source: best ? `kb:${best?.id}` : "none", debug: { score } }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ answer: "Server error", debug: err.message || err }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// (Optional) If someone tries GET /api/ai/query, return 405
export function GET() {
  return new Response(JSON.stringify({ answer: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}
