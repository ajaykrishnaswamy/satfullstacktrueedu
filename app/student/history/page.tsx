"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Download, Clock, Target } from "lucide-react"

const testHistory = [
  {
    id: 1,
    name: "Practice Test #3",
    date: "March 15, 2024",
    score: 1420,
    duration: "2h 45m",
    sections: {
      math: 720,
      readingWriting: 700
    }
  },
  {
    id: 2,
    name: "Practice Test #2",
    date: "March 8, 2024",
    score: 1380,
    duration: "2h 50m",
    sections: {
      math: 700,
      readingWriting: 680
    }
  },
  {
    id: 3,
    name: "Practice Test #1",
    date: "March 1, 2024",
    score: 1320,
    duration: "3h 00m",
    sections: {
      math: 680,
      readingWriting: 640
    }
  }
]

export default function TestHistory() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Test History</h2>
        <p className="text-muted-foreground">
          Review your past practice tests and track your progress
        </p>
      </div>

      <div className="space-y-4">
        {testHistory.map((test) => (
          <Card key={test.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{test.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Review
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Date Taken</p>
                  <p className="text-sm font-medium">{test.date}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Score</p>
                  <p className="text-sm font-medium">{test.score}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-sm font-medium">{test.duration}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Math</span>
                    <span className="font-medium">{test.sections.math}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Reading & Writing</span>
                    <span className="font-medium">{test.sections.readingWriting}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 