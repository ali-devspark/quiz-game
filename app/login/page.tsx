"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Mail, Lock, CheckCircle2, ArrowLeft } from "lucide-react";
import { login } from "@/app/actions/login";
import { useState } from "react";

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (formData: FormData) => {
        const result = await login(formData);
        if (result?.error) {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
            {/* Background purely decorative */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

            <Link
                href="/"
                className="absolute top-8 left-8 flex items-center gap-2 text-sm text-muted hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[480px] z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 mx-auto mb-6">
                        <Brain className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black mb-2">Organizer Login</h1>
                    <p className="text-muted">Welcome back! Manage your quizzes and tournaments.</p>
                </div>

                <div className="glass p-8 rounded-[32px] border border-white/5 shadow-2xl">
                    <form className="space-y-6" action={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm font-bold text-center">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold">Email Address</label>
                            </div>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5 group-focus-within:text-primary transition-colors" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="name@company.com"
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold">Password</label>
                                <Link href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5 group-focus-within:text-primary transition-colors" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-md border border-white/10 bg-slate-900/50 flex items-center justify-center cursor-pointer">
                                <CheckCircle2 className="w-4 h-4 text-primary hidden" />
                            </div>
                            <span className="text-sm text-muted">Keep me logged in</span>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all text-center"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 text-center">
                        <p className="text-sm text-muted italic">
                            &quot;The best quiz platform I&apos;ve ever used. Simple yet powerful.&quot;
                        </p>
                        <p className="text-xs font-bold mt-2 text-white/50">— Alex Rivers, Hosting Pro</p>
                    </div>
                </div>

                <p className="text-center mt-8 text-sm text-muted">
                    Don&apos;t have an account? <Link href="/register" className="text-primary font-bold hover:underline">Register now</Link>
                </p>
            </motion.div>
        </div>
    );
}
