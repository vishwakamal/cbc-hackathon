const CLAUDE_MODEL = 'claude-sonnet-4-6-20250514';

export async function callClaude(systemPrompt, userMessage, apiKey) {
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

  // Parse JSON from the response, handling potential markdown code blocks
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim();
  return JSON.parse(jsonStr);
}

export function getCheckInPrompt({ soreness, sleep, load, area }) {
  const systemPrompt = `You are a sports medicine assistant. A user has submitted their daily recovery check-in. Return ONLY a valid JSON object with no other text.`;

  const userMessage = `Inputs:
- Soreness level: ${soreness}/10
- Sleep quality: ${sleep}/10
- Training load: ${load}
- Sore area: ${area || 'None specified'}

Return a JSON object with:
{
  "score": <0-100 integer>,
  "status": "<Good to Train | Train Light | Rest Day Recommended | Overtraining Warning>",
  "tips": ["tip 1", "tip 2", "tip 3"],
  "seeDoctorFlag": <true|false>,
  "seeDoctorReason": "<reason if flagged, else null>"
}

Only return the JSON object, no other text.`;

  return { systemPrompt, userMessage };
}

export function getInjuryPrompt({ bodyPart, mechanism, pain, swelling, timing }) {
  const systemPrompt = `You are a sports medicine assistant. A user has reported an injury and needs home treatment guidance. Return ONLY a valid JSON object with no other text.`;

  const userMessage = `Inputs:
- Body part: ${bodyPart}
- How it happened: ${mechanism}
- Pain level: ${pain}/10
- Swelling: ${swelling}
- When: ${timing}

Return a JSON object with:
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
}

Only return the JSON object, no other text.`;

  return { systemPrompt, userMessage };
}
