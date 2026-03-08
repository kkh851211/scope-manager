import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ProjectInsert } from '@/types/database';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || 'ALL';
        const showExceededOnly = searchParams.get('showExceededOnly') === 'true';
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        const supabase = await createClient();
        console.log('API: GET /api/projects - Supabase client created');

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
            console.error('API: GET /api/projects - Session error:', sessionError);
            return NextResponse.json({ error: 'Auth session error' }, { status: 401 });
        }

        const user = session?.user;
        console.log('API: GET /api/projects - User:', user?.id || 'No user');

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let query = supabase
            .from('projects')
            .select('*')
            .eq('user_id', user.id);

        if (search) {
            query = query.or(`name.ilike.%${search}%,client_name.ilike.%${search}%`);
        }

        if (status !== 'ALL') {
            query = query.eq('status', status.toLowerCase());
        }

        if (startDate) {
            query = query.gte('created_at', startDate);
        }

        if (endDate) {
            query = query.lte('created_at', endDate);
        }

        const { data: projects, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        // Note: 'showExceededOnly' logic might need a join or additional logic once calculation is implemented
        let filteredProjects = projects || [];
        if (showExceededOnly) {
            // For now, mockup calculation or placeholder
            // In real app, we might compare contract_amount with total additional requests or features
        }

        return NextResponse.json(filteredProjects);
    } catch (error: any) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, clientName, description, startDate, endDate, contractAmount, aiEstimatedAmount, aiEstimatedDays } = body;

        const supabase = await createClient();
        console.log('API: POST /api/projects - Supabase client created');

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
            console.error('API: POST /api/projects - Session error:', sessionError);
            return NextResponse.json({ error: 'Auth session error' }, { status: 401 });
        }

        const user = session?.user;
        console.log('API: POST /api/projects - User:', user?.id || 'No user');

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const projectInsert: ProjectInsert = {
            user_id: user.id,
            name,
            client_name: clientName,
            description,
            start_date: startDate,
            end_date: endDate,
            contract_amount: contractAmount,
            ai_estimated_amount: aiEstimatedAmount,
            ai_estimated_days: aiEstimatedDays,
            status: 'active'
        };

        const { data: project, error } = await supabase
            .from('projects')
            .insert(projectInsert)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(project);
    } catch (error: any) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
