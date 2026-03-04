"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FolderKanban,
    History,
    Settings,
    LogOut,
    Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle
} from "@/components/ui/sheet";

const navItems = [
    { name: "대시보드", href: "/dashboard", icon: LayoutDashboard },
    { name: "프로젝트", href: "/projects", icon: FolderKanban },
    { name: "판단 히스토리", href: "/history", icon: History },
    { name: "설정", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <>
            {/* ── 데스크탑 사이드바 ── */}
            <aside className="hidden md:flex flex-col w-64 border-r bg-background px-4 py-6 h-screen sticky top-0">
                <div className="mb-8 px-2">
                    <h1 className="text-xl font-bold tracking-tight text-primary">스코프 매니저</h1>
                </div>
                <div className="flex-1 overflow-y-auto w-full">
                    <nav className="flex flex-col gap-2 w-full">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                                        ? "bg-primary text-primary-foreground font-medium"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <div className="mt-auto border-t pt-4 flex items-center justify-between w-full">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">유저 이름</span>
                        <span className="text-xs text-muted-foreground">user@example.com</span>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                        <LogOut className="h-5 w-5" />
                        <span className="sr-only">로그아웃</span>
                    </Button>
                </div>
            </aside>

            {/* ── 모바일 헤더 & 햄버거 메뉴 ── */}
            <div className="md:hidden flex items-center justify-between border-b bg-background px-4 py-3 sticky top-0 z-40">
                <h1 className="text-lg font-bold tracking-tight text-primary">스코프 매니저</h1>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">메뉴 열기</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col w-64 p-6">
                        <SheetTitle className="text-left mb-6 text-xl font-bold text-primary">스코프 매니저</SheetTitle>
                        <div className="flex-1 overflow-y-auto w-full">
                            <nav className="flex flex-col gap-2 w-full">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                                                    ? "bg-primary text-primary-foreground font-medium"
                                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span>{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                        <div className="mt-auto border-t pt-4 flex items-center justify-between w-full">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-foreground">유저 이름</span>
                                <span className="text-xs text-muted-foreground">user@example.com</span>
                            </div>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                <LogOut className="h-5 w-5" />
                                <span className="sr-only">로그아웃</span>
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
