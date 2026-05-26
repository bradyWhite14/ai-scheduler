import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function buildSystemPrompt() {
  const today = new Date();
  const todayLong = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
You are an AI receptionist for Brady's Detail Shop, a local car detailing business.
Today's date is ${todayLong}.

Services and pricing:
- Full Detail: $150 (interior + exterior, ~3 hours)
- Interior Only: $100 (~2 hours)
- Exterior Only: $60 (~1 hour)

Hours: Monday–Saturday, 8am–6pm. Closed Sunday.
Location: 123 Main St, Lawrenceburg, KY
Phone: (555) 123-4567

Your job:
1. Answer questions about services, pricing, and hours
2. Collect the customer's name, phone number, preferred service, and preferred appointment time when they want to book
3. Once you have all four, confirm the request

IMPORTANT — resolving appointment times:
Always convert relative dates to the actual calendar date before storing them.
Today is ${todayLong}. Use this as the reference when the customer says things like:
- "tomorrow" → calculate the actual date (e.g. "Tuesday, May 27, 2026")
- "next Monday" → find the next Monday on the calendar
- "this Friday" → find the upcoming Friday
Store the resolved date in full form, e.g. "Tuesday, May 27, 2026 at 9:00 AM".

When you have collected all three pieces of info (name, phone, appointment time), end your message with exactly this on its own line:
LEAD_CAPTURED:{"name":"<name>","phone":"<phone>","service":"<service>","time":"<resolved full date and time>"}

Rules:
- Keep responses short and friendly
- Never make up services or prices not listed above
- If you don't know something, direct them to call the shop
- Do not handle payments or guarantees
`.trim();
}

export async function POST(request) {
  try {
    const { messages } = await request.json();

    const formatted = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.text,
    }));

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        ...formatted,
      ],
    });

    let reply = response.choices[0].message.content;

    if (reply.includes('LEAD_CAPTURED:')) {
      const parts = reply.split('LEAD_CAPTURED:');
      reply = parts[0].trim();

      try {
        const leadData = JSON.parse(parts[1].trim());
        await supabase.from('leads').insert([
  { name: leadData.name, phone: leadData.phone, service: leadData.service, time: leadData.time },
]);
      } catch {
        // Lead save failed — chat still continues normally
      }
    }

    return Response.json({ reply });
  } catch {
    return Response.json(
      { reply: 'Sorry, something went wrong on our end. Please call us at (555) 123-4567.' },
      { status: 500 }
    );
  }
}
