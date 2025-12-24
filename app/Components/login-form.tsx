// "use client";

// import type React from "react";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
// import * as Label from "@radix-ui/react-label";
// import * as Checkbox from "@radix-ui/react-checkbox";
// import { Check } from "lucide-react";

// export function LoginForm() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     await new Promise((resolve) => setTimeout(resolve, 1500));
//     setIsLoading(false);
//     router.push("/dashboard");
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-5">
//       <div className="space-y-2">
//         <Label.Root
//           htmlFor="email"
//           className="text-sm font-medium text-foreground"
//         >
//           Email address
//         </Label.Root>
//         <div className="relative group">
//           <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
//           <input
//             id="email"
//             type="email"
//             placeholder="name@company.com"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full pl-10 pr-4 h-11 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
//             required
//           />
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label.Root
//           htmlFor="password"
//           className="text-sm font-medium text-foreground"
//         >
//           Password
//         </Label.Root>
//         <div className="relative group">
//           <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
//           <input
//             id="password"
//             type={showPassword ? "text" : "password"}
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full pl-10 pr-10 h-11 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
//             required
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
//           >
//             {showPassword ? (
//               <EyeOff className="h-4 w-4" />
//             ) : (
//               <Eye className="h-4 w-4" />
//             )}
//             <span className="sr-only">
//               {showPassword ? "Hide password" : "Show password"}
//             </span>
//           </button>
//         </div>
//       </div>

//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <Checkbox.Root
//             id="remember"
//             checked={rememberMe}
//             onCheckedChange={(checked) => setRememberMe(checked === true)}
//             className="h-4 w-4 shrink-0 rounded border border-muted-foreground/50 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground"
//           >
//             <Checkbox.Indicator className="flex items-center justify-center">
//               <Check className="h-3 w-3" />
//             </Checkbox.Indicator>
//           </Checkbox.Root>
//           <Label.Root
//             htmlFor="remember"
//             className="text-sm font-normal text-muted-foreground cursor-pointer"
//           >
//             Remember me
//           </Label.Root>
//         </div>
//         <a
//           href="#"
//           className="text-sm font-medium text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-colors"
//         >
//           Forgot password?
//         </a>
//       </div>

//       <button
//         type="submit"
//         disabled={isLoading}
//         className="w-full h-11 flex items-center justify-center gap-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         {isLoading ? (
//           <>
//             <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
//             Signing in...
//           </>
//         ) : (
//           <>
//             Sign in
//             <ArrowRight className="h-4 w-4" />
//           </>
//         )}
//       </button>

//       <div className="relative py-2">
//         <div className="absolute inset-0 flex items-center">
//           <span className="w-full border-t border-border" />
//         </div>
//         <div className="relative flex justify-center text-xs uppercase">
//           <span className="bg-card px-3 text-muted-foreground">
//             Or continue with
//           </span>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-3">
//         <button
//           type="button"
//           className="h-11 flex items-center justify-center gap-2 text-sm font-medium border border-input bg-background text-foreground hover:bg-accent hover:border-accent-foreground/20 rounded-lg transition-all"
//         >
//           <svg className="h-4 w-4" viewBox="0 0 24 24">
//             <path
//               fill="currentColor"
//               d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//             />
//             <path
//               fill="currentColor"
//               d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//             />
//             <path
//               fill="currentColor"
//               d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//             />
//             <path
//               fill="currentColor"
//               d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//             />
//           </svg>
//           Google
//         </button>
//         <button
//           type="button"
//           className="h-11 flex items-center justify-center gap-2 text-sm font-medium border border-input bg-background text-foreground hover:bg-accent hover:border-accent-foreground/20 rounded-lg transition-all"
//         >
//           <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
//             <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
//           </svg>
//           GitHub
//         </button>
//       </div>
//     </form>
//   );
// }

"use client";

import type React from "react";
import { NextResponse } from "next/server";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import * as Label from "@radix-ui/react-label";
import Link from "next/link";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     setIsLoading(true);
  //     await new Promise((resolve) => setTimeout(resolve, 1500));

  //     setIsLoading(false);
  //     router.push("/dashboard");
  //   };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    //   try {
    //     const res = await fetch("/api/login", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ email, password }),
    //     });

    //     const data = await res.json();

    //     if (!res.ok) {
    //       alert(data.message || "Login failed");
    //       return;
    //     }

    //     // ❌ Client JS ko token access nahi
    //     router.push("/dashboard");
    //   } catch (error) {
    //     alert("Something went wrong");
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }
      const role = data.data.role;
      // ✅ ROLE BASED DASHBOARD
      if (role === "Team") {
        router.push("/team");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
          className="w-full px-4 h-12 bg-muted rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          required
        />
      </div>

      <div className="space-y-2">
        <Label.Root
          htmlFor="password"
          className="text-sm font-semibold text-foreground"
        >
          Password
        </Label.Root>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 pr-12 h-12 bg-muted rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <Eye className="h-5 w-5" />
            ) : (
              <EyeOff className="h-5 w-5" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <a
          href="/forgot-password"
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Forgot Password?
        </a>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 flex items-center justify-center text-base font-semibold bg-dark-navy text-white hover:bg-dark-navy/90 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? (
          <>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white mr-2" />
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-accent hover:text-accent/80 transition-colors"
        >
          Sign up
        </Link>
      </p>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-card px-4 text-muted-foreground">
            or continue with
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6">
        <button
          type="button"
          className="w-14 h-14 flex items-center justify-center border border-border bg-card rounded-full hover:bg-primary/10 transition-all cursor-pointer"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#4285F4"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="sr-only">Sign in with Google</span>
        </button>
        <button
          type="button"
          className="w-14 h-14 flex items-center justify-center border border-border bg-card rounded-full hover:bg-primary/10 transition-all cursor-pointer"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          <span className="sr-only">Sign in with Apple</span>
        </button>
        <button
          type="button"
          className="w-14 h-14 flex items-center justify-center border border-border bg-card rounded-full hover:bg-primary/10 transition-all cursor-pointer"
        >
          <svg className="h-6 w-6" fill="#1877F2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="sr-only">Sign in with Facebook</span>
        </button>
      </div>
    </form>
  );
}
