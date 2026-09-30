"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/lib/auth-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function RegisterForm() {
  const { register, isRegisterLoading, registerError, clearErrors } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("OWNER");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearErrors();

    if (!name || !email || !password || !role) {
      setValidationError("Please fill out all fields.");
      return;
    }

    try {
      await register({ name, email, password, role });
    } catch {
      // Error handled by AuthContext
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F7F9FC]">
      <div className="w-full max-w-[460px] bg-[#FFFFFF] border border-[#E2E8F0] rounded-[16px] p-8 shadow-sm">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-[12px] bg-[#2B6CB0] text-white font-bold text-xl mb-3 shadow-sm">
            GP
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#12283F]">
            Create Account
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Join GroundPulse to monitor and manage properties
          </p>
        </div>

        {/* Global / API Error */}
        {(registerError || validationError) && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-[8px] text-xs text-red-600">
            {validationError || registerError}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#12283F] uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#12283F] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="alex@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#12283F] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#12283F] uppercase tracking-wider mb-2">
              Select Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("OWNER")}
                className={`flex flex-col items-center justify-center p-3.5 rounded-[10px] border text-center transition-all ${
                  role === "OWNER"
                    ? "border-[#2B6CB0] bg-[#EBF8FF] text-[#2B6CB0] font-semibold ring-1 ring-[#2B6CB0]"
                    : "border-[#E2E8F0] bg-white text-[#12283F] hover:bg-[#F7F9FC]"
                }`}
              >
                <span className="text-sm">Property Owner</span>
                <span className="text-[11px] text-[#64748B] mt-0.5 font-normal">
                  Manage portfolio
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole("INSPECTOR")}
                className={`flex flex-col items-center justify-center p-3.5 rounded-[10px] border text-center transition-all ${
                  role === "INSPECTOR"
                    ? "border-[#2B6CB0] bg-[#EBF8FF] text-[#2B6CB0] font-semibold ring-1 ring-[#2B6CB0]"
                    : "border-[#E2E8F0] bg-white text-[#12283F] hover:bg-[#F7F9FC]"
                }`}
              >
                <span className="text-sm">Field Inspector</span>
                <span className="text-[11px] text-[#64748B] mt-0.5 font-normal">
                  Conduct field audits
                </span>
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-3"
            isLoading={isRegisterLoading}
          >
            Create Account & Continue
          </Button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-6 text-center text-xs text-[#64748B]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#2B6CB0] hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC] text-[#64748B] text-sm">
          Loading...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
