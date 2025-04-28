"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function StudentDashboard() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "unauthenticated") {
    redirect("/login")
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Welcome, {session?.user?.name}!</h2>
          <p className="text-gray-600">{session?.user?.email}</p>
        </div>
        {/* Add your student dashboard content here */}
      </div>
    </div>
  )
}
