import React from 'react';
import { Sidebar } from '@/components/common/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-muted/40 flex-col md:flex-row">
            <Sidebar />
            <main className="flex-1 w-full overflow-y-auto">
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
