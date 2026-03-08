import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: projectId } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { data, error } = await supabase
            .from('contract_features')
            .select('*')
            .eq('project_id', projectId)
            .eq('user_id', user.id)
            .order('sort_order', { ascending: true });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error(`Error in GET /api/projects/${projectId}/contract-features:`, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: projectId } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        // 배열 형식의 bulk insert 처리
        const features = Array.isArray(body) ? body : [body];

        const preparedFeatures = features.map(f => ({
            ...f,
            project_id: projectId,
            user_id: user.id
        }));

        const { data, error } = await supabase
            .from('contract_features')
            .insert(preparedFeatures)
            .select();

        if (error) throw error;

        return NextResponse.json(data, { status: 201 });
    } catch (error: any) {
        console.error(`Error in POST /api/projects/${projectId}/contract-features:`, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
