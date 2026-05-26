import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are an AI receptionist for Brady's Detail Shop, a local car detailing business.

Services and pricing:
- Full Detail: $150 (interior + exterior, ~3 hours)
- Interior Only: $100 (~2 hours)
- Exterior Only: $60 (~1 hour)

Hours: Monday–Saturday, 8am–6pm. Closed Sunday.
Location: 123 Main St, Lawrenceburg, KY
Phone: (555) 123-4567

Your job:
1. Answer questions about services, pricing, and hours
2. Collect the customer's name, phone number, and preferred appointment time when they want to book
3. Once you have all three, confirm the request and let them know the shop will follow up

When you have collected all three pieces of info, end your message with exactly this on its own line:
LEAD_CAPTURED:{"name":"<name>","phone":"<phone>","time":"<time>"}

Rules:
- Keep responses short and friendly
- Never make up services or prices not listed above
- If you don't know something, direct them to call the shop
- Do not handle payments or guarantees
`;

export async function POST(request) {
  const { messages } = await request.json();

  const formatted = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.text,
  }));

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...formatted,
    ],
  });

  let reply = response.choices[0].message.content;

  // Check if lead was captured
  if (reply.includes('LEAD_CAPTURED:')) {
    const parts = reply.split('LEAD_CAPTURED:');
    reply = parts[0].trim();

    try {
      const leadData = JSON.parse(parts[1].trim());
      const lead = {
        ...leadData,
        timestamp: new Date().toISOString(),
      };

      const filePath = path.join(process.cwd(), 'data', 'leads.json');
      const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      existing.push(lead);
      fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

      console.log('Lead saved:', lead);
    } catch (err) {
      console.error('Failed to save lead:', err);
    }
  }

  return Response.json({ reply });
}