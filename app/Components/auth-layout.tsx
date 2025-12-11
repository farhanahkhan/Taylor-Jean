"use client";

import Image from "next/image";
import type React from "react";
import taylorjean from "@/public/taylorjean.png";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Form area */}
      <div className="flex-3 bg-[#faf8f5] flex flex-col">
        {/* Logo */}
        <div className="flex justify-center lg:justify-start px-6 lg:px-12 pt-8 lg:pt-12">
          <div className="flex flex-col items-center lg:items-start">
            <Image
              //   src="/images/whatsapp-20image-202025-12-04-20at-2010.jpeg"
              src={taylorjean}
              alt="Taylor Jean Sport Fishing"
              className="h-24 lg:h-24 object-contain"
            />
          </div>
        </div>

        {/* Form content */}
        <div className="flex-1/2 flex items-start lg:pt-[5rem] justify-center px-6 lg:px-12 py-8">
          <div className="w-full max-w-md">{children}</div>
        </div>

        {/* Bottom link */}
        {/* <div className="text-center pb-6 lg:pb-8">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="font-semibold text-accent hover:text-accent/80 transition-colors"
            >
              Sign up for free
            </a>
          </p>
        </div> */}
      </div>

      {/* Right side - Testimonial panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/80 to-primary/80 relative overflow-hidden rounded-tl-[70px] rounded-bl-[70px]">
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <div className="flex items-center gap-2.5">
            <Image
              src="/elegant-tj-monogram-logo-white.jpg"
              alt="Taylor Jean logo"
              width={36}
              height={36}
              className="rounded-xl"
            />
            <span className="text-lg font-semibold text-primary-foreground">
              Welcome to Taylor Jean
            </span>
          </div>

          <div className="space-y-6">
            <blockquote className="space-y-4">
              <p className="text-xl text-primary-foreground/95 leading-relaxed max-w-md font-semi-bold">
                Taylor Jean Sport Fishing: A Legacy of Excellence in Competitive
                Fishing
              </p>
              <p className="text-xl text-primary-foreground/95 leading-relaxed max-w-md font-light">
                &ldquo;Welcome aboard the Taylor Jean, one of the most decorated
                sport fishing vessels on the tournament circuit. With a history
                of hard-fought victories, record-breaking catches, and an
                unwavering commitment to the sport, the Taylor Jean Sport
                Fishing team has built a reputation as a dominant force in some
                of the most prestigious offshore fishing competitions.&rdquo;
              </p>
              <footer className="text-sm">
                <p className="font-medium text-primary-foreground">
                  TAYLOR JEAN
                </p>
                <p className="text-primary-foreground/70">
                  Product Manager at TechCorp
                </p>
              </footer>
            </blockquote>
          </div>

          <p className="text-xs text-primary-foreground/50">
            © 2025 Taylor Jean. All rights reserved.
          </p>
        </div>

        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
