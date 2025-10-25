"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useJobs } from "@/lib/job-context"
import { Button } from "@/components/ui/button"
import type { Job } from "@/lib/types"

interface ClaimJobButtonProps {
  job: Job
  onJobClaimed?: () => void
}

export function ClaimJobButton({ job, onJobClaimed }: ClaimJobButtonProps) {
  const { user } = useAuth()
  const { updateJob } = useJobs()
  const [isLoading, setIsLoading] = useState(false)

  const handleClaim = async () => {
    if (!user || user.role !== "freelancer") return

    setIsLoading(true)
    try {
      updateJob(job.id, {
        freelancerId: user.id,
        status: "in-progress",
      })
      onJobClaimed?.()
    } finally {
      setIsLoading(false)
    }
  }

  if (user?.role !== "freelancer" || job.status !== "open" || job.freelancerId) {
    return null
  }

  return (
    <Button onClick={handleClaim} disabled={isLoading} className="w-full bg-primary hover:bg-primary-dark">
      {isLoading ? "Claiming..." : "Claim Job"}
    </Button>
  )
}
