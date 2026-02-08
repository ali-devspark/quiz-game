"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    LogOut,
    Brain,
    Trophy,
    Users,
    Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const SidebarItem = ({ icon: Icon, label, href }: { icon: any, label: string, href: string }) => {
    const pathname = usePathname();
    const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                active ? "bg-primary text-white shadow-lg shadow-primary/25" : "text-muted hover:bg-white/5 hover:text-white"
            )}
        >
            <Icon className="w-5 h-5" />
            {label}
        </Link>
    );
};

export function Sidebar({ logoutAction }: { logoutAction: () => void }) {
    return (
        <aside className="w-72 border-r border-white/5 p-6 hidden lg:flex flex-col h-screen sticky top-0">
            <div className="flex items-center gap-3 mb-12 px-2">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <Brain className="text-white w-6 h-6" />
                </div>
                <span className="text-xl font-black tracking-tight">QuizMaster</span>
            </div>

            <div className="space-y-2 flex-1">
                <SidebarItem icon={LayoutDashboard} label="Overview" href="/dashboard" />
                <SidebarItem icon={FileText} label="My Quizzes" href="/dashboard/quizzes" />
            </div>

            <div className="pt-6 border-t border-white/5">
                <form action={logoutAction}>
                    <button className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-muted hover:bg-white/5 hover:text-white w-full text-left">
                        <LogOut className="w-5 h-5" />
                        Log Out
                    </button>
                </form>
            </div>
        </aside>
    );
}
