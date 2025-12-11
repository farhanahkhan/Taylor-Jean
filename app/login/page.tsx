import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "../Components/login-form";
import taylorjean from "../../public/taylorjean.png";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex pt-0">
        {/* Left side - Login Form */}
        <div className="flex-3 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-6">
              <Image
                src={taylorjean}
                alt="Taylor Jean logo"
                // width={100}
                // height={36}
                className="rounded-xl w-[90%] mb-4"
              />
              <h1 className="text-2xl font-semibold tracking-tight text-foreground ">
                Welcome back
              </h1>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Enter your credentials to access your account
              </p>
            </div>

            <div className="bg-card px-6 py-11 rounded-2xl border border-border shadow-sm">
              <LoginForm />
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="#"
                className="font-medium text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Right side - Branding Panel */}
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
                  Taylor Jean Sport Fishing: A Legacy of Excellence in
                  Competitive Fishing
                </p>
                <p className="text-lg text-primary-foreground/95 leading-relaxed max-w-md font-light">
                  Welcome aboard the Taylor Jean, one of the most decorated
                  sport fishing vessels on the tournament circuit. With a
                  history of hard-fought victories, record-breaking catches, and
                  an unwavering commitment to the sport, the Taylor Jean Sport
                  Fishing team has built a reputation as a dominant force in
                  some of the most prestigious offshore fishing competitions.
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
    </div>
  );
}

// import { LoginForm } from "../Components/login-form";
// import Image from "next/image";

// export default function LoginPage() {
//   return (
//     <div className="min-h-screen flex flex-col bg-primary">
//       {/* Yellow header section with logo */}
//       <div className="flex flex-col items-center pt-8 pb-4 px-4">
//         <div className="relative w-48 h-32">
//           <img
//             src="/images/whatsapp-20image-202025-12-04-20at-2010.jpeg"
//             alt="Taylor Jean Sport Fishing"
//             className="w-full h-full object-contain"
//             style={{
//               filter: "brightness(0) saturate(100%)",
//               mixBlendMode: "multiply",
//             }}
//           />
//         </div>
//       </div>

//       {/* White card section */}
//       <div className="flex-1 bg-card rounded-t-[2.5rem] px-6 pt-8 pb-12 shadow-2xl">
//         <div className="max-w-sm mx-auto">
//           <div className="text-center mb-8">
//             <h1 className="text-2xl font-bold text-foreground">Login</h1>
//             <p className="mt-2 text-muted-foreground">
//               Please enter login details below
//             </p>
//           </div>

//           <LoginForm />
//         </div>
//       </div>
//     </div>
//   );
// }
