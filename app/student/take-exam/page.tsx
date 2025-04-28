"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, BookOpen, Clock, Flag, Home, LogOut, Settings, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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

export default function TakeExamPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [flaggedQuestions, setFlaggedQuestions] = useState([])
  const [timeRemaining, setTimeRemaining] = useState(180 * 60) // 3 hours in seconds
  const [examComplete, setExamComplete] = useState(false)

  // Mock exam data
  const examData = {
    title: "SAT Practice Test #3",
    totalQuestions: 20,
    questions: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      text: `This is question ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?`,
      options: [
        { id: "a", text: "Option A for question " + (i + 1) },
        { id: "b", text: "Option B for question " + (i + 1) },
        { id: "c", text: "Option C for question " + (i + 1) },
        { id: "d", text: "Option D for question " + (i + 1) },
      ],
    })),
  }

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !examComplete) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && !examComplete) {
      setExamComplete(true)
    }
  }, [timeRemaining, examComplete])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleNextQuestion = () => {
    if (currentQuestion < examData.totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleAnswerSelect = (value) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: value,
    })
  }

  const toggleFlagQuestion = () => {
    if (flaggedQuestions.includes(currentQuestion)) {
      setFlaggedQuestions(flaggedQuestions.filter((q) => q !== currentQuestion))
    } else {
      setFlaggedQuestions([...flaggedQuestions, currentQuestion])
    }
  }

  const handleSubmitExam = () => {
    setExamComplete(true)
  }

  const navigateToQuestion = (index) => {
    setCurrentQuestion(index)
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
                <SidebarMenuButton asChild>
                  <Link href="/student/dashboard">
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/student/dashboard">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t">
            <SidebarMenu>
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
              <h1 className="text-lg font-semibold">{examData.title}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1.5">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">{formatTime(timeRemaining)}</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-gray-200"></div>
            </div>
          </header>
          <main className="flex-1 p-4 lg:p-6">
            {!examComplete ? (
              <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      Question {currentQuestion + 1} of {examData.totalQuestions}
                    </span>
                  </div>
                  <Button
                    variant={flaggedQuestions.includes(currentQuestion) ? "default" : "outline"}
                    size="sm"
                    onClick={toggleFlagQuestion}
                  >
                    <Flag className="mr-1 h-4 w-4" />
                    {flaggedQuestions.includes(currentQuestion) ? "Flagged" : "Flag for Review"}
                  </Button>
                </div>

                <Progress value={((currentQuestion + 1) / examData.totalQuestions) * 100} className="h-2" />

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">{examData.questions[currentQuestion].text}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={selectedAnswers[currentQuestion] || ""}
                      onValueChange={handleAnswerSelect}
                      className="space-y-4"
                    >
                      {examData.questions[currentQuestion].options.map((option) => (
                        <div key={option.id} className="flex items-start space-x-2">
                          <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                          <label
                            htmlFor={`option-${option.id}`}
                            className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-gray-50"
                          >
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border font-medium">
                              {option.id.toUpperCase()}
                            </div>
                            <span>{option.text}</span>
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
                      <ArrowLeft className="mr-1 h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleNextQuestion}
                      disabled={currentQuestion === examData.totalQuestions - 1}
                    >
                      Next
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>

                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Question Navigator</h2>
                  <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                    {Array.from({ length: examData.totalQuestions }, (_, i) => (
                      <Button
                        key={i}
                        variant={
                          currentQuestion === i
                            ? "default"
                            : flaggedQuestions.includes(i)
                              ? "destructive"
                              : selectedAnswers[i]
                                ? "outline"
                                : "ghost"
                        }
                        size="sm"
                        className="h-10 w-10"
                        onClick={() => navigateToQuestion(i)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button size="lg" onClick={handleSubmitExam}>
                    Submit Exam
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-4xl space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center text-2xl">Exam Complete!</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <p className="text-lg">Thank you for completing {examData.title}</p>
                      <p className="text-gray-500">Your results are being processed</p>
                    </div>
                    <div className="flex justify-center">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                        <svg
                          className="h-12 w-12 text-green-600"
                          fill="none"
                          height="24"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-center font-medium">Exam Summary</h3>
                      <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                        <div>
                          <p className="text-sm text-gray-500">Questions Answered</p>
                          <p className="text-lg font-medium">
                            {Object.keys(selectedAnswers).length} of {examData.totalQuestions}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Time Taken</p>
                          <p className="text-lg font-medium">{formatTime(180 * 60 - timeRemaining)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button asChild>
                      <Link href="/student/dashboard">View Results</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
