import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ reportId: string }> }
) {
    const { reportId } = await params;
    const supabase = await createClient();

    try {
        // 공개된 리포트만 조회 가능 (RLS에서도 처리되지만 명시적으로 체크)
        const { data: report, error } = await supabase
            .from('reports')
            .select('*')
            .eq('id', reportId)
            .eq('is_public', true)
            .single();

        if (error || !report) {
            return NextResponse.json({ error: 'Report not found or not public' }, { status: 404 });
        }

        return NextResponse.json(report);
    } catch (error: any) {
        console.error('Error in GET /api/reports/[id]:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
