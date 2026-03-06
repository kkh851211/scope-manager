import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, clientName, contractScope } = body

        if (!name || !clientName || !contractScope) {
            return NextResponse.json(
                { error: 'Missing required fields: name, clientName, contractScope' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // 실제 로그인한 유저 세션에서 user_id 가져오기
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: '로그인이 필요합니다.' },
                { status: 401 }
            )
        }

        const userId = user.id

        // 1. projects 테이블에 프로젝트 저장
        const { data: projectData, error: projError } = await supabase
            .from('projects')
            .insert({
                name,
                client_name: clientName,
                status: 'active',
                user_id: userId
            })
            .select('id')
            .single()

        if (projError) {
            throw new Error(`프로젝트 저장 실패: ${projError.message}`)
        }

        const projectId = projectData.id

        // 2. contracts 테이블에 계약 범위 저장
        const { error: contractError } = await supabase
            .from('contracts')
            .insert({
                project_id: projectId,
                title: `${name} 초기 계약서`,
                content: contractScope,
                user_id: userId
            })

        if (contractError) {
            // Optional: You could rollback the project creation here
            throw new Error(`계약 내용 저장 실패: ${contractError.message}`)
        }

        return NextResponse.json({
            success: true,
            data: { projectId }
        })

    } catch (error: any) {
        console.error('Error creating project:', error)

        return NextResponse.json(
            { error: error?.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}
