import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
    let { data: users, error: userError } = await supabase.auth.admin.listUsers();

    let userId;
    if (users && users.users.length > 0) {
        userId = users.users[0].id;
    } else {
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email: 'test@example.com',
            password: 'password123',
            email_confirm: true
        });
        if (createError) {
            console.error('Error creating user:', createError); return;
        }
        userId = newUser.user.id;
    }

    console.log('User ID:', userId);

    const { data: project, error: insertError } = await supabase.from('projects').insert({
        name: 'test project',
        client_name: 'test client',
        status: 'active',
        user_id: userId
    }).select('id').single();

    if (insertError) {
        console.error('Error inserting project:', insertError);
        return;
    }
    console.log('Project ID:', project.id);
}

main();
