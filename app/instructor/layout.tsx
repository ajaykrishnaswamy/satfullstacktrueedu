"use client"

import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { PlusCircle, FileText, Users, BarChart } from "lucide-react"

const navigation = [
  {
    name: "Create Exams",
    href: "/instructor/create-exams",
    icon: PlusCircle
  },
  {
    name: "View Exams",
    href: "/instructor/view-exams",
    icon: FileText
  },
  {
    name: "View Students",
    href: "/instructor/view-students",
    icon: Users
  },
  {
    name: "View Reports",
    href: "/instructor/view-reports",
    icon: BarChart
  }
]

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  // Show loading state
  if (status === "loading") {
    return <div>Loading...</div>
  }

  // Redirect if not logged in or not an instructor
  if (!session || session.user?.type !== "instructor") {
    return <div>Access Denied. Please log in as an instructor.</div>
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Instructor Dashboard</h2>
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