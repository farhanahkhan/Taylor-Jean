"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Label from "@radix-ui/react-label";
import { AuthLayout } from "../Components/auth-layout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    sessionStorage.setItem("resetEmail", email);
    router.push("/forgot-password/otp");
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Forgot Password
          </h1>
          <p className="mt-1 text-muted-foreground">Please enter email below</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label.Root
                htmlFor="email"
                className="text-sm font-semibold text-foreground"
              >
                Email
              </Label.Root>
              <input
                id="email"
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 h-12 bg-muted rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all mt-[.3rem]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 flex items-center justify-center text-base font-semibold bg-dark-navy text-white hover:bg-dark-navy/90 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white mr-2" />
                  Processing...
                </>
              ) : (
                "Proceed"
              )}
            </button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
