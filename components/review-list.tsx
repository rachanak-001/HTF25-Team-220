"use client"

import { useJobs } from "@/lib/job-context"

interface ReviewListProps {
  userId: string
}

export function ReviewList({ userId }: ReviewListProps) {
  const { getReviewsForUser } = useJobs()
  const reviews = getReviewsForUser(userId)

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 bg-muted-bg border border-border rounded-lg">
        <p className="text-muted">No reviews yet</p>
      </div>
    )
  }

  const averageRating =
    reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0

  return (
    <div className="space-y-4">
      <div className="bg-muted-bg border border-border rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-muted mb-1">Average Rating</p>
            <p className="text-4xl font-bold text-primary">{averageRating}</p>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-2xl ${star <= Math.round(Number(averageRating)) ? "text-yellow-400" : "text-muted"}`}
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-muted ml-auto">
            Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {reviews.map((review) => (
        <div key={review.id} className="bg-muted-bg border border-border rounded-lg p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={`text-lg ${star <= review.rating ? "text-yellow-400" : "text-muted"}`}>
                  ★
                </span>
              ))}
            </div>
            <p className="text-xs text-muted">{new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
          <p className="text-foreground">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}
