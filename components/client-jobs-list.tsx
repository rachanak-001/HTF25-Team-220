"use client"

import { useJobs } from "@/lib/job-context"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ClientJobsListProps {
  filter: "open" | "in-progress" | "completed"
}

export function ClientJobsList({ filter }: ClientJobsListProps) {
  const { user } = useAuth()
  const { jobs } = useJobs()

  if (!user) return null

  const myJobs = jobs.filter((job) => job.clientId === user.id && job.status === filter)

  if (myJobs.length === 0) {
    return (
      <div className="text-center py-12 bg-muted-bg border border-border rounded-lg">
        <p className="text-muted mb-4">No {filter} jobs</p>
        <Link href="/jobs/create">
          <Button className="bg-primary hover:bg-primary-dark">Post a Job</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {myJobs.map((job) => {
        const acceptedBid = job.bids.find((bid) => bid.status === "accepted")
        const pendingBids = job.bids.filter((bid) => bid.status === "pending")

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
              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-muted">Status</p>
                  <p className="font-medium text-foreground capitalize">{job.status}</p>
                </div>
                {filter === "open" && (
                  <div>
                    <p className="text-xs text-muted">Pending Bids</p>
                    <p className="font-medium text-primary">{pendingBids.length}</p>
                  </div>
                )}
                {acceptedBid && (
                  <div>
                    <p className="text-xs text-muted">Accepted Bid</p>
                    <p className="font-medium text-primary">${acceptedBid.amount}</p>
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
