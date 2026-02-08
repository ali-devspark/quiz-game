import React from "react";
import { Sidebar } from "@/components/sidebar";
import { logout } from "@/app/actions/logout";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#020617] text-white flex">
            <Sidebar logoutAction={logout} />
            <main className="flex-1 flex flex-col min-h-screen overflow-auto">
                {children}
            </main>
        </div>
    );
}
