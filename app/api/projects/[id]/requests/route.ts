import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { RequestInsert } from '@/types/database';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: requests, error } = await supabase
            .from('requests')
            .select('*, scope_judgments(*)')
            .eq('project_id', params.id)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(requests || []);
    } catch (error: any) {
        console.error('Error fetching requests:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const requestInsert: RequestInsert = {
            ...body,
            project_id: params.id,
            user_id: user.id,
            status: body.status || 'pending'
        };

        const { data, error } = await supabase
            .from('requests')
            .insert(requestInsert)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error creating request:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
