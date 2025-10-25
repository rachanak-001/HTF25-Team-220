"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { ClientStats } from "@/components/client-stats"
import { ClientJobsList } from "@/components/client-jobs-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type TabType = "open" | "in-progress" | "completed"

export default function ClientDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("open")

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "client")) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user || user.role !== "client") {
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
            <Link href="/jobs/create">
              <Button className="bg-primary hover:bg-primary-dark">Post a Job</Button>
            </Link>
          </div>

          <div className="mb-12">
            <ClientStats />
          </div>

          <div className="bg-muted-bg border border-border rounded-lg p-8">
            <div className="flex gap-4 mb-8 border-b border-border">
              <button
                onClick={() => setActiveTab("open")}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === "open"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                Open Jobs
              </button>
              <button
                onClick={() => setActiveTab("in-progress")}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === "in-progress"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                In Progress
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

            <ClientJobsList filter={activeTab} />
          </div>
        </div>
      </main>
    </>
  )
}
