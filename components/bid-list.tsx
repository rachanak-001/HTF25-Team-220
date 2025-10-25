"use client"

import type { Bid } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface BidListProps {
  bids: Bid[]
  onAcceptBid?: (bidId: string) => void
  onRejectBid?: (bidId: string) => void
  isClientView?: boolean
}

export function BidList({ bids, onAcceptBid, onRejectBid, isClientView = false }: BidListProps) {
  if (bids.length === 0) {
    return (
      <div className="text-center py-8 bg-muted-bg border border-border rounded-lg">
        <p className="text-muted">No bids yet. Check back soon!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bids.map((bid) => (
        <div key={bid.id} className="bg-muted-bg border border-border rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-semibold text-foreground">Freelancer ID: {bid.freelancerId}</p>
              <p className="text-sm text-muted">Bid placed on {new Date(bid.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">${bid.amount}</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                  bid.status === "accepted"
                    ? "bg-green-100 text-green-800"
                    : bid.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                }`}
              >
                {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
              </span>
            </div>
          </div>

          <p className="text-foreground mb-4">{bid.message}</p>

          {isClientView && bid.status === "pending" && (
            <div className="flex gap-2">
              <Button onClick={() => onAcceptBid?.(bid.id)} className="flex-1 bg-primary hover:bg-primary-dark">
                Accept Bid
              </Button>
              <Button onClick={() => onRejectBid?.(bid.id)} variant="outline" className="flex-1">
                Reject
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
