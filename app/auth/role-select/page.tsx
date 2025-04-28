"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { School, GraduationCap } from "lucide-react"

export default function RoleSelect() {
  const router = useRouter()
  const { data: session, update, status } = useSession()

  useEffect(() => {
    // If not authenticated, redirect to login
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
    // If user already has a role, redirect to their dashboard
    else if (session?.user?.type) {
      router.push(session.user.type === "instructor" ? "/instructor" : "/student")
    }
  }, [session, status, router])

  const handleRoleSelect = async (role: "instructor" | "student") => {
    try {
      // Update the session with the selected role
      const updatedSession = await update({
        ...session,
        user: {
          ...session?.user,
          type: role
        }
      })

      if (updatedSession?.user?.type) {
        // Redirect to the appropriate dashboard
        router.push(role === "instructor" ? "/instructor" : "/student")
      }
    } catch (error) {
      console.error("Error updating role:", error)
    }
  }

  // Show loading state or redirect
  if (status === "loading" || !session || session.user?.type) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Welcome to OneClickSAT
          </h2>
          <p className="mt-2 text-gray-600">
            Please select how you would like to use the platform
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card 
            className="cursor-pointer hover:border-blue-500 transition-colors"
            onClick={() => handleRoleSelect("instructor")}
          >
            <CardHeader>
              <School className="h-12 w-12 text-blue-500 mb-4" />
              <CardTitle className="text-2xl">I'm an Instructor</CardTitle>
              <CardDescription>
                Create and manage SAT practice tests, monitor student progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Create custom practice tests</li>
                <li>• Track student performance</li>
                <li>• Generate detailed reports</li>
                <li>• Manage multiple student groups</li>
              </ul>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-blue-500 transition-colors"
            onClick={() => handleRoleSelect("student")}
          >
            <CardHeader>
              <GraduationCap className="h-12 w-12 text-blue-500 mb-4" />
              <CardTitle className="text-2xl">I'm a Student</CardTitle>
              <CardDescription>
                Practice for the SAT with personalized tests and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Take practice tests</li>
                <li>• Get personalized feedback</li>
                <li>• Track your progress</li>
                <li>• View detailed explanations</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 