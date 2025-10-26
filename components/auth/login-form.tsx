"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"client" | "freelancer">("freelancer")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      await login(email, password, role)
      router.push("/jobs")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed. Please try again.")
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Password</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">I am a:</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="freelancer"
              checked={role === "freelancer"}
              onChange={(e) => setRole(e.target.value as "freelancer")}
              className="w-4 h-4"
            />
            <span>Freelancer</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="client"
              checked={role === "client"}
              onChange={(e) => setRole(e.target.value as "client")}
              className="w-4 h-4"
            />
            <span>Client</span>
          </label>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  )
}
