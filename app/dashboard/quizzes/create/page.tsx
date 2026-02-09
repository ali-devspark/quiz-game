import React from "react";
import Link from "next/link";
import { ChevronLeft, Brain, Sparkles } from "lucide-react";
import { createQuiz } from "@/app/actions/quiz";

export default function CreateQuizPage() {
    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto">
            <Link
                href="/dashboard/quizzes"
                className="flex items-center gap-2 text-muted hover:text-white transition-colors mb-8 group w-fit"
            >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Quizzes
            </Link>

            <div className="bg-card border border-border rounded-[40px] p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Brain size={200} className="text-primary" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                            <Sparkles className="text-primary w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-black">Create New Quiz</h1>
                    </div>

                    <p className="text-muted mb-10 max-w-lg">
                        Give your quiz a compelling title and description. You&apos;ll be able to add questions and customize settings on the next step.
                    </p>

                    <form action={createQuiz} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="title" className="text-sm font-bold ml-1">Quiz Title</label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    required
                                    placeholder="e.g., General Knowledge Blast"
                                    className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 px-6 focus:outline-hidden focus:border-primary/50 transition-all text-lg font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="description" className="text-sm font-bold ml-1">Description (Optional)</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    placeholder="Briefly describe what this quiz is about..."
                                    className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 px-6 focus:outline-hidden focus:border-primary/50 transition-all resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-white/5">
                            <button
                                type="submit"
                                className="bg-primary hover:bg-primary/90 px-10 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 transition-all flex-1 md:flex-none"
                            >
                                Continue to Questions
                            </button>
                            <Link
                                href="/dashboard/quizzes"
                                className="glass px-10 py-4 rounded-2xl font-black hover:bg-white/5 transition-all text-center flex-1 md:flex-none"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
