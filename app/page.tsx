"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/jobs")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-balance text-foreground">Connect with Opportunities</h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              FreelanceHub is your platform to find gigs, build your portfolio, and earn money. Whether you're a
              freelancer seeking projects or a client looking for talent, we've got you covered.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/auth/login">
              <Button size="lg" className="bg-primary hover:bg-accent text-primary-foreground">
                Login
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline">
                Sign Up
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-16">
            <div className="p-8 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors">
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <p className="text-muted-foreground font-medium">Active Jobs Posted</p>
            </div>
            <div className="p-8 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground font-medium">Freelancers Earning</p>
            </div>
            <div className="p-8 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors">
              <div className="text-4xl font-bold text-primary mb-2">4.8★</div>
              <p className="text-muted-foreground font-medium">Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
