// scripts/test_judge_scope.js
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Verify env vars
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Service Role Key present:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);


import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 (서비스 역할 키)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const payload = {
    projectId: 'test-123',
    contractContent: '메인 페이지, 회원가입/로그인, 게시판 CRUD 개발',
    clientRequest: '메인 페이지 슬라이드 배너 3개 추가해주세요',
    requesterName: '테스트 사용자',
};

async function main() {
    try {
        const res = await fetch('http://localhost:3000/api/judge-scope', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        console.log('Response:', JSON.stringify(data, null, 2));

        // ---------- 테스트용 DB 저장 ----------
        // 고정 사용자 ID 사용
        const userId = 'test-user';

        // 1️⃣ requests 테이블에 저장
        const { data: requestDef, error: requestError } = await supabase
            .from('requests')
            .insert({
                project_id: payload.projectId,
                user_id: userId,
                title: payload.clientRequest.substring(0, 50) + (payload.clientRequest.length > 50 ? '...' : ''),
                content: payload.clientRequest,
                requester_name: payload.requesterName || null,
                status: 'judged',
            })
            .select('id')
            .single();

        if (requestError) throw new Error(`Request insert error: ${requestError.message}`);

        const requestId = requestDef.id;

        // 2️⃣ scope_judgments 테이블에 저장
        const judgmentMap = {
            IN_SCOPE: 'in_scope',
            OUT_OF_SCOPE: 'out_of_scope',
            AMBIGUOUS: 'unclear',
        };
        const mappedResult = judgmentMap[data.data.judgment] || 'unclear';

        const { error: judgmentError } = await supabase
            .from('scope_judgments')
            .insert({
                request_id: requestId,
                user_id: userId,
                result: mappedResult,
                reasoning: data.data.reason,
                confidence_score: data.data.confidence,
                recommendation: data.data.suggestion,
                model_used: 'claude-sonnet-4-20250514',
            });

        if (judgmentError) throw new Error(`Judgment insert error: ${judgmentError.message}`);

        console.log('✅ DB 저장 완료 – request_id:', requestId);
    } catch (err) {
        console.error('Error:', err);
    }
}

main();
