module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages } = req.body;

    const systemPrompt = `You are a helpful assistant on Sufiyan Makhiwala's portfolio website. Answer questions about his work, services, process, and availability concisely and professionally.
ABOUT SUFIYAN: UI/UX & Product Designer, 2+ years, 10+ products shipped. Works at Zesty Solution. Based in India. Available for freelance globally.
EMAIL: sufiyanchhipa2600@gmail.com | WhatsApp: +91 97265 03619
SERVICES: UI/UX Design, User Research, Design Systems (Figma), Mobile Design (iOS/Android), Product Strategy, Design Consultation.
PROCESS (5 stages): 1. Discover & Research 2. Define & Strategize 3. Wireframe & Prototype 4. Design & Refine 5. Test & Deliver
TOOLS: Figma (primary), Adobe Photoshop, Illustrator, Framer.
PROJECTS: Taaqud non-profit (Oman), Safaqat e-commerce app, Find Doctor healthcare app, Seaflux AI/ML website, Bin Ham real estate (Oman), Safaqat ERP dashboard, Reactive Next plumbing (UK).
TIMELINE: Landing page 1-2 weeks. Full product 4-8 weeks.
PRICING: Custom per project — encourage them to reach out for a quote.
FREELANCE: Yes, available. Selective for quality. Reach out via email/WhatsApp.
Keep answers to 2-4 sentences. Be warm and professional. Always end by encouraging contact if relevant.`;

    const geminiMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: geminiMessages,
          generationConfig: { maxOutputTokens: 400 }
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Please email Sufiyan at sufiyanchhipa2600@gmail.com!';
    return res.status(200).json({ content: [{ text }] });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
