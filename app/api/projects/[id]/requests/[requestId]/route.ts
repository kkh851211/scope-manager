import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; requestId: string }> }
) {
    const { id: projectId, requestId } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { data, error } = await supabase
            .from('requests')
            .select(`
                *,
                scope_judgments (*)
            `)
            .eq('id', requestId)
            .eq('project_id', projectId)
            .eq('user_id', user.id)
            .single();

        if (error) throw error;
        if (!data) return NextResponse.json({ error: 'Request not found' }, { status: 404 });

        return NextResponse.json(data);
    } catch (error: any) {
        console.error(`Error in GET /api/projects/${projectId}/requests/${requestId}:`, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; requestId: string }> }
) {
    const { id: projectId, requestId } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, content, status } = body;

        const { data, error } = await supabase
            .from('requests')
            .update({
                ...(title && { title }),
                ...(content && { content }),
                ...(status && { status }),
            })
            .eq('id', requestId)
            .eq('project_id', projectId)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error(`Error in PATCH /api/projects/${projectId}/requests/${requestId}:`, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
