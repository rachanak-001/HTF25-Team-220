"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useJobs } from "@/lib/job-context"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import type { Job } from "@/lib/types"

const categories = ["Design", "Writing", "Development", "Marketing", "Video", "Other"]

export default function CreateJobPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { addJob } = useJobs()
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Development",
    budget: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user || user.role !== "client") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
              <p className="text-muted mb-6">Only clients can post jobs</p>
              <Link href="/jobs">
                <Button className="bg-primary hover:bg-primary-dark">Back to Jobs</Button>
              </Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const newJob: Job = {
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        budget: Number.parseFloat(formData.budget),
        status: "open",
        clientId: user.id,
        createdAt: new Date(),
        bids: [],
      }

      addJob(newJob)
      router.push("/jobs")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Link href="/jobs" className="text-primary hover:text-primary-dark mb-6 inline-block">
            ← Back to Jobs
          </Link>

          <div className="max-w-2xl mx-auto">
            <div className="bg-muted-bg border border-border rounded-lg p-8">
              <h1 className="text-3xl font-bold mb-2">Post a New Job</h1>
              <p className="text-muted mb-8">Fill in the details below to post your job</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Job Title</label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Logo Design for Tech Startup"
                    className="bg-background border-border"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your job in detail..."
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={6}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Budget ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="0.00"
                      className="bg-background border-border"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={isSubmitting} className="flex-1 bg-primary hover:bg-primary-dark">
                    {isSubmitting ? "Posting..." : "Post Job"}
                  </Button>
                  <Link href="/jobs" className="flex-1">
                    <Button type="button" variant="outline" className="w-full bg-transparent">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
