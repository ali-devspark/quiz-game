"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { register } from "@/app/actions/register";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
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
                    <h1 className="text-3xl font-black mb-2">Create Account</h1>
                    <p className="text-muted">Start hosting your first quiz in minutes.</p>
                </div>

                <div className="glass p-8 rounded-[32px] border border-white/5 shadow-2xl">
                    <form className="space-y-6" action={register}>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5 group-focus-within:text-primary transition-colors" />
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold ml-1">Email Address</label>
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
                            <label className="text-sm font-semibold ml-1">Password</label>
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

                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all text-center"
                        >
                            Sign Up
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-sm text-muted">
                    Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Login here</Link>
                </p>
            </motion.div>
        </div>
    );
}
