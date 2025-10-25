"use client"

import { useJobs } from "@/lib/job-context"

interface FreelancerProfileProps {
  userId: string
  name: string
}

export function FreelancerProfile({ userId, name }: FreelancerProfileProps) {
  const { getReviewsForUser, jobs } = useJobs()
  const reviews = getReviewsForUser(userId)
  const completedJobs = jobs.filter((job) => job.freelancerId === userId && job.status === "completed")
  const averageRating =
    reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0

  return (
    <div className="bg-muted-bg border border-border rounded-lg p-6 mb-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{name}</h2>
          <p className="text-muted">Freelancer</p>
        </div>
        <div className="text-right">
          <div className="flex gap-1 justify-end mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-xl ${star <= Math.round(Number(averageRating)) ? "text-yellow-400" : "text-muted"}`}
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-sm text-muted">
            {averageRating} ({reviews.length} reviews)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted mb-1">Completed Jobs</p>
          <p className="text-2xl font-bold text-primary">{completedJobs.length}</p>
        </div>
        <div>
          <p className="text-xs text-muted mb-1">Total Reviews</p>
          <p className="text-2xl font-bold text-primary">{reviews.length}</p>
        </div>
      </div>
    </div>
  )
}
