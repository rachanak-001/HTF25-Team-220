"use client"

import { useJobs } from "@/lib/job-context"
import { useAuth } from "@/lib/auth-context"

export function ClientStats() {
  const { user } = useAuth()
  const { jobs } = useJobs()

  if (!user) return null

  const myJobs = jobs.filter((job) => job.clientId === user.id)
  const openJobs = myJobs.filter((job) => job.status === "open")
  const inProgressJobs = myJobs.filter((job) => job.status === "in-progress")
  const completedJobs = myJobs.filter((job) => job.status === "completed")
  const totalSpent = myJobs.reduce((sum, job) => {
    const acceptedBid = job.bids.find((bid) => bid.status === "accepted")
    return sum + (acceptedBid ? acceptedBid.amount : 0)
  }, 0)

  return (
    <div className="grid md:grid-cols-4 gap-4">
      <div className="bg-muted-bg border border-border rounded-lg p-6">
        <p className="text-xs text-muted mb-2">Open Jobs</p>
        <p className="text-3xl font-bold text-primary">{openJobs.length}</p>
      </div>
      <div className="bg-muted-bg border border-border rounded-lg p-6">
        <p className="text-xs text-muted mb-2">In Progress</p>
        <p className="text-3xl font-bold text-primary">{inProgressJobs.length}</p>
      </div>
      <div className="bg-muted-bg border border-border rounded-lg p-6">
        <p className="text-xs text-muted mb-2">Completed</p>
        <p className="text-3xl font-bold text-primary">{completedJobs.length}</p>
      </div>
      <div className="bg-muted-bg border border-border rounded-lg p-6">
        <p className="text-xs text-muted mb-2">Total Spent</p>
        <p className="text-3xl font-bold text-primary">${totalSpent.toFixed(2)}</p>
      </div>
    </div>
  )
}
