"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayCircle, Clock, BarChart2, Trophy } from "lucide-react"

const practiceTests = [
  {
    id: 1,
    title: "Practice Test #1",
    duration: "3 hours",
    questions: 154,
    status: "Not Started"
  },
  {
    id: 2,
    title: "Practice Test #2",
    duration: "3 hours",
    questions: 154,
    status: "Not Started"
  }
]

const stats = [
  {
    title: "Average Score",
    value: "1420",
    icon: Trophy,
    description: "Your current average",
  },
  {
    title: "Tests Completed",
    value: "3",
    icon: BarChart2,
    description: "Total tests taken",
  },
  {
    title: "Study Time",
    value: "24h",
    icon: Clock,
    description: "This month",
  },
]

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome Back!</h2>
        <p className="text-muted-foreground">
          Continue your SAT preparation journey
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
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

      {/* Available Practice Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Available Practice Tests</CardTitle>
          <CardDescription>
            Start a new practice test or continue where you left off
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {practiceTests.map((test) => (
              <div
                key={test.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{test.title}</p>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{test.duration}</span>
                    <span>•</span>
                    <span>{test.questions} questions</span>
                  </div>
                </div>
                <Button>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Start Test
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 