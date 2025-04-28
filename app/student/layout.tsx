"use client"

import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { BookOpen, BarChart2, Clock, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const navigation = [
  {
    name: "Practice Tests",
    href: "/student",
    icon: BookOpen
  },
  {
    name: "Progress",
    href: "/student/progress",
    icon: BarChart2
  },
  {
    name: "Test History",
    href: "/student/history",
    icon: Clock
  },
  {
    name: "Settings",
    href: "/student/settings",
    icon: Settings
  }
]

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const router = useRouter()

  // Show loading state
  if (status === "loading") {
    return <div>Loading...</div>
  }

  // Only redirect if we're not already on the auth pages
  if (!pathname.includes("/auth/")) {
    if (!session) {
      router.push("/login")
      return null
    }
    if (!session.user?.type) {
      router.push("/auth/role-select")
      return null
    }
    if (session.user.type !== "student") {
      router.push("/auth/role-select")
      return null
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Student Dashboard</h2>
        </div>
        <nav className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 ${
                    isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                  }`}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-gray-100">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 