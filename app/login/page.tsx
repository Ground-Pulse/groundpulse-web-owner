"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const { login, isLoginLoading, loginError, clearErrors } = useAuth();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearErrors();

    if (!email || !password) {
      setValidationError("Please fill in both email and password.");
      return;
    }

    try {
      await login({ email, password });
    } catch {
      // Error handled by AuthContext
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F7F9FC]">
      <div className="w-full max-w-[420px] bg-[#FFFFFF] border border-[#E2E8F0] rounded-[16px] p-8 shadow-sm">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-[12px] bg-[#2B6CB0] text-white font-bold text-xl mb-3 shadow-sm">
            GP
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#12283F]">
            Welcome to GroundPulse
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Sign in to access your monitoring dashboard
          </p>
        </div>

        {/* Global / API Error */}
        {(loginError || validationError) && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-[8px] text-xs text-red-600">
            {validationError || loginError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#12283F] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#12283F] uppercase tracking-wider">
                Password
              </label>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            isLoading={isLoginLoading}
          >
            Sign In
          </Button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-6 text-center text-xs text-[#64748B]">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#2B6CB0] hover:underline"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC] text-[#64748B] text-sm">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
