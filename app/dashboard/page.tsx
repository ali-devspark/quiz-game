import React, { Suspense } from "react";
import Link from "next/link";
import {
    FileText,
    Plus,
    Users,
    Trophy,
    Clock,
    Zap,
    ExternalLink
} from "lucide-react";
import { auth } from "@/auth";
import { PLANS, PlanType } from "@/lib/plans";
import { cn } from "@/lib/utils";
import { db, quizzes as quizzesTable } from "@/lib/db";
import { eq, desc, count } from "drizzle-orm";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    color: string;
}

const StatCard = ({ label, value, icon: Icon, color }: StatCardProps) => (
    <div className="bg-card border border-border p-6 rounded-3xl group hover:border-primary/50 transition-all">
        <div className="flex justify-between items-start mb-4">
            <div className={cn("p-3 rounded-2xl", color)}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
        <div className="text-2xl font-black mb-1">{value}</div>
        <div className="text-sm text-muted font-medium">{label}</div>
    </div>
);

interface QuizRowProps {
    id: string;
    title: string;
    date: Date;
    status: boolean;
}

const QuizRow = ({ id, title, date, status }: QuizRowProps) => (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-lg">
                {title[0]}
            </div>
            <div>
                <Link href={`/dashboard/quizzes/${id}`} className="font-bold group-hover:text-primary transition-colors cursor-pointer">
                    {title}
                </Link>
                <div className="text-xs text-muted flex items-center gap-2">
                    <Clock className="w-3 h-3" /> {new Date(date).toLocaleDateString()}
                </div>
            </div>
        </div>
        <div className="flex items-center gap-8">
            <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                status ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
            )}>
                {status ? 'Published' : 'Draft'}
            </span>
            <Link href={`/dashboard/quizzes/${id}`} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <ExternalLink className="w-4 h-4 text-muted" />
            </Link>
        </div>
    </div>
);

async function QuizList({ userId }: { userId: string }) {
    const quizzes = await db.query.quizzes.findMany({
        where: eq(quizzesTable.authorId, userId),
        orderBy: [desc(quizzesTable.createdAt)],
        limit: 5
    });

    if (quizzes.length === 0) {
        return (
            <div className="space-y-4 text-center py-12">
                <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                    <FileText className="text-muted w-10 h-10" />
                </div>
                <h3 className="font-bold text-lg">No Quizzes Yet</h3>
                <p className="text-muted text-sm max-w-xs mx-auto">Create your first quiz and start hosting tournaments for your audience.</p>
                <Link href="/dashboard/quizzes/create" className="mt-6 text-primary font-bold hover:underline flex items-center gap-2 mx-auto justify-center">
                    <Plus className="w-4 h-4" /> Create your first quiz
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {quizzes.map((quiz: any) => (
                <QuizRow
                    key={quiz.id}
                    id={quiz.id}
                    title={quiz.title}
                    date={quiz.createdAt}
                    status={quiz.published}
                />
            ))}
        </div>
    );
}

export default async function DashboardPage() {
    const session = await auth();
    const userId = session?.user?.id;
    const userName = session?.user?.name || "Organizer";
    const userPlan = (session?.user as { plan?: PlanType })?.plan || "FREE";
    const currentPlan = PLANS[userPlan];

    if (!userId) return null;

    const [{ count: quizCount }] = await db
        .select({ count: count() })
        .from(quizzesTable)
        .where(eq(quizzesTable.authorId, userId));

    return (
        <main className="flex-1 p-6 md:p-10 overflow-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-black mb-1">Welcome back, {userName}! 👋</h1>
                    <div className="flex items-center gap-2">
                        <p className="text-muted text-sm">Here&apos;s what&apos;s happening with your quizzes today.</p>
                        <span className="px-2 py-0.5 rounded-md bg-primary/20 text-primary text-[10px] font-black uppercase tracking-wider border border-primary/30">
                            {currentPlan.name} Plan
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none glass px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-white/5 transition-all">
                        <Zap className="w-4 h-4 text-amber-500" /> Upgrade
                    </button>
                    <Link href="/dashboard/quizzes/create" className="flex-1 md:flex-none bg-primary hover:bg-primary/90 px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-xl shadow-primary/20 transition-all">
                        <Plus className="w-5 h-5" /> Create Quiz
                    </Link>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard label="Total Quizzes" value={quizCount.toString()} icon={FileText} color="bg-blue-600" />
                <StatCard label="Active Players" value="0" icon={Users} color="bg-indigo-600" />
                <StatCard label="Avg. Score" value="0%" icon={Trophy} color="bg-amber-600" />
                <StatCard label="Limit Used" value={`${quizCount}/${currentPlan.limits.maxQuizzes}`} icon={Clock} color="bg-rose-600" />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 bg-card border border-border p-8 rounded-[32px]">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-black">Recent Quizzes</h2>
                        <Link href="/dashboard/quizzes" className="text-primary text-sm font-bold hover:underline">View All</Link>
                    </div>

                    <Suspense fallback={<div className="text-center py-12 text-muted">Loading quizzes...</div>}>
                        <QuizList userId={userId} />
                    </Suspense>
                </div>

                <div className="space-y-8">
                    {userPlan === "FREE" && (
                        <div className="bg-linear-to-br from-primary to-accent p-8 rounded-[32px] text-white overflow-hidden relative group">
                            <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform">
                                <Trophy size={140} />
                            </div>
                            <h3 className="text-2xl font-black mb-4 relative z-10">Upgrade to Pro</h3>
                            <p className="text-white/80 text-sm mb-6 relative z-10">Get up to 20 quizzes, 500 participants, and advanced analytics for your tournaments.</p>
                            <button className="bg-white text-primary px-6 py-3 rounded-xl font-bold text-sm relative z-10 hover:shadow-lg transition-all">
                                See Plans
                            </button>
                        </div>
                    )}

                    <div className="bg-card border border-border p-8 rounded-[32px]">
                        <h3 className="text-lg font-black mb-6">Plan Features</h3>
                        <ul className="space-y-4">
                            {currentPlan.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-muted">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
}
