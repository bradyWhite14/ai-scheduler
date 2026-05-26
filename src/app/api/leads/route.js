import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return Response.json({ leads: data });
  } catch (err) {
    console.error('Failed to fetch leads:', err);
    return Response.json({ leads: [] });
  }
}