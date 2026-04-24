module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { json, source = 'Untitled JSON' } = req.body || {};

  if (!json) {
    return res.status(400).json({ error: 'Missing json payload' });
  }

  const metrics = summarizeJson(json);
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      summary: `AI analysis is not configured yet, but Graph LM Pro analyzed ${source}. This payload contains ${metrics.totalNodes} total nodes, ${metrics.objects} objects, ${metrics.arrays} arrays, ${metrics.nulls} null values, and reaches a max depth of ${metrics.maxDepth}. Add OPENAI_API_KEY in Vercel Environment Variables to enable full AI summaries.`,
      risks: [],
      recommendations: [
        'Configure OPENAI_API_KEY in Vercel if you want real AI summaries.',
        'Keep API keys on the server, never inside React client code.'
      ]
    });
  }

  const compactJson = JSON.stringify(json).slice(0, 12000);
  const prompt = `You are reviewing a JSON/API payload for a software engineering team. Source: ${source}. Analyze this payload and return a concise developer-facing summary with likely risks and recommendations. Payload: ${compactJson}`;

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
      const text = await response.text();
      throw new Error(`OpenAI request failed: ${response.status} ${text}`);
    }

    const result = await response.json();
    const text = result.output_text || result.output?.[0]?.content?.[0]?.text || 'No AI summary returned.';
    return res.status(200).json({ summary: text, risks: [], recommendations: [] });
  } catch (error) {
    return res.status(200).json({
      summary: `Graph LM Pro completed local analysis, but AI analysis failed: ${error.message}. Metrics: ${metrics.totalNodes} nodes, ${metrics.objects} objects, ${metrics.arrays} arrays, max depth ${metrics.maxDepth}.`,
      risks: ['AI provider request failed.'],
      recommendations: ['Check the OPENAI_API_KEY value and Vercel function logs.']
    });
  }
};

function summarizeJson(value) {
  const metrics = { totalNodes: 0, objects: 0, arrays: 0, primitives: 0, nulls: 0, maxDepth: 0 };

  function walk(node, depth) {
    metrics.totalNodes += 1;
    metrics.maxDepth = Math.max(metrics.maxDepth, depth);

    if (node === null) {
      metrics.nulls += 1;
      metrics.primitives += 1;
      return;
    }

    if (Array.isArray(node)) {
      metrics.arrays += 1;
      node.forEach((item) => walk(item, depth + 1));
      return;
    }

    if (typeof node === 'object') {
      metrics.objects += 1;
      Object.values(node).forEach((child) => walk(child, depth + 1));
      return;
    }

    metrics.primitives += 1;
  }

  walk(value, 1);
  return metrics;
}
