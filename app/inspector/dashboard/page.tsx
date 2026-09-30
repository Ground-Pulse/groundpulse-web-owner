"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function InspectorDashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "INSPECTOR") {
        router.push("/owner/dashboard");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC] text-[#64748B] text-sm">
        Loading session...
      </div>
    );
  }

  const displayName = user?.name || user?.email || "User";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F7F9FC]">
      <div className="w-full max-w-[480px] bg-[#FFFFFF] border border-[#E2E8F0] rounded-[16px] p-8 text-center shadow-sm">
        <div className="inline-flex items-center justify-center px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold mb-4 tracking-wide uppercase">
          Inspector Portal
        </div>
        
        <h1 className="text-xl font-bold text-[#12283F] mb-2">
          Logged in as {displayName} — role: INSPECTOR
        </h1>
        
        <p className="text-xs text-[#64748B] mb-6">
          Authenticated placeholder shell for field inspection workflows.
        </p>

        <Button
          variant="outline"
          onClick={logout}
          className="text-xs font-semibold px-4 py-2"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
