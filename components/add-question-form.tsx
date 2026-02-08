"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { addQuestion } from "@/app/actions/quiz";

export function AddQuestionForm({ quizId }: { quizId: string }) {
    const [isPending, setIsPending] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        try {
            await addQuestion(quizId, formData);
            setIsOpen(false);
            (document.getElementById("add-question-form") as HTMLFormElement).reset();
        } catch (error) {
            console.error(error);
        } finally {
            setIsPending(false);
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full bg-white/5 hover:bg-white/10 border border-dashed border-white/10 rounded-[32px] py-8 flex items-center justify-center gap-2 font-bold transition-all mt-4"
            >
                <Plus className="w-5 h-5" /> Add New Question
            </button>
        );
    }

    return (
        <div className="bg-card border border-primary/50 rounded-[32px] p-8 mt-4 animate-in fade-in zoom-in duration-300">
            <h3 className="text-xl font-bold mb-6">New Question</h3>
            <form id="add-question-form" action={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="text" className="text-sm font-bold ml-1 text-muted">Question Text</label>
                    <input
                        id="text"
                        name="text"
                        type="text"
                        required
                        placeholder="e.g., What is the capital of France?"
                        className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 px-6 focus:outline-hidden focus:border-primary/50 transition-all"
                    />
                </div>

                <div className="flex gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-primary hover:bg-primary/90 px-8 py-3 rounded-xl font-bold shadow-xl shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Create Question
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="glass px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-all"
                    >
                        Cancel
                    </button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 italic">* This will create a question with two default options. You can edit them later.</p>
            </form>
        </div>
    );
}
