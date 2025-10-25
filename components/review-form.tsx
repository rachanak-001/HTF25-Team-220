"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useJobs } from "@/lib/job-context"
import { Button } from "@/components/ui/button"
import type { Job, Review } from "@/lib/types"

interface ReviewFormProps {
  job: Job
  onReviewSubmitted?: () => void
}

export function ReviewForm({ job, onReviewSubmitted }: ReviewFormProps) {
  const { user } = useAuth()
  const { addReview } = useJobs()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!user || user.role !== "client" || job.status !== "completed" || !job.freelancerId) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const newReview: Review = {
        id: Math.random().toString(36).substr(2, 9),
        jobId: job.id,
        fromUserId: user.id,
        toUserId: job.freelancerId,
        rating,
        comment,
        createdAt: new Date(),
      }

      addReview(newReview)
      setRating(5)
      setComment("")
      onReviewSubmitted?.()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-muted-bg border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold">Leave a Review</h3>

      <div>
        <label className="block text-sm font-medium mb-2">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-3xl transition-colors ${star <= rating ? "text-yellow-400" : "text-muted"}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Your Feedback</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience working with this freelancer..."
          className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
          rows={4}
          required
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary-dark">
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}
