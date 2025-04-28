"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Sample data - this would come from your database in a real application
const scoreData = [
  { date: 'Test 1', score: 1320 },
  { date: 'Test 2', score: 1380 },
  { date: 'Test 3', score: 1420 },
]

const sectionScores = [
  {
    section: "Math",
    lastScore: 720,
    improvement: "+40",
    details: [
      { skill: "Algebra", correct: 85, total: 100 },
      { skill: "Geometry", correct: 75, total: 100 },
      { skill: "Problem Solving", correct: 90, total: 100 },
    ]
  },
  {
    section: "Reading & Writing",
    lastScore: 700,
    improvement: "+30",
    details: [
      { skill: "Reading Comprehension", correct: 80, total: 100 },
      { skill: "Writing & Language", correct: 75, total: 100 },
      { skill: "Vocabulary in Context", correct: 85, total: 100 },
    ]
  }
]

export default function Progress() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Your Progress</h2>
        <p className="text-muted-foreground">
          Track your improvement over time
        </p>
      </div>

      {/* Score Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Score Trend</CardTitle>
          <CardDescription>Your SAT score progression</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[1200, 1600]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ fill: "#2563eb" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Section Scores */}
      <div className="grid gap-6 md:grid-cols-2">
        {sectionScores.map((section) => (
          <Card key={section.section}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{section.section}</CardTitle>
                <div className="flex items-center">
                  <span className="text-2xl font-bold">{section.lastScore}</span>
                  <span className="ml-2 text-sm text-green-500">{section.improvement}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.details.map((detail) => (
                  <div key={detail.skill}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{detail.skill}</span>
                      <span>{Math.round((detail.correct / detail.total) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-600 rounded-full" 
                        style={{ width: `${(detail.correct / detail.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 