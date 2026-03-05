require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function testSignup() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase credentials in .env.local');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Testing Supabase signup with URL:', supabaseUrl);

    const { data, error } = await supabase.auth.signUp({
        email: 'test_node_script_signup@example.com',
        password: 'password123',
        options: {
            data: {
                full_name: 'Node Tester',
                company_name: 'Test Agency',
            },
        },
    });

    if (error) {
        console.error('\nSignup Error:', error.message);
        if (error.name) console.error('Error Name:', error.name);
        if (error.status) console.error('Error Status:', error.status);
        process.exit(1);
    } else {
        console.log('\nSignup Success!');
        console.log('User ID:', data.user?.id);
        console.log('Email:', data.user?.email);
        console.log('\nThe .env.local URL fix worked!');
    }
}

testSignup();
