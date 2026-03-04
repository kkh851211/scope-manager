'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { LogOut, Trash2 } from 'lucide-react'

export default function SettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const [email, setEmail] = useState('')
    const [fullName, setFullName] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [userId, setUserId] = useState('')

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        async function loadProfile() {
            try {
                const { data: { user } } = await supabase.auth.getUser()

                if (!user) {
                    router.push('/login')
                    return
                }

                setUserId(user.id)
                setEmail(user.email || '')

                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('full_name, company_name')
                    .eq('id', user.id)
                    .single()

                if (error && error.code !== 'PGRST116') {
                    console.error(error)
                    toast.error('프로필 정보를 불러오는데 실패했습니다.')
                } else if (profile) {
                    setFullName(profile.full_name || '')
                    setCompanyName(profile.company_name || '')
                }
            } catch (error) {
                console.error('Error loading profile:', error)
            } finally {
                setLoading(false)
            }
        }

        loadProfile()
    }, [router, supabase])

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: userId,
                    email,
                    full_name: fullName,
                    company_name: companyName,
                    updated_at: new Date().toISOString(),
                })

            if (error) throw error
            toast.success('프로필이 성공적으로 저장되었습니다.')
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('프로필 저장 중 오류가 발생했습니다.')
        } finally {
            setSaving(false)
        }
    }

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
            router.push('/login')
            router.refresh()
        } catch (error) {
            console.error('Error signing out:', error)
            toast.error('로그아웃 중 오류가 발생했습니다.')
        }
    }

    const handleDeleteAccount = async () => {
        setDeleting(true)
        try {
            // Supabase Edge Functions or a separate API route is usually needed for deleting an account securely,
            // but for client-side testing, sometimes RPC or simply auth.admin is used (which is not available on client).
            // Here we assume there's an api route for it, or we handle the UI state.
            // We will try calling an API endpoint if it exists, otherwise just show a success message and logout.

            const response = await fetch('/api/auth/delete-account', {
                method: 'POST'
            })

            if (!response.ok) {
                throw new Error('계정 삭제 실패')
            }

            await supabase.auth.signOut()
            toast.success('계정이 성공적으로 삭제되었습니다.')
            router.push('/login')
            router.refresh()
        } catch (error) {
            console.error('Error deleting account:', error)
            toast.error('계정 삭제 중 시스템을 처리할 수 없습니다. 관리자에게 문의하세요.')
            setDeleting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center p-6">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 pt-6 pb-16">
            <div>
                <h3 className="text-2xl font-bold tracking-tight">설정</h3>
                <p className="text-sm text-muted-foreground mt-2">
                    계정 설정 및 프로필 정보를 관리합니다.
                </p>
            </div>

            <div className="grid gap-6 max-w-2xl">
                <Card>
                    <form onSubmit={handleUpdateProfile}>
                        <CardHeader>
                            <CardTitle>프로필 설정</CardTitle>
                            <CardDescription>
                                시스템에서 사용할 이름과 에이전시명을 설정합니다.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">이름</Label>
                                <Input
                                    id="fullName"
                                    placeholder="예: 홍길동"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="companyName">에이전시명</Label>
                                <Input
                                    id="companyName"
                                    placeholder="예: 스코프 에이전시"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={saving}>
                                {saving ? '저장 중...' : '저장'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>계정 설정</CardTitle>
                        <CardDescription>
                            계정 연동 정보 및 보안 관련 설정을 관리합니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>이메일</Label>
                            <Input
                                value={email}
                                disabled
                                className="bg-muted/50"
                            />
                        </div>

                        <div className="pt-4 space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
                            <Button
                                variant="outline"
                                onClick={handleSignOut}
                                className="w-full sm:w-auto"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                로그아웃
                            </Button>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="w-full sm:w-auto">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        회원 탈퇴
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>정말 탈퇴하시겠습니까?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            계정을 삭제하면 모든 프로젝트, 계약 정보 및 분석 결과가 영구적으로 삭제되며 복구할 수 없습니다. 계속하시겠습니까?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>취소</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDeleteAccount}
                                            disabled={deleting}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            {deleting ? '처리 중...' : '탈퇴하기'}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
