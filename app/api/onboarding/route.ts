import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { OnboardingSurveyInsert } from '@/types/database';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { agencySize, hasGivenUpBilling } = body;

        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const surveyInsert: OnboardingSurveyInsert = {
            user_id: user.id,
            agency_size: agencySize,
            has_given_up_billing: hasGivenUpBilling
        };

        const { data, error } = await supabase
            .from('onboarding_surveys')
            .insert(surveyInsert)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error creating onboarding survey:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
