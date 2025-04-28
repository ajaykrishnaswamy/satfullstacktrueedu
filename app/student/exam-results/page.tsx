"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Check,
  Clock,
  Download,
  FileText,
  Home,
  LogOut,
  Settings,
  User,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ExamResultsPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock exam result data
  const examResult = {
    title: "SAT Practice Test #3",
    date: "Apr 8, 2025",
    score: 1280,
    maxScore: 1600,
    timeTaken: "2h 45m",
    sections: [
      { name: "Reading", score: 32, maxScore: 40, percentage: 80 },
      { name: "Writing", score: 35, maxScore: 40, percentage: 87.5 },
      { name: "Math (No Calculator)", score: 16, maxScore: 20, percentage: 80 },
      { name: "Math (Calculator)", score: 28, maxScore: 38, percentage: 73.7 },
    ],
    topics: [
      { name: "Algebra", correct: 12, total: 15, percentage: 80 },
      { name: "Geometry", correct: 8, total: 12, percentage: 66.7 },
      { name: "Grammar", correct: 18, total: 20, percentage: 90 },
      { name: "Reading Comprehension", correct: 24, total: 32, percentage: 75 },
      { name: "Data Analysis", correct: 10, total: 15, percentage: 66.7 },
      { name: "Vocabulary", correct: 14, total: 18, percentage: 77.8 },
    ],
    questions: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      text: `This is question ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit?`,
      userAnswer: i % 4 === 0 ? "b" : i % 3 === 0 ? "c" : "a",
      correctAnswer: i % 5 === 0 ? "b" : "a",
      explanation: "The correct answer is explained here with detailed reasoning and supporting evidence.",
      topic: i % 3 === 0 ? "Algebra" : i % 2 === 0 ? "Grammar" : "Reading Comprehension",
      difficulty: i % 4 === 0 ? "Hard" : i % 3 === 0 ? "Medium" : "Easy",
      timeTaken: ((i % 3) + 1) * 45, // seconds
    })),
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-2">
              <BookOpen className="h-6 w-6" />
              <span className="text-lg font-bold">OneClickSAT</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/student/dashboard">
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive asChild>
                  <Link href="/student/exam-results">
                    <FileText className="h-5 w-5" />
                    <span>Exam Results</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/student/dashboard">
                    <BarChart3 className="h-5 w-5" />
                    <span>Progress</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/student/dashboard">
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/student/dashboard">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/login">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger />
            <div className="w-full flex-1">
              <div className="flex items-center gap-2">
                <Link href="/student/dashboard">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back
                  </Button>
                </Link>
                <h1 className="text-lg font-semibold">Exam Results: {examResult.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Download className="mr-1 h-4 w-4" />
                Export PDF
              </Button>
              <div className="h-8 w-8 rounded-full bg-gray-200"></div>
            </div>
          </header>
          <main className="flex-1 p-4 lg:p-6">
            <div className="mx-auto max-w-5xl space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {examResult.score}/{examResult.maxScore}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((examResult.score / examResult.maxScore) * 100)}% correct
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Time Taken</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{examResult.timeTaken}</div>
                    <p className="text-xs text-muted-foreground">Completed on {examResult.date}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Correct Answers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {examResult.questions.filter((q) => q.userAnswer === q.correctAnswer).length}/
                      {examResult.questions.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(
                        (examResult.questions.filter((q) => q.userAnswer === q.correctAnswer).length /
                          examResult.questions.length) *
                          100,
                      )}
                      % accuracy
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Time per Question</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round(
                        examResult.questions.reduce((acc, q) => acc + q.timeTaken, 0) / examResult.questions.length,
                      )}
                      s
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Fastest: {Math.min(...examResult.questions.map((q) => q.timeTaken))}s
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="overview" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="sections">Sections</TabsTrigger>
                  <TabsTrigger value="questions">Questions</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Summary</CardTitle>
                      <CardDescription>Your overall performance on this exam</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Overall Score</span>
                          <span className="text-sm font-medium">
                            {Math.round((examResult.score / examResult.maxScore) * 100)}%
                          </span>
                        </div>
                        <Progress value={(examResult.score / examResult.maxScore) * 100} className="h-2" />
                      </div>

                      <h3 className="text-lg font-medium">Topic Performance</h3>
                      <div className="space-y-4">
                        {examResult.topics.map((topic, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{topic.name}</span>
                              <span className="text-sm font-medium">{topic.percentage}%</span>
                            </div>
                            <Progress value={topic.percentage} className="h-2" />
                            <p className="text-xs text-gray-500">
                              {topic.correct} correct out of {topic.total} questions
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recommendations</CardTitle>
                      <CardDescription>Areas to focus on for improvement</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="rounded-lg border p-4">
                          <h3 className="mb-2 font-medium">Focus Areas</h3>
                          <ul className="space-y-2">
                            {examResult.topics
                              .sort((a, b) => a.percentage - b.percentage)
                              .slice(0, 2)
                              .map((topic, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <div className="rounded-full bg-red-100 p-1 text-red-600">
                                    <X className="h-3 w-3" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{topic.name}</p>
                                    <p className="text-sm text-gray-500">
                                      {topic.percentage}% accuracy. Recommended study time:{" "}
                                      {Math.round((100 - topic.percentage) / 10)} hours
                                    </p>
                                  </div>
                                </li>
                              ))}
                          </ul>
                        </div>

                        <div className="rounded-lg border p-4">
                          <h3 className="mb-2 font-medium">Strengths</h3>
                          <ul className="space-y-2">
                            {examResult.topics
                              .sort((a, b) => b.percentage - a.percentage)
                              .slice(0, 2)
                              .map((topic, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <div className="rounded-full bg-green-100 p-1 text-green-600">
                                    <Check className="h-3 w-3" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{topic.name}</p>
                                    <p className="text-sm text-gray-500">{topic.percentage}% accuracy</p>
                                  </div>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="sections" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Section Performance</CardTitle>
                      <CardDescription>Your performance across different sections of the exam</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {examResult.sections.map((section, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{section.name}</h3>
                              <p className="text-sm text-gray-500">
                                {section.score} out of {section.maxScore} points
                              </p>
                            </div>
                            <span className="text-sm font-medium">{section.percentage}%</span>
                          </div>
                          <Progress value={section.percentage} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Time Distribution</CardTitle>
                      <CardDescription>How you spent your time across sections</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <Clock className="mx-auto h-16 w-16 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">Time distribution visualization</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="questions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Question Analysis</CardTitle>
                      <CardDescription>Detailed breakdown of each question</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {examResult.questions.map((question, i) => (
                        <div key={i} className="space-y-2 border-b pb-4 last:border-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Question {question.id}</span>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    question.userAnswer === question.correctAnswer
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {question.userAnswer === question.correctAnswer ? "Correct" : "Incorrect"}
                                </span>
                                <span className="text-xs text-gray-500">{question.topic}</span>
                                <span className="text-xs text-gray-500">{question.difficulty}</span>
                              </div>
                              <p className="mt-1 text-sm">{question.text}</p>
                            </div>
                            <div className="ml-4 flex items-center gap-2 text-sm">
                              <div className="flex flex-col items-center">
                                <span className="text-xs text-gray-500">Your Answer</span>
                                <div
                                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                    question.userAnswer === question.correctAnswer
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {question.userAnswer.toUpperCase()}
                                </div>
                              </div>
                              {question.userAnswer !== question.correctAnswer && (
                                <div className="flex flex-col items-center">
                                  <span className="text-xs text-gray-500">Correct</span>
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-800">
                                    {question.correctAnswer.toUpperCase()}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          {question.userAnswer !== question.correctAnswer && (
                            <div className="mt-2 rounded-lg bg-gray-50 p-3 text-sm">
                              <p className="font-medium">Explanation:</p>
                              <p>{question.explanation}</p>
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Time: {question.timeTaken} seconds</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
