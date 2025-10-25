"use client"

import type { Job } from "@/lib/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const statusColors = {
    open: "bg-blue-50 text-blue-700 border border-blue-200",
    "in-progress": "bg-amber-50 text-amber-700 border border-amber-200",
    completed: "bg-slate-50 text-slate-700 border border-slate-200",
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">{job.title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2">{job.description}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${statusColors[job.status]}`}
        >
          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
        </span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Category</p>
            <p className="font-medium text-foreground">{job.category}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Budget</p>
            <p className="font-medium text-primary">${job.budget}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Bids</p>
            <p className="font-medium text-foreground">{job.bids.length}</p>
          </div>
        </div>
      </div>

      <Link href={`/jobs/${job.id}`}>
        <Button className="w-full bg-primary hover:bg-accent text-primary-foreground">View Details</Button>
      </Link>
    </div>
  )
}
