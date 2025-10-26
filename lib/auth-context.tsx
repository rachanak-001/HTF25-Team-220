"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, UserRole } from "./types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, role: UserRole) => Promise<void>
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: UserRole) => {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const existingUser = registeredUsers.find(
      (u: any) => u.email === email && u.password === password && u.role === role,
    )

    if (!existingUser) {
      throw new Error("Invalid email, password, or role. Please check your credentials or sign up first.")
    }

    setUser(existingUser)
    localStorage.setItem("user", JSON.stringify(existingUser))
  }

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const userExists = registeredUsers.some((u: any) => u.email === email && u.role === role)

    if (userExists) {
      throw new Error("An account with this email already exists for this role.")
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role,
      rating: 0,
      totalReviews: 0,
    }

    registeredUsers.push({
      ...newUser,
      password, // Store password for login verification
    })

    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
