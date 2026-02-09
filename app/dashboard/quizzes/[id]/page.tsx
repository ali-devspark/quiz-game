import React, { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    ChevronLeft,
    FileText,
    Plus,
    Clock,
    Settings,
    Play,
    Share2,
    Trash2,
    CheckCircle2,
    Circle,
    Info
} from "lucide-react";
import { auth } from "@/auth";
import { db, quizzes as quizzesTable, questions as questionsTable } from "@/lib/db";
import { cn } from "@/lib/utils";
import { eq, and, asc } from "drizzle-orm";

import { AddQuestionForm } from "@/components/add-question-form";
import { PublishButton } from "@/components/publish-button";

async function QuestionsList({ quizId }: { quizId: string }) {
    const questions = await db.query.questions.findMany({
        where: eq(questionsTable.quizId, quizId),
        with: {
            choices: true,
        },
        orderBy: [asc(questionsTable.id)],
    });

    if (questions.length === 0) {
        return (
            <div className="space-y-6">
                <div className="bg-card/50 border border-dashed border-white/10 rounded-[32px] p-12 text-center">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                        <Plus className="text-muted w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">No Questions Yet</h3>
                    <p className="text-muted text-sm max-w-xs mx-auto mb-6">Start building your quiz by adding your first question.</p>
                </div>
                <AddQuestionForm quizId={quizId} />
            </div>
        );
    }

    return (
        <div className="space-y-6 text-white text-left">
            {questions.map((question, index) => (
                <div key={question.id} className="bg-card border border-border rounded-[32px] p-8 hover:border-white/10 transition-all">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-4">
                            <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center font-black text-sm">
                                {index + 1}
                            </span>
                            <h3 className="text-xl font-bold">{question.text}</h3>
                        </div>
                        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-muted hover:text-rose-500">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {question.choices.map((choice) => (
                            <div
                                key={choice.id}
                                className={cn(
                                    "p-4 rounded-2xl border flex items-center gap-3 transition-all",
                                    choice.isCorrect
                                        ? "bg-green-500/10 border-green-500/20 text-green-500"
                                        : "bg-slate-900/50 border-white/5 text-muted"
                                )}
                            >
                                {choice.isCorrect ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Circle className="w-4 h-4 shrink-0" />}
                                <span className="font-medium">{choice.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <AddQuestionForm quizId={quizId} />
        </div>
    );
}

export default async function QuizDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return null;

    const quiz = await db.query.quizzes.findFirst({
        where: and(eq(quizzesTable.id, id), eq(quizzesTable.authorId, userId)),
        with: {
            questions: true,
        },
    });

    if (!quiz) {
        notFound();
    }

    const questionCount = quiz.questions.length;

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <Link
                        href="/dashboard/quizzes"
                        className="flex items-center gap-2 text-muted hover:text-white transition-colors mb-4 group w-fit"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Quizzes
                    </Link>
                    <div className="flex items-center gap-4 mb-2">
                        <h1 className="text-4xl font-black">{quiz.title}</h1>
                        <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                            quiz.published ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                        )}>
                            {quiz.published ? 'Published' : 'Draft'}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-muted text-sm">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            Created on {new Date(quiz.createdAt).toLocaleDateString()}
                        </div>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <div className="flex items-center gap-1.5">
                            <FileText className="w-4 h-4" />
                            {questionCount} Questions
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none glass px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-white/5 transition-all text-sm">
                        <Share2 className="w-4 h-4" /> Share
                    </button>
                    <button className="flex-1 md:flex-none glass px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-white/5 transition-all text-sm">
                        <Settings className="w-4 h-4" /> Settings
                    </button>
                    <button className="flex-1 md:flex-none bg-primary hover:bg-primary/90 px-8 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-xl shadow-primary/20 transition-all">
                        <Play className="w-4 h-4 fill-current" /> Preview
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-card border border-border rounded-[40px] p-8 md:p-10">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-2xl font-black mb-1">Questions</h2>
                                <p className="text-muted text-sm">Design and manage your quiz content.</p>
                            </div>
                            <button className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-white/5">
                                Reorder
                            </button>
                        </div>

                        <Suspense fallback={<div className="text-center py-12 text-muted">Loading questions...</div>}>
                            <QuestionsList quizId={quiz.id} />
                        </Suspense>
                    </div>
                </div>

                <div className="space-y-8 text-white text-left">
                    <div className="bg-card border border-border rounded-[40px] p-8">
                        <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                            <Info className="w-5 h-5 text-primary" /> Quiz Details
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-black uppercase tracking-widest text-muted block mb-2">Description</label>
                                <p className="text-sm leading-relaxed text-slate-300">
                                    {quiz.description || "No description provided. Add one in settings to help players understand what this quiz is about."}
                                </p>
                            </div>
                            <div className="pt-6 border-t border-white/5 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted">Visibility</span>
                                    <span className="font-bold">{quiz.published ? 'Public' : 'Private'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted">Total Points</span>
                                    <span className="font-bold">{questionCount * 10} pts</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-pink-500">
                                    <span className="text-pink-500/60 transition-colors">Danger Zone</span>
                                    <button className="p-2 hover:bg-pink-500/10 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-linear-to-br from-indigo-600 to-purple-600 rounded-[40px] p-8 text-white shadow-xl shadow-indigo-600/10">
                        <h3 className="text-xl font-black mb-4">{quiz.published ? "Live & Ready" : "Ready to Go?"}</h3>
                        <p className="text-white/80 text-sm mb-6 leading-relaxed">
                            {quiz.published
                                ? "Your quiz is currently live. You can unpublish it anytime to make changes."
                                : "Once you've added all your questions, you can publish your quiz and start collecting responses."}
                        </p>
                        <PublishButton quizId={quiz.id} isPublished={quiz.published} />
                    </div>
                </div>
            </div>
        </div>
    );
}
