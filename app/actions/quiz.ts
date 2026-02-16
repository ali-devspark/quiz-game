"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createQuiz(formData: FormData) {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!title) {
        throw new Error("Title is required");
    }

    const { data: quiz, error } = await supabase
        .from('quizzes')
        .insert({
            title,
            description,
            author_id: user.id,
            published: false,
        })
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/quizzes");
    redirect(`/dashboard/quizzes/${quiz.id}`);
}

export async function updateQuiz(quizId: string, data: { title?: string; description?: string; published?: boolean }) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const { data: quiz, error } = await supabase
        .from('quizzes')
        .update({
            ...data,
            updated_at: new Date().toISOString(),
        })
        .eq('id', quizId)
        .eq('author_id', user.id)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath(`/dashboard/quizzes/${quizId}`);

    return quiz;
}

export async function deleteQuiz(quizId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizId)
        .eq('author_id', user.id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/dashboard/quizzes");
    redirect("/dashboard/quizzes");
}

export async function addQuestion(quizId: string, formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const text = formData.get("text") as string;

    if (!text) {
        throw new Error("Question text is required");
    }

    // Verify ownership first
    const { data: quiz } = await supabase
        .from('quizzes')
        .select('id')
        .eq('id', quizId)
        .eq('author_id', user.id)
        .single();

    if (!quiz) throw new Error("Unauthorized");

    // Start inserting question
    const { data: question, error: questionError } = await supabase
        .from('questions')
        .insert({
            text,
            quiz_id: quizId,
        })
        .select()
        .single();

    if (questionError) {
        throw new Error(questionError.message);
    }

    // Insert choices
    const { error: choicesError } = await supabase
        .from('choices')
        .insert([
            { text: "Option 1", is_correct: true, question_id: question.id },
            { text: "Option 2", is_correct: false, question_id: question.id },
        ]);

    if (choicesError) {
        // In a real app we might want to revert the question insertion here
        throw new Error(choicesError.message);
    }

    revalidatePath(`/dashboard/quizzes/${quizId}`);
}

export async function togglePublish(quizId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    // First get current status
    const { data: quiz } = await supabase
        .from('quizzes')
        .select('published')
        .eq('id', quizId)
        .eq('author_id', user.id)
        .single();

    if (!quiz) throw new Error("Quiz not found");

    const { error } = await supabase
        .from('quizzes')
        .update({
            published: !quiz.published,
            updated_at: new Date().toISOString()
        })
        .eq('id', quizId);

    if (error) throw new Error(error.message);

    revalidatePath(`/dashboard/quizzes/${quizId}`);
    revalidatePath("/dashboard/quizzes");
    revalidatePath("/dashboard");
}
