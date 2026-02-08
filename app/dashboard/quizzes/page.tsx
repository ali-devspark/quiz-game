import React, { Suspense } from "react";
import Link from "next/link";
import {
    FileText,
    Plus,
    Clock,
    MoreVertical,
    ExternalLink,
    Search,
    Filter
} from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

const QuizCard = ({ quiz }: { quiz: any }) => (
    <div className="bg-card border border-border rounded-3xl p-6 hover:border-primary/50 transition-all group">
        <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/5">
                <FileText className="text-primary w-7 h-7" />
            </div>
            <div className="flex gap-2">
                <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                    quiz.published ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                )}>
                    {quiz.published ? 'Published' : 'Draft'}
                </span>
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-muted" />
                </button>
            </div>
        </div>

        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            <Link href={`/dashboard/quizzes/${quiz.id}`}>
                {quiz.title}
            </Link>
        </h3>
        <p className="text-muted text-sm line-clamp-2 mb-6 h-10">
            {quiz.description || "No description provided."}
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-muted">
                <Clock className="w-3 h-3" />
                {new Date(quiz.createdAt).toLocaleDateString()}
            </div>
            <Link
                href={`/dashboard/quizzes/${quiz.id}`}
                className="text-primary text-sm font-bold flex items-center gap-2 hover:underline"
            >
                View Details <ExternalLink className="w-3 h-3" />
            </Link>
        </div>
    </div>
);

async function QuizzesGrid({ userId }: { userId: string }) {
    const quizzes = await prisma.quiz.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { questions: true }
            }
        }
    });

    if (quizzes.length === 0) {
        return (
            <div className="col-span-full py-24 text-center">
                <div className="w-24 h-24 bg-slate-900 rounded-[32px] flex items-center justify-center mx-auto mb-6 border border-white/5">
                    <FileText className="text-muted w-12 h-12" />
                </div>
                <h2 className="text-2xl font-black mb-2">Build your first quiz</h2>
                <p className="text-muted max-w-md mx-auto mb-8">
                    Create engaging quizzes for your students, employees, or audience.
                    Manage everything from one place.
                </p>
                <Link
                    href="/dashboard/quizzes/create"
                    className="bg-primary hover:bg-primary/90 px-8 py-4 rounded-2xl inline-flex items-center gap-2 font-bold shadow-xl shadow-primary/20 transition-all"
                >
                    <Plus className="w-5 h-5" /> Start Creating
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
            ))}
        </div>
    );
}

export default async function QuizzesPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return null;

    return (
        <div className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2">My Quizzes</h1>
                    <p className="text-muted">Manage and monitor all your created quizzes.</p>
                </div>
                <Link
                    href="/dashboard/quizzes/create"
                    className="bg-primary hover:bg-primary/90 px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-xl shadow-primary/20 transition-all w-full md:w-auto"
                >
                    <Plus className="w-5 h-5" /> Create New Quiz
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search quizzes..."
                        className="w-full bg-card border border-border rounded-2xl py-3 pl-12 pr-4 focus:outline-hidden focus:border-primary/50 transition-all"
                    />
                </div>
                <button className="glass px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-white/5 transition-all text-sm">
                    <Filter className="w-4 h-4" /> All Quizzes
                </button>
            </div>

            <Suspense fallback={<div className="text-center py-24 text-muted">Loading your quizzes...</div>}>
                <QuizzesGrid userId={userId} />
            </Suspense>
        </div>
    );
}
