import { NextRequest, NextResponse } from 'next/server';
import { ParsedExpense, parseExpenseWithOpenAI } from '../../../lib/expenseParser';
import { createServerClient } from '@supabase/ssr';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid text' }, { status: 400 });
    }

    // Get authenticated user from Supabase session
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: req.cookies }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const user_id = user.id;

    // Call OpenAI to parse the expense
    const parsed: ParsedExpense = await parseExpenseWithOpenAI(text);

    // Validate required fields
    if (!parsed.amount || !parsed.currency || !parsed.vendor) {
      return NextResponse.json({ error: 'Parsing failed or missing required fields' }, { status: 422 });
    }

    // Persist to Supabase/Postgres
    const { data, error } = await supabase.from('expenses').insert([
      {
        user_id,
        amount: parsed.amount,
        currency: parsed.currency,
        vendor: parsed.vendor,
        category: parsed.category || null,
        occurred_at: parsed.occurred_at || new Date().toISOString(),
        parsed_source: text,
        description: parsed.description || null,
      },
    ]).select().single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ expense: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
} 