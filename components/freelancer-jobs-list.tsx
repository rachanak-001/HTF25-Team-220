"use client"

import { useJobs } from "@/lib/job-context"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface FreelancerJobsListProps {
  filter: "active" | "completed" | "bids"
}

export function FreelancerJobsList({ filter }: FreelancerJobsListProps) {
  const { user } = useAuth()
  const { jobs } = useJobs()

  if (!user) return null

  let displayJobs = []

  if (filter === "active") {
    displayJobs = jobs.filter((job) => job.freelancerId === user.id && job.status === "in-progress")
  } else if (filter === "completed") {
    displayJobs = jobs.filter((job) => job.freelancerId === user.id && job.status === "completed")
  } else if (filter === "bids") {
    displayJobs = jobs.filter((job) => job.bids.some((bid) => bid.freelancerId === user.id))
  }

  if (displayJobs.length === 0) {
    return (
      <div className="text-center py-12 bg-muted-bg border border-border rounded-lg">
        <p className="text-muted mb-4">No jobs found in this category</p>
        <Link href="/jobs">
          <Button className="bg-primary hover:bg-primary-dark">Browse Jobs</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {displayJobs.map((job) => {
        const myBid = job.bids.find((bid) => bid.freelancerId === user.id)
        return (
          <div key={job.id} className="bg-muted-bg border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">{job.title}</h3>
                <p className="text-sm text-muted line-clamp-2">{job.description}</p>
              </div>
              <div className="text-right ml-4">
                <p className="text-2xl font-bold text-primary">${job.budget}</p>
                <p className="text-xs text-muted">{job.category}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div>
                  <p className="text-xs text-muted">Status</p>
                  <p className="font-medium text-foreground capitalize">{job.status}</p>
                </div>
                {myBid && (
                  <div>
                    <p className="text-xs text-muted">Your Bid</p>
                    <p className="font-medium text-primary">${myBid.amount}</p>
                  </div>
                )}
              </div>
              <Link href={`/jobs/${job.id}`}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
