export default async function handler(req, res) {
  // Allow requests from your portfolio domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: `You are a helpful assistant on Sufiyan Makhiwala's portfolio website. Answer questions about his work, services, process, and availability concisely and professionally.

ABOUT SUFIYAN: UI/UX & Product Designer, 2+ years, 10+ products shipped. Works at Zesty Solution. Based in India. Available for freelance globally.
EMAIL: sufiyanchhipa2600@gmail.com | WhatsApp: +91 97265 03619

SERVICES: UI/UX Design, User Research, Design Systems (Figma), Mobile Design (iOS/Android), Product Strategy, Design Consultation.

PROCESS (5 stages): 1. Discover & Research 2. Define & Strategize 3. Wireframe & Prototype 4. Design & Refine 5. Test & Deliver

TOOLS: Figma (primary), Adobe Photoshop, Illustrator, Framer.

PROJECTS: Taaqud non-profit (Oman), Safaqat e-commerce app, Find Doctor healthcare app, Seaflux AI/ML website, Bin Ham real estate (Oman), Safaqat ERP dashboard, Reactive Next plumbing (UK).

TIMELINE: Landing page 1-2 weeks. Full product 4-8 weeks.
PRICING: Custom per project — encourage them to reach out for a quote.
FREELANCE: Yes, available. Selective for quality. Reach out via email/WhatsApp.

Keep answers to 2-4 sentences. Be warm and professional. Always end by encouraging contact if relevant.`,
        messages,
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong', details: err.message });
  }
}
