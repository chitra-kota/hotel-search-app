export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { location } = req.body || {};
  if (!location || typeof location !== 'string') {
    return res.status(400).json({ error: 'Location is required' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY' });
  }

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: `You are a hotel data API. Return ONLY valid JSON — no markdown, no backticks, no explanation.
Return exactly: { "hotels": [ ... ] }
Each hotel must have:
- name (string)
- category (one of: "5-star luxury","4-star hotel","3-star hotel","budget hotel","resort","boutique hotel","heritage hotel","business hotel")
- rating (number 3.0-5.0)
- reviews (integer 80-4000)
- price_inr (integer: budget=800-2500, mid=2500-6000, luxury=6000-25000)
- address (realistic address in that city)
- open_now (true or false)
- amenities (array of 4-7: WiFi,Pool,Spa,Gym,Restaurant,Bar,Parking,AC,Room Service,Airport Shuttle,Pet Friendly,Beach Access,Conference Room,Rooftop,Breakfast,Laundry)
- description (one specific sentence about the hotel)
Return 8 varied hotels.`,
        messages: [{ role: 'user', content: 'Hotels in ' + location }]
      })
    });

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      return res.status(resp.status).json({ error: errData.error?.message || 'Anthropic API error' });
    }

    const data = await resp.json();
    const raw = (data.content || [])
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Internal server error' });
  }
}
