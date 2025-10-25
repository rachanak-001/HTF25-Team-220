"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { Job, Bid, Review } from "./types"

interface JobContextType {
  jobs: Job[]
  reviews: Review[]
  addJob: (job: Job) => void
  updateJob: (id: string, updates: Partial<Job>) => void
  getJobById: (id: string) => Job | undefined
  placeBid: (jobId: string, bid: Bid) => void
  addReview: (review: Review) => void
  getReviewsForUser: (userId: string) => Review[]
}

const JobContext = createContext<JobContextType | undefined>(undefined)

export function JobProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "1",
      title: "Logo Design for Tech Startup",
      description: "Need a modern logo for our new tech startup. Should be minimalist and professional.",
      category: "Design",
      budget: 500,
      status: "open",
      clientId: "client1",
      createdAt: new Date(),
      bids: [],
    },
    {
      id: "2",
      title: "Blog Post Writing - SEO Optimized",
      description: "Write 5 blog posts about digital marketing trends. Must be SEO optimized.",
      category: "Writing",
      budget: 300,
      status: "open",
      clientId: "client2",
      createdAt: new Date(),
      bids: [],
    },
    {
      id: "3",
      title: "React Component Development",
      description: "Build reusable React components for our dashboard application.",
      category: "Development",
      budget: 800,
      status: "open",
      clientId: "client3",
      createdAt: new Date(),
      bids: [],
    },
  ])

  const [reviews, setReviews] = useState<Review[]>([])

  const addJob = (job: Job) => {
    setJobs([...jobs, job])
  }

  const updateJob = (id: string, updates: Partial<Job>) => {
    setJobs(jobs.map((job) => (job.id === id ? { ...job, ...updates } : job)))
  }

  const getJobById = (id: string) => {
    return jobs.find((job) => job.id === id)
  }

  const placeBid = (jobId: string, bid: Bid) => {
    setJobs(jobs.map((job) => (job.id === jobId ? { ...job, bids: [...job.bids, bid] } : job)))
  }

  const addReview = (review: Review) => {
    setReviews([...reviews, review])
  }

  const getReviewsForUser = (userId: string) => {
    return reviews.filter((review) => review.toUserId === userId)
  }

  return (
    <JobContext.Provider
      value={{ jobs, reviews, addJob, updateJob, getJobById, placeBid, addReview, getReviewsForUser }}
    >
      {children}
    </JobContext.Provider>
  )
}

export function useJobs() {
  const context = useContext(JobContext)
  if (context === undefined) {
    throw new Error("useJobs must be used within JobProvider")
  }
  return context
}
