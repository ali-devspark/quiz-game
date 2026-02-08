"use client";

import { useTransition } from "react";
import { togglePublish } from "@/app/actions/quiz";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function PublishButton({ quizId, isPublished }: { quizId: string, isPublished: boolean }) {
    const [isPending, startTransition] = useTransition();

    return (
        <form action={() => startTransition(() => togglePublish(quizId))}>
            <button
                type="submit"
                disabled={isPending}
                className={cn(
                    "w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2",
                    isPublished
                        ? "bg-slate-800 text-white hover:bg-slate-700"
                        : "bg-white text-indigo-600 hover:shadow-lg"
                )}
            >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {isPublished ? "Unpublish Quiz" : "Publish Quiz"}
            </button>
        </form>
    );
}
