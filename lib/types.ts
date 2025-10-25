export type UserRole = "client" | "freelancer"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  bio?: string
  rating?: number
  totalReviews?: number
}

export interface Job {
  id: string
  title: string
  description: string
  category: string
  budget: number
  status: "open" | "in-progress" | "completed"
  clientId: string
  freelancerId?: string
  createdAt: Date
  deadline?: Date
  bids: Bid[]
}

export interface Bid {
  id: string
  jobId: string
  freelancerId: string
  amount: number
  message: string
  createdAt: Date
  status: "pending" | "accepted" | "rejected"
}

export interface Review {
  id: string
  jobId: string
  fromUserId: string
  toUserId: string
  rating: number
  comment: string
  createdAt: Date
}
