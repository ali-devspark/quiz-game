"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    Plus,
    MoreVertical,
    Users,
    Trophy,
    Clock,
    ExternalLink,
    Brain
} from "lucide-react";

const SidebarItem = ({ icon: Icon, label, active = false }: any) => (
    <Link
        href="#"
        className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
            active ? "bg-primary text-white shadow-lg shadow-primary/25" : "text-muted hover:bg-white/5 hover:text-white"
        )}
    >
        <Icon className="w-5 h-5" />
        {label}
    </Link>
);

const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-card border border-border p-6 rounded-3xl group hover:border-primary/50 transition-all">
        <div className="flex justify-between items-start mb-4">
            <div className={cn("p-3 rounded-2xl", color)}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <MoreVertical className="text-muted w-5 h-5 cursor-pointer" />
        </div>
        <div className="text-2xl font-black mb-1">{value}</div>
        <div className="text-sm text-muted font-medium">{label}</div>
    </div>
);

const QuizRow = ({ title, date, players, status }: any) => (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-lg">
                {title[0]}
            </div>
            <div>
                <div className="font-bold group-hover:text-primary transition-colors">{title}</div>
                <div className="text-xs text-muted flex items-center gap-2">
                    <Clock className="w-3 h-3" /> {date}
                </div>
            </div>
        </div>
        <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-2">
                <Users className="w-4 h-4 text-muted" />
                <span className="text-sm font-bold">{players}</span>
            </div>
            <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                status === 'Active' ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
            )}>
                {status}
            </span>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <ExternalLink className="w-4 h-4 text-muted" />
            </button>
        </div>
    </div>
);

// Helper for conditional classes since I can't import it in this snippet easily without full setup
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-white flex">
            {/* Sidebar */}
            <aside className="w-72 border-r border-white/5 p-6 hidden lg:flex flex-col">
                <div className="flex items-center gap-3 mb-12 px-2">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <Brain className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-black tracking-tight">QuizMaster</span>
                </div>

                <div className="space-y-2 flex-1">
                    <SidebarItem icon={LayoutDashboard} label="Overview" active />
                    <SidebarItem icon={FileText} label="My Quizzes" />
                    <SidebarItem icon={Trophy} label="Tournaments" />
                    <SidebarItem icon={Users} label="Participants" />
                    <SidebarItem icon={Settings} label="Settings" />
                </div>

                <div className="pt-6 border-t border-white/5">
                    <SidebarItem icon={LogOut} label="Log Out" />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-black mb-1">Welcome back, Mark! 👋</h1>
                        <p className="text-muted text-sm">Here's what's happening with your quizzes today.</p>
                    </div>
                    <button className="bg-primary hover:bg-primary/90 px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-xl shadow-primary/20 transition-all">
                        <Plus className="w-5 h-5" /> Create New Quiz
                    </button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard label="Total Quizzes" value="24" icon={FileText} color="bg-blue-600" />
                    <StatCard label="Active Players" value="1,284" icon={Users} color="bg-indigo-600" />
                    <StatCard label="Avg. Score" value="78%" icon={Trophy} color="bg-amber-600" />
                    <StatCard label="Total Hosting Time" value="142h" icon={Clock} color="bg-rose-600" />
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Main List */}
                    <div className="xl:col-span-2 bg-card border border-border p-8 rounded-[32px]">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-black">Recent Quizzes</h2>
                            <button className="text-primary text-sm font-bold hover:underline">View All</button>
                        </div>
                        <div className="space-y-2">
                            <QuizRow title="World Geography Pro" date="Oct 24, 2026" players="420" status="Active" />
                            <QuizRow title="Modern Web Stack 2026" date="Oct 22, 2026" players="890" status="Active" />
                            <QuizRow title="Classic Literature" date="Oct 18, 2026" players="120" status="Draft" />
                            <QuizRow title="JavaScript Ninja Challenge" date="Oct 15, 2026" players="1,200" status="Active" />
                            <QuizRow title="History of Space Tech" date="Oct 10, 2026" players="55" status="Draft" />
                        </div>
                    </div>

                    {/* Activity/Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-linear-to-br from-primary to-accent p-8 rounded-[32px] text-white overflow-hidden relative group">
                            <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform">
                                <Trophy size={140} />
                            </div>
                            <h3 className="text-2xl font-black mb-4 relative z-10">Upgrade to Pro</h3>
                            <p className="text-white/80 text-sm mb-6 relative z-10">Get unlimited players, advanced analytics, and custom branding for your quizzes.</p>
                            <button className="bg-white text-primary px-6 py-3 rounded-xl font-bold text-sm relative z-10 hover:shadow-lg transition-all">
                                Learn More
                            </button>
                        </div>

                        <div className="bg-card border border-border p-8 rounded-[32px]">
                            <h3 className="text-lg font-black mb-6">Upcoming Tournaments</h3>
                            <div className="space-y-6">
                                {[1, 2].map((i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-2 bg-primary rounded-full" />
                                        <div>
                                            <div className="font-bold text-sm uppercase">Cyber Trivia Night</div>
                                            <div className="text-xs text-muted mb-2">Tomorrow at 8:00 PM</div>
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map(j => (
                                                    <div key={j} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800" />
                                                ))}
                                                <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] font-bold">+12</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
