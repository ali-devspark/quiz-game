"use server";

import bcrypt from "bcryptjs";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function register(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password || !name) {
        throw new Error("Missing fields");
    }

    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
        id: crypto.randomUUID(),
        name,
        email,
        password: hashedPassword,
        plan: "FREE",
    });

    redirect("/login");
}
