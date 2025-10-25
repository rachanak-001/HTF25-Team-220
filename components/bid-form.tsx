"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useJobs } from "@/lib/job-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Job, Bid } from "@/lib/types"

interface BidFormProps {
  job: Job
  onBidPlaced?: () => void
}

export function BidForm({ job, onBidPlaced }: BidFormProps) {
  const { user } = useAuth()
  const { placeBid } = useJobs()
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || user.role !== "freelancer") return

    setIsSubmitting(true)
    try {
      const newBid: Bid = {
        id: Math.random().toString(36).substr(2, 9),
        jobId: job.id,
        freelancerId: user.id,
        amount: Number.parseFloat(amount),
        message,
        createdAt: new Date(),
        status: "pending",
      }

      placeBid(job.id, newBid)
      setAmount("")
      setMessage("")
      onBidPlaced?.()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (user?.role !== "freelancer") {
    return null
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-muted-bg border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold">Place Your Bid</h3>

      <div>
        <label className="block text-sm font-medium mb-2">Your Bid Amount ($)</label>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter your bid amount"
          className="bg-background border-border"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Cover Letter</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell the client why you're the right fit for this job..."
          className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
          rows={4}
          required
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary-dark">
        {isSubmitting ? "Submitting..." : "Submit Bid"}
      </Button>
    </form>
  )
}
