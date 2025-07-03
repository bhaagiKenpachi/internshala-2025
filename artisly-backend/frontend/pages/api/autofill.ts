// pages/api/autofill.ts

import { NextApiRequest, NextApiResponse } from 'next';
// Uncomment below if you want real OpenAI
// import OpenAI from 'openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Missing query' });
  }

  // --- 🧪 Option 1: Hardcoded / mock AI response ---
  if (q.toLowerCase().includes('punjabi') && q.toLowerCase().includes('coachella')) {
    return res.status(200).json({
      name: 'Diljit Dosanjh',
      category: 'Singer',
      country: 'India',
      instagramUrl: 'https://instagram.com/diljitdosanjh',
      fanbaseCount: 15000000,
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Diljit_Dosanjh_at_66th_Filmfare_Awards.jpg'
    });
  }

  // --- ✅ Option 2: Real OpenAI (Optional) ---
  /*
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{
      role: 'user',
      content: `Given this description: "${q}", return JSON with name, category, country, instagramUrl, fanbaseCount, thumbnailUrl.`
    }],
    temperature: 0.7
  });

  try {
    const jsonText = completion.choices[0].message?.content?.trim();
    const data = JSON.parse(jsonText);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'AI response could not be parsed' });
  }
  */

  // fallback
  return res.status(200).json({
    name: 'Unknown Celebrity',
    category: 'Unknown',
    country: 'Unknown',
    instagramUrl: '',
    fanbaseCount: 1000,
    thumbnailUrl: ''
  });
}
