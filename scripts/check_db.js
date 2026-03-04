import 'dotenv/config';
// scripts/check_db.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase env vars missing');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const { data: requests, error: reqErr } = await supabase
        .from('requests')
        .select('*')
        .order('id', { ascending: false })
        .limit(1);
    if (reqErr) {
        console.error('Error fetching requests:', reqErr);
        return;
    }
    const { data: judgments, error: judErr } = await supabase
        .from('scope_judgments')
        .select('*')
        .order('id', { ascending: false })
        .limit(1);
    if (judErr) {
        console.error('Error fetching judgments:', judErr);
        return;
    }
    console.log(JSON.stringify({ latestRequest: requests?.[0] || null, latestJudgment: judgments?.[0] || null }, null, 2));
}

main();
