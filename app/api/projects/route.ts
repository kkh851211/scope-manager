import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');
    const clientName = searchParams.get('client_name');
    const status = searchParams.get('status');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const outOfScope = searchParams.get('out_of_scope') === 'true';

    try {
        let query = supabase
            .from('projects')
            .select(`
                *,
                requests (
                    id,
                    scope_judgments (
                        result
                    )
                )
            `)
            .eq('user_id', user.id);

        if (name) query = query.ilike('name', `%${name}%`);
        if (clientName) query = query.ilike('client_name', `%${clientName}%`);
        if (status && status !== '전체') {
            const statusMap: Record<string, 'active' | 'completed' | 'paused'> = {
                '진행중': 'active',
                '완료': 'completed',
                '보류': 'paused'
            };
            const mappedStatus = (statusMap[status] || status) as 'active' | 'completed' | 'paused';
            query = query.eq('status', mappedStatus);
        }
        if (startDate) query = query.gte('start_date', startDate);
        if (endDate) query = query.lte('end_date', endDate);

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        // out_of_scope 필터 적용 (클라이언트 사이드에서 할 수도 있지만 요청사항에 포함됨)
        let filteredData = data || [];
        if (outOfScope) {
            filteredData = filteredData.filter((p: any) => {
                const reqs = p.requests || [];
                return reqs.some((r: any) =>
                    r.scope_judgments?.some((j: any) => j.result === 'out_of_scope')
                );
            });
        }

        return NextResponse.json(filteredData);
    } catch (error: any) {
        console.error('Error in GET /api/projects:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { data, error } = await supabase
            .from('projects')
            .insert({
                ...body,
                user_id: user.id
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data, { status: 201 });
    } catch (error: any) {
        console.error('Error in POST /api/projects:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
