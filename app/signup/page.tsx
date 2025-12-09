import { AuthLayout } from "../Components/auth-layout";
import { SignupForm } from "../Components/signup-form";

export default function SignupPage() {
  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Create account
          </h1>
          <p className="mt-1 text-muted-foreground">
            Enter your details to create your account
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <SignupForm />
        </div>
      </div>
    </AuthLayout>
  );
}
