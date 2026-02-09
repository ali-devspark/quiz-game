"use server";

import { auth } from "@/auth";
import { db, quizzes, questions, choices } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createQuiz(formData: FormData) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!title) {
        throw new Error("Title is required");
    }

    const quizId = crypto.randomUUID();
    await db.insert(quizzes).values({
        id: quizId,
        title,
        description,
        authorId: userId,
        published: false,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/quizzes");
    redirect(`/dashboard/quizzes/${quizId}`);
}

export async function updateQuiz(quizId: string, data: { title?: string; description?: string; published?: boolean }) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        throw new Error("Unauthorized");
    }

    await db.update(quizzes)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(and(eq(quizzes.id, quizId), eq(quizzes.authorId, userId)));

    revalidatePath(`/dashboard/quizzes/${quizId}`);

    return await db.query.quizzes.findFirst({
        where: eq(quizzes.id, quizId),
    });
}

export async function deleteQuiz(quizId: string) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        throw new Error("Unauthorized");
    }

    await db.delete(quizzes)
        .where(and(eq(quizzes.id, quizId), eq(quizzes.authorId, userId)));

    revalidatePath("/dashboard/quizzes");
    redirect("/dashboard/quizzes");
}

export async function addQuestion(quizId: string, formData: FormData) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const text = formData.get("text") as string;

    if (!text) {
        throw new Error("Question text is required");
    }

    await db.transaction(async (tx) => {
        const questionId = crypto.randomUUID();
        await tx.insert(questions).values({
            id: questionId,
            text,
            quizId,
        });

        await tx.insert(choices).values([
            { id: crypto.randomUUID(), text: "Option 1", isCorrect: true, questionId: questionId },
            { id: crypto.randomUUID(), text: "Option 2", isCorrect: false, questionId: questionId },
        ]);
    });

    revalidatePath(`/dashboard/quizzes/${quizId}`);
}

export async function togglePublish(quizId: string) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const quiz = await db.query.quizzes.findFirst({
        where: and(eq(quizzes.id, quizId), eq(quizzes.authorId, userId))
    });

    if (!quiz) throw new Error("Quiz not found");

    await db.update(quizzes)
        .set({ published: !quiz.published, updatedAt: new Date() })
        .where(eq(quizzes.id, quizId));

    revalidatePath(`/dashboard/quizzes/${quizId}`);
    revalidatePath("/dashboard/quizzes");
    revalidatePath("/dashboard");
}
