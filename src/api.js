const CLAUDE_MODEL = 'claude-sonnet-4-6';

function getApiKey() {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!key) throw new Error('VITE_ANTHROPIC_API_KEY is not set in .env');
  return key;
}

export async function callClaude(systemPrompt, userMessage) {
  const apiKey = getApiKey();

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  const text = data.content[0].text;

  // Handle markdown code-block-wrapped JSON
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim();
  return JSON.parse(jsonStr);
}

export function getCheckInPrompt({ soreness, sleep, load, area }) {
  const systemPrompt = `You are a sports medicine assistant. Return ONLY a valid JSON object with no other text.`;

  const userMessage = `Daily recovery check-in inputs:
- Soreness level: ${soreness}/10
- Sleep quality: ${sleep}/10
- Training load: ${load}
- Sore area: ${area || 'None specified'}

Return exactly this JSON shape:
{
  "score": <0-100 integer>,
  "status": "<Good to Train | Train Light | Rest Day Recommended | Overtraining Warning>",
  "tips": ["tip 1", "tip 2", "tip 3"],
  "seeDoctorFlag": <true|false>,
  "seeDoctorReason": "<reason if flagged, else null>"
}`;

  return { systemPrompt, userMessage };
}

export function getInjuryPrompt({ bodyParts, mechanism, pain, swelling, timing }) {
  const systemPrompt = `You are a sports medicine assistant providing home treatment guidance. Return ONLY a valid JSON object with no other text.`;

  const userMessage = `Injury report:
- Body parts affected: ${Array.isArray(bodyParts) ? bodyParts.join(', ') : bodyParts}
- How it happened: ${mechanism}
- Pain level: ${pain}/10
- Swelling: ${swelling}
- When: ${timing}

Return exactly this JSON shape:
{
  "riceSummary": {
    "rest": "<specific rest instruction>",
    "ice": "<icing instruction with duration>",
    "compression": "<compression instruction>",
    "elevation": "<elevation instruction>"
  },
  "icingIntervalMinutes": <number>,
  "recoveryTimelineDays": "<e.g. 3-5 days>",
  "avoid": ["thing to avoid 1", "thing to avoid 2"],
  "seeDoctorConditions": ["condition 1", "condition 2"],
  "urgentFlag": <true|false>
}`;

  return { systemPrompt, userMessage };
}

export function getRTPPrompt({ injury, daysSince, painRest, painActivity, swelling, rom, strength, balance, confidence }) {
  const systemPrompt = `You are a sports medicine specialist applying evidence-based Return to Play (RTP) protocols. Return ONLY a valid JSON object with no other text.`;

  const userMessage = `Return-to-sport assessment:
- Injury / body part: ${injury || 'Not specified'}
- Days since injury: ${daysSince}
- Pain at rest: ${painRest}/10
- Pain during sport movements: ${painActivity}/10
- Swelling: ${swelling}
- Range of motion vs. uninjured side: ${rom}
- Strength vs. uninjured side: ${strength}
- Balance / proprioception: ${balance}
- Psychological confidence to return: ${confidence}/10

Return exactly this JSON shape:
{
  "readiness": "<green | yellow | red>",
  "readinessScore": <0-100 integer>,
  "clearanceLevel": "<Full Clearance | Partial Return | Not Ready>",
  "summary": "<2-3 sentence overall assessment>",
  "criteria": [
    { "name": "Pain Control",          "status": "<pass|warn|fail>", "note": "<short note>" },
    { "name": "Swelling",              "status": "<pass|warn|fail>", "note": "<short note>" },
    { "name": "Range of Motion",       "status": "<pass|warn|fail>", "note": "<short note>" },
    { "name": "Strength",              "status": "<pass|warn|fail>", "note": "<short note>" },
    { "name": "Neuromuscular Control", "status": "<pass|warn|fail>", "note": "<short note>" },
    { "name": "Psychological Readiness","status": "<pass|warn|fail>","note": "<short note>" }
  ],
  "recommendation": "<specific return-to-play recommendation>",
  "restrictions": ["restriction 1", "restriction 2"],
  "nextSteps": ["step 1", "step 2", "step 3"]
}`;

  return { systemPrompt, userMessage };
}
