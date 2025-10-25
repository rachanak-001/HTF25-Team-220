"use client"

import { useJobs } from "@/lib/job-context"
import { useAuth } from "@/lib/auth-context"

export function FreelancerStats() {
  const { user } = useAuth()
  const { jobs } = useJobs()

  if (!user) return null

  const myBids = jobs.flatMap((job) => job.bids.filter((bid) => bid.freelancerId === user.id))
  const acceptedBids = myBids.filter((bid) => bid.status === "accepted")
  const completedJobs = jobs.filter((job) => job.freelancerId === user.id && job.status === "completed")
  const totalEarnings = acceptedBids.reduce((sum, bid) => sum + bid.amount, 0)

  return (
    <div className="grid md:grid-cols-4 gap-4">
      <div className="bg-muted-bg border border-border rounded-lg p-6">
        <p className="text-xs text-muted mb-2">Active Bids</p>
        <p className="text-3xl font-bold text-primary">{myBids.filter((b) => b.status === "pending").length}</p>
      </div>
      <div className="bg-muted-bg border border-border rounded-lg p-6">
        <p className="text-xs text-muted mb-2">Jobs Accepted</p>
        <p className="text-3xl font-bold text-primary">{acceptedBids.length}</p>
      </div>
      <div className="bg-muted-bg border border-border rounded-lg p-6">
        <p className="text-xs text-muted mb-2">Completed Jobs</p>
        <p className="text-3xl font-bold text-primary">{completedJobs.length}</p>
      </div>
      <div className="bg-muted-bg border border-border rounded-lg p-6">
        <p className="text-xs text-muted mb-2">Total Earnings</p>
        <p className="text-3xl font-bold text-primary">${totalEarnings.toFixed(2)}</p>
      </div>
    </div>
  )
}
