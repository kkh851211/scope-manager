import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
    const { data: requests, error: reqErr } = await supabase
        .from('requests')
        .select('*')
        .eq('project_id', 'ff5062fc-9a6d-415e-9696-23d4c12103a3')
        .order('created_at', { ascending: false });

    const { data: judgments, error: judgErr } = await supabase
        .from('scope_judgments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    console.log('--- Requests ---');
    console.log(requests ? requests[0] : reqErr);

    console.log('\n--- Scope Judgments ---');
    console.log(judgments ? judgments[0] : judgErr);
}
main();
