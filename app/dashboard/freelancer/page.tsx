"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { FreelancerStats } from "@/components/freelancer-stats"
import { FreelancerJobsList } from "@/components/freelancer-jobs-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type TabType = "active" | "completed" | "bids"

export default function FreelancerDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("active")

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "freelancer")) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user || user.role !== "freelancer") {
    return null
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Your Dashboard</h1>
              <p className="text-muted">Welcome back, {user.name}!</p>
            </div>
            <Link href="/jobs">
              <Button className="bg-primary hover:bg-primary-dark">Browse Jobs</Button>
            </Link>
          </div>

          <div className="mb-12">
            <FreelancerStats />
          </div>

          <div className="bg-muted-bg border border-border rounded-lg p-8">
            <div className="flex gap-4 mb-8 border-b border-border">
              <button
                onClick={() => setActiveTab("active")}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === "active"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                Active Jobs
              </button>
              <button
                onClick={() => setActiveTab("bids")}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === "bids"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                My Bids
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === "completed"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                Completed
              </button>
            </div>

            <FreelancerJobsList filter={activeTab} />
          </div>
        </div>
      </main>
    </>
  )
}
