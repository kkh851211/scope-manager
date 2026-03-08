import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ContractFeatureInsert } from '@/types/database';

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

        const { data: features, error } = await supabase
            .from('contract_features')
            .select('*')
            .eq('project_id', params.id)
            .eq('user_id', user.id)
            .order('sort_order', { ascending: true });

        if (error) throw error;

        return NextResponse.json(features || []);
    } catch (error: any) {
        console.error('Error fetching contract features:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const features = await request.json(); // Array of features
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!Array.isArray(features)) {
            return NextResponse.json({ error: 'Expected an array of features' }, { status: 400 });
        }

        const featuresToInsert: ContractFeatureInsert[] = features.map((f: any) => ({
            ...f,
            project_id: params.id,
            user_id: user.id
        }));

        const { data, error } = await supabase
            .from('contract_features')
            .insert(featuresToInsert)
            .select();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error creating contract features:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
