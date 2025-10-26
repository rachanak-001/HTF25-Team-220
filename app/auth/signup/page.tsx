import { SignupForm } from "@/components/auth/signup-form"
import Link from "next/link"

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-muted">Join FreelanceHub and start your journey</p>
        </div>

        <div className="bg-muted-bg border border-border rounded-lg p-8">
          <SignupForm />
        </div>

        <p className="text-center text-foreground font-semibold">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:text-primary-dark font-bold underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  )
}
