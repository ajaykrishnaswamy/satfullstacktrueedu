"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Clock, BarChart } from "lucide-react"

const stats = [
  {
    title: "Total Exams Created",
    value: "12",
    icon: FileText,
    description: "Active exams ready for students",
  },
  {
    title: "Total Students",
    value: "156",
    icon: Users,
    description: "Students enrolled in your exams",
  },
  {
    title: "Average Score",
    value: "1420",
    icon: BarChart,
    description: "Points across all exams",
  },
  {
    title: "Recent Activity",
    value: "24",
    icon: Clock,
    description: "Students took exams this week",
  },
]

const recentActivity = [
  {
    student: "John Doe",
    action: "Completed Practice Test #3",
    score: "1480",
    time: "2 hours ago",
  },
  {
    student: "Jane Smith",
    action: "Started Practice Test #4",
    score: "In Progress",
    time: "3 hours ago",
  },
  {
    student: "Mike Johnson",
    action: "Completed Practice Test #2",
    score: "1380",
    time: "5 hours ago",
  },
]

export default function InstructorDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your teaching activities.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{activity.student}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.action}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{activity.score}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 