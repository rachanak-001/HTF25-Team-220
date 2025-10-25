"use client"

import { useAuth } from "@/lib/auth-context"
import { useJobs } from "@/lib/job-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { JobCard } from "@/components/job-card"
import { JobFilters, type FilterState } from "@/components/job-filters"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Job } from "@/lib/types"

export default function JobsPage() {
  const { user, isLoading } = useAuth()
  const { jobs } = useJobs()
  const router = useRouter()
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  const handleFilterChange = (filters: FilterState) => {
    let filtered = jobs

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          job.description.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    // Category filter
    if (filters.category !== "All") {
      filtered = filtered.filter((job) => job.category === filters.category)
    }

    // Status filter
    if (filters.status !== "All") {
      const statusMap: { [key: string]: string } = {
        "In Progress": "in-progress",
        Open: "open",
        Completed: "completed",
      }
      filtered = filtered.filter((job) => job.status === statusMap[filters.status])
    }

    // Budget filter
    filtered = filtered.filter((job) => job.budget >= filters.minBudget && job.budget <= filters.maxBudget)

    setFilteredJobs(filtered)
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Available Jobs</h1>
              <p className="text-muted">Browse and apply for freelance opportunities</p>
            </div>
            {user.role === "client" && (
              <Link href="/jobs/create">
                <Button className="bg-primary hover:bg-primary-dark">Post a Job</Button>
              </Link>
            )}
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <JobFilters onFilterChange={handleFilterChange} />
            </div>

            <div className="lg:col-span-3">
              {filteredJobs.length > 0 ? (
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted-bg border border-border rounded-lg">
                  <p className="text-muted text-lg">No jobs found matching your criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
