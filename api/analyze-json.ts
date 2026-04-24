export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { json, source = 'Untitled JSON' } = req.body || {};

  if (!json) {
    return res.status(400).json({ error: 'Missing json payload' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      summary: 'AI analysis is not configured yet. Add OPENAI_API_KEY in Vercel environment variables to enable server-side AI summaries.',
      risks: [],
      recommendations: ['Configure OPENAI_API_KEY on the deployment provider.', 'Keep API keys on the server, never in React client code.']
    });
  }

  const compactJson = JSON.stringify(json).slice(0, 12000);

  const prompt = `You are reviewing a JSON/API payload for a software engineering team. Source: ${source}. Analyze this payload and return concise JSON with keys: summary, risks, recommendations. Payload: ${compactJson}`;

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: prompt
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed: ${response.status}`);
    }

    const result = await response.json();
    const text = result.output_text || result.output?.[0]?.content?.[0]?.text || 'No AI summary returned.';

    return res.status(200).json({ summary: text, risks: [], recommendations: [] });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'AI analysis failed' });
  }
}
