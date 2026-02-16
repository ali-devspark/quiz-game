"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Trophy, Users, Zap, ArrowRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLANS } from "@/lib/plans";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Brain className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">QuizMaster</span>
        </div>
        <div className="flex items-center gap-6">
          {user ? (
            <Link
              href="/dashboard"
              className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-full text-sm font-semibold transition-all shadow-lg shadow-primary/25"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                Organizer Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-full text-sm font-semibold transition-all shadow-lg shadow-primary/25"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all group"
  >
    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon className="text-primary w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-muted leading-relaxed">{description}</p>
  </motion.div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="hero-glow top-0 left-1/4" />
        <div className="hero-glow bottom-0 right-1/4" />

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1]">
              The Ultimate <br />
              <span className="gradient-text">Quiz Experience</span>
            </h1>
            <p className="text-xl text-muted max-w-2xl mx-auto mb-12 leading-relaxed">
              Create, manage, and host stunning general knowledge quizzes for your audience.
              The most powerful SaaS platform for interactive learning and competition.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-full text-lg font-bold transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-2"
              >
                Create a Quiz <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full text-lg font-bold transition-all border border-white/10 flex items-center justify-center gap-2">
                <Play className="w-5 h-5 fill-current" /> See in Action
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative px-4 w-full flex justify-center"
          >
            <div className="w-full max-w-5xl aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative bg-slate-900">
              <Image
                src="/assets/img/dashboard.png"
                alt="Dashboard Preview"
                fill
                className="object-cover block"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent pointer-events-none z-10" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="glass p-4 rounded-2xl flex items-center gap-4 animate-bounce">
                  <Trophy className="text-yellow-500 w-8 h-8" />
                  <div className="text-left">
                    <div className="text-sm font-bold">New Tournament</div>
                    <div className="text-xs text-muted">Join 1.2k players now</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-4">Powerful Features</h2>
            <p className="text-muted">Everything you need to run a professional quiz system.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Zap}
              title="Real-time Hosting"
              description="Host live sessions with instant updates and minimal latency for up to 10,000 players."
              delay={0.1}
            />
            <FeatureCard
              icon={Users}
              title="Team Management"
              description="Separate players into teams, assign captains, and track collective scores easily."
              delay={0.2}
            />
            <FeatureCard
              icon={Trophy}
              title="Pro Leaderboards"
              description="Dynamic rankings with historical data, streak trackers, and custom rewards."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-4">Transparent Pricing</h2>
            <p className="text-muted">Choose the plan that&apos;s right for your event.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(PLANS).map(([key, plan]) => (
              <div
                key={key}
                className={cn(
                  "p-8 rounded-[40px] border flex flex-col transition-all",
                  key === "PRO"
                    ? "bg-primary text-white border-primary shadow-2xl shadow-primary/20 scale-105 z-10"
                    : "bg-card border-border hover:border-primary/50"
                )}
              >
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black">{plan.price}</span>
                    <span className={cn("text-sm", key === "PRO" ? "text-white/70" : "text-muted")}>/month</span>
                  </div>
                  <p className={cn("mt-4 text-sm leading-relaxed", key === "PRO" ? "text-white/80" : "text-muted")}>
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm font-medium">
                      <Zap className={cn("w-4 h-4", key === "PRO" ? "text-white" : "text-primary")} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={cn(
                    "w-full py-4 rounded-2xl font-bold text-center transition-all",
                    key === "PRO"
                      ? "bg-white text-primary hover:bg-white/90"
                      : "bg-primary text-white hover:bg-primary/90"
                  )}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-border">
        <div className="text-center">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20 mb-8 inline-block">
            V1.0 IS NOW LIVE
          </span>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Brain className="text-primary w-6 h-6" />
            <span className="font-bold">QuizMaster SaaS</span>
          </div>
          <div className="text-muted text-sm text-center">
            © 2026 QuizMaster. All rights reserved. Premium Quiz Solutions.
          </div>
          <div className="flex gap-6">
            <Link href="#" className="text-muted hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="text-muted hover:text-white transition-colors">LinkedIn</Link>
            <Link href="#" className="text-muted hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
