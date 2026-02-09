"use strict";

"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
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

    const quiz = await prisma.quiz.create({
        data: {
            title,
            description,
            authorId: userId,
            published: false,
        }
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/quizzes");
    redirect(`/dashboard/quizzes/${quiz.id}`);
}

export async function updateQuiz(quizId: string, data: { title?: string; description?: string; published?: boolean }) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const quiz = await prisma.quiz.update({
        where: { id: quizId, authorId: userId },
        data: {
            ...data
        }
    });

    revalidatePath(`/dashboard/quizzes/${quizId}`);
    return quiz;
}

export async function deleteQuiz(quizId: string) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        throw new Error("Unauthorized");
    }

    await prisma.quiz.delete({
        where: { id: quizId, authorId: userId }
    });

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

    // Basic implementation: adds a question with 2 placeholders
    await prisma.question.create({
        data: {
            text,
            quizId,
            choices: {
                create: [
                    { text: "Option 1", isCorrect: true },
                    { text: "Option 2", isCorrect: false },
                ]
            }
        }
    });

    revalidatePath(`/dashboard/quizzes/${quizId}`);
}

export async function togglePublish(quizId: string) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const quiz = await prisma.quiz.findUnique({
        where: { id: quizId, authorId: userId }
    });

    if (!quiz) throw new Error("Quiz not found");

    await prisma.quiz.update({
        where: { id: quizId },
        data: { published: !quiz.published }
    });

    revalidatePath(`/dashboard/quizzes/${quizId}`);
    revalidatePath("/dashboard/quizzes");
    revalidatePath("/dashboard");
}
