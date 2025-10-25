"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface JobFiltersProps {
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  search: string
  category: string
  status: string
  minBudget: number
  maxBudget: number
}

const categories = ["All", "Design", "Writing", "Development", "Marketing", "Video"]
const statuses = ["All", "Open", "In Progress", "Completed"]

export function JobFilters({ onFilterChange }: JobFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "All",
    status: "All",
    minBudget: 0,
    maxBudget: 10000,
  })

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFilterChange(updated)
  }

  return (
    <div className="bg-muted-bg border border-border rounded-lg p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Search Jobs</label>
        <Input
          type="text"
          placeholder="Search by title or description..."
          value={filters.search}
          onChange={(e) => handleFilterChange({ search: e.target.value })}
          className="bg-background border-border"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={filters.category === cat ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange({ category: cat })}
              className={filters.category === cat ? "bg-primary hover:bg-primary-dark" : ""}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Status</label>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <Button
              key={status}
              variant={filters.status === status ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange({ status })}
              className={filters.status === status ? "bg-primary hover:bg-primary-dark" : ""}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Budget Range</label>
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minBudget}
              onChange={(e) => handleFilterChange({ minBudget: Number.parseInt(e.target.value) || 0 })}
              className="bg-background border-border"
            />
          </div>
          <div className="flex-1">
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxBudget}
              onChange={(e) => handleFilterChange({ maxBudget: Number.parseInt(e.target.value) || 10000 })}
              className="bg-background border-border"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
