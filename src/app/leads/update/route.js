import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { id, status } = await request.json();

    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id);

    if (error) throw error;

    return Response.json({ success: true });
  } catch (err) {
    console.error('Failed to update lead:', err);
    return Response.json({ success: false }, { status: 500 });
  }
}