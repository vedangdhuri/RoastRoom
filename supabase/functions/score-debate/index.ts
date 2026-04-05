// Supabase Edge Function: /score-debate
// Deno TypeScript – scores debate/roast messages via OpenAI (with Gemini fallback)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ScoreRequest {
  message: string;
  mode: "debate" | "roast";
  matchId: string;
  userId: string;
  round: number;
}

interface ScoreResult {
  logic: number;
  creativity: number;
  clarity: number;
  humor: number;
  total: number;
  feedback: string;
}

// ── Rate Limiter (in-memory, resets on cold start) ────────────────────────────

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // max requests per user per minute

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

// ── Validation ────────────────────────────────────────────────────────────────

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validate(body: ScoreRequest): string | null {
  if (!body.message || body.message.length < 10)
    return "Message too short (min 10 characters)";
  if (body.message.length > 500)
    return "Message too long (max 500 characters)";
  if (!["debate", "roast"].includes(body.mode))
    return "Invalid mode – must be 'debate' or 'roast'";
  if (!UUID_RE.test(body.matchId)) return "Invalid matchId UUID";
  if (!UUID_RE.test(body.userId)) return "Invalid userId UUID";
  if (typeof body.round !== "number" || body.round < 1)
    return "Invalid round number";
  return null;
}

// ── Scoring Weights by Mode ───────────────────────────────────────────────────

const WEIGHTS = {
  debate: { logic: 0.4, clarity: 0.3, creativity: 0.2, humor: 0.1 },
  roast:  { humor: 0.4, creativity: 0.3, logic: 0.2, clarity: 0.1 },
};

function buildSystemPrompt(mode: "debate" | "roast"): string {
  const w = WEIGHTS[mode];
  return `You are an impartial AI judge for a ${mode} competition.
Score the following ${mode === "debate" ? "argument" : "roast"} on four criteria, each from 0.0 to 10.0:
- logic (${w.logic * 100}% weight)
- creativity (${w.creativity * 100}% weight)
- clarity (${w.clarity * 100}% weight)
- humor (${w.humor * 100}% weight)

Compute total = logic*${w.logic} + creativity*${w.creativity} + clarity*${w.clarity} + humor*${w.humor}, rounded to 2 decimal places.
Provide 2-3 sentences of punchy, specific feedback.

Respond ONLY with valid JSON in this exact shape:
{"logic":X,"creativity":X,"clarity":X,"humor":X,"total":X,"feedback":"..."}`;
}

// ── OpenAI Primary ────────────────────────────────────────────────────────────

async function scoreWithOpenAI(
  message: string,
  mode: "debate" | "roast"
): Promise<ScoreResult> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: buildSystemPrompt(mode) },
        { role: "user", content: message },
      ],
      temperature: 0.4,
      max_tokens: 200,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content) as ScoreResult;
}

// ── Gemini Fallback ───────────────────────────────────────────────────────────

async function scoreWithGemini(
  message: string,
  mode: "debate" | "roast"
): Promise<ScoreResult> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: buildSystemPrompt(mode) + "\n\nMessage to score:\n" + message },
          ],
        },
      ],
      generationConfig: { temperature: 0.4, maxOutputTokens: 200 },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Gemini returned no JSON");
  return JSON.parse(jsonMatch[0]) as ScoreResult;
}

// ── Main Handler ──────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": Deno.env.get("VITE_APP_URL") ?? "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: CORS_HEADERS });
  }

  let body: ScoreRequest;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  // Validate
  const validationError = validate(body);
  if (validationError) {
    return new Response(
      JSON.stringify({ error: validationError }),
      { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  // Rate limit
  if (isRateLimited(body.userId)) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded – max 10 requests per minute" }),
      { status: 403, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  // Score: OpenAI first, Gemini fallback
  let result: ScoreResult;
  try {
    result = await scoreWithOpenAI(body.message, body.mode);
  } catch (openAiError) {
    console.error("OpenAI failed, trying Gemini:", openAiError);
    try {
      result = await scoreWithGemini(body.message, body.mode);
    } catch (geminiError) {
      console.error("Gemini also failed:", geminiError);
      return new Response(
        JSON.stringify({ error: "AI scoring unavailable – both providers failed" }),
        { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }
  }

  // Persist score to Supabase using service role key
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    await supabase.from("scores").insert({
      match_id: body.matchId,
      user_id: body.userId,
      round: body.round,
      logic: result.logic,
      creativity: result.creativity,
      clarity: result.clarity,
      humor: result.humor,
      total: result.total,
      feedback: result.feedback,
    });
  } catch (dbError) {
    // Log but don't fail the request – client still gets the score
    console.error("Failed to persist score to DB:", dbError);
  }

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
});
