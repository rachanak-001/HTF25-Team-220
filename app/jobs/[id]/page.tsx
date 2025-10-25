"use client"

import { useAuth } from "@/lib/auth-context"
import { useJobs } from "@/lib/job-context"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { BidForm } from "@/components/bid-form"
import { BidList } from "@/components/bid-list"
import { ClaimJobButton } from "@/components/claim-job-button"
import { ReviewForm } from "@/components/review-form"
import { ReviewList } from "@/components/review-list"
import { FreelancerProfile } from "@/components/freelancer-profile"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Job } from "@/lib/types"

export default function JobDetailPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { getJobById, updateJob } = useJobs()
  const router = useRouter()
  const params = useParams()
  const jobId = params.id as string

  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const foundJob = getJobById(jobId)
    setJob(foundJob || null)
    setIsLoading(false)
  }, [jobId, getJobById, refreshKey])

  if (isLoading || authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!job) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Job not found</h1>
              <Link href="/jobs">
                <Button className="bg-primary hover:bg-primary-dark">Back to Jobs</Button>
              </Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  const statusColors = {
    open: "bg-green-100 text-green-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-gray-100 text-gray-800",
  }

  const handleAcceptBid = (bidId: string) => {
    const bid = job.bids.find((b) => b.id === bidId)
    if (bid) {
      updateJob(job.id, {
        freelancerId: bid.freelancerId,
        status: "in-progress",
        bids: job.bids.map((b) => ({
          ...b,
          status: b.id === bidId ? "accepted" : "rejected",
        })),
      })
      setRefreshKey((prev) => prev + 1)
    }
  }

  const handleRejectBid = (bidId: string) => {
    updateJob(job.id, {
      bids: job.bids.map((b) => (b.id === bidId ? { ...b, status: "rejected" } : b)),
    })
    setRefreshKey((prev) => prev + 1)
  }

  const handleCompleteJob = () => {
    updateJob(job.id, { status: "completed" })
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Link href="/jobs" className="text-primary hover:text-primary-dark mb-6 inline-block">
            ← Back to Jobs
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-muted-bg border border-border rounded-lg p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
                    <p className="text-muted">Posted on {new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[job.status]}`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                </div>

                <div className="prose prose-invert max-w-none mb-8">
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <p className="text-foreground whitespace-pre-wrap">{job.description}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-background border border-border rounded-lg p-4">
                    <p className="text-xs text-muted mb-1">Category</p>
                    <p className="font-semibold text-foreground">{job.category}</p>
                  </div>
                  <div className="bg-background border border-border rounded-lg p-4">
                    <p className="text-xs text-muted mb-1">Budget</p>
                    <p className="font-semibold text-primary text-lg">${job.budget}</p>
                  </div>
                  <div className="bg-background border border-border rounded-lg p-4">
                    <p className="text-xs text-muted mb-1">Total Bids</p>
                    <p className="font-semibold text-foreground text-lg">{job.bids.length}</p>
                  </div>
                </div>

                {job.status === "completed" && (
                  <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-green-800 mb-8">
                    <p className="font-semibold">This job has been completed!</p>
                  </div>
                )}

                {user?.role === "client" && job.status === "in-progress" && (
                  <Button onClick={handleCompleteJob} className="w-full bg-primary hover:bg-primary-dark mb-8">
                    Mark as Completed
                  </Button>
                )}

                {job.freelancerId && (job.status === "in-progress" || job.status === "completed") && (
                  <div className="mb-8">
                    <FreelancerProfile userId={job.freelancerId} name={`Freelancer ${job.freelancerId.slice(0, 8)}`} />
                  </div>
                )}
              </div>

              {user?.role === "client" && job.bids.length > 0 && (
                <div className="bg-muted-bg border border-border rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">Bids Received ({job.bids.length})</h2>
                  <BidList
                    bids={job.bids}
                    onAcceptBid={handleAcceptBid}
                    onRejectBid={handleRejectBid}
                    isClientView={true}
                  />
                </div>
              )}

              {job.status === "completed" && job.freelancerId && (
                <div className="space-y-8">
                  <ReviewForm job={job} onReviewSubmitted={() => setRefreshKey((prev) => prev + 1)} />
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Reviews for Freelancer</h2>
                    <ReviewList userId={job.freelancerId} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <ClaimJobButton job={job} onJobClaimed={() => setRefreshKey((prev) => prev + 1)} />
              <BidForm job={job} onBidPlaced={() => setRefreshKey((prev) => prev + 1)} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
