"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, ChevronDown, FileText, Home, LogOut, Plus, Settings, Trash2, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Textarea } from "@/components/ui/textarea"

export default function CreateExamPage() {
  const [sections, setSections] = useState([{ id: 1, title: "Section 1", questions: [] }])

  const addSection = () => {
    const newId = sections.length + 1
    setSections([...sections, { id: newId, title: `Section ${newId}`, questions: [] }])
  }

  const removeSection = (id) => {
    if (sections.length > 1) {
      setSections(sections.filter((section) => section.id !== id))
    }
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
                  <Link href="/instructor/dashboard">
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive asChild>
                  <Link href="/instructor/dashboard/create-exam">
                    <FileText className="h-5 w-5" />
                    <span>Exams</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/instructor/dashboard">
                    <Users className="h-5 w-5" />
                    <span>Students</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/instructor/dashboard">
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
              <h1 className="text-lg font-semibold">Create New Exam</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                Help
              </Button>
              <div className="h-8 w-8 rounded-full bg-gray-200"></div>
            </div>
          </header>
          <main className="flex-1 p-4 lg:p-6">
            <div className="mx-auto max-w-4xl space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Exam Details</CardTitle>
                  <CardDescription>Enter the basic information for your exam</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="exam-title">Exam Title</Label>
                    <Input id="exam-title" placeholder="e.g., SAT Practice Test #5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter a description for this exam"
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time Limit</Label>
                    <RadioGroup defaultValue="timed" className="flex">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="timed" id="timed" />
                        <Label htmlFor="timed">Timed</Label>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <RadioGroupItem value="untimed" id="untimed" />
                        <Label htmlFor="untimed">Untimed</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hours">Hours</Label>
                      <Input type="number" id="hours" defaultValue="3" min="0" max="24" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minutes">Minutes</Label>
                      <Input type="number" id="minutes" defaultValue="0" min="0" max="59" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seconds">Seconds</Label>
                      <Input type="number" id="seconds" defaultValue="0" min="0" max="59" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sections</CardTitle>
                  <CardDescription>Create sections for your exam</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="1" className="w-full">
                    <div className="flex items-center justify-between">
                      <TabsList className="grid w-full max-w-md grid-cols-4">
                        {sections.map((section) => (
                          <TabsTrigger key={section.id} value={section.id.toString()}>
                            Section {section.id}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={addSection} disabled={sections.length >= 10}>
                          <Plus className="mr-1 h-4 w-4" />
                          Add Section
                        </Button>
                      </div>
                    </div>

                    {sections.map((section) => (
                      <TabsContent key={section.id} value={section.id.toString()} className="space-y-4 mt-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <Label htmlFor={`section-${section.id}-title`}>Section Title</Label>
                            <Input
                              id={`section-${section.id}-title`}
                              defaultValue={section.title}
                              className="max-w-md"
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeSection(section.id)}
                            disabled={sections.length <= 1}
                          >
                            <Trash2 className="mr-1 h-4 w-4" />
                            Remove Section
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Questions</Label>
                            <Button variant="outline" size="sm">
                              <Plus className="mr-1 h-4 w-4" />
                              Add Question
                            </Button>
                          </div>

                          <Card>
                            <CardHeader className="p-4">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Question 1</CardTitle>
                                <Button variant="ghost" size="sm">
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="question-type">Question Type</Label>
                                  <Select defaultValue="multiple-choice">
                                    <SelectTrigger id="question-type">
                                      <SelectValue placeholder="Select question type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                      <SelectItem value="fill-in-blank">Fill in the Blank</SelectItem>
                                      <SelectItem value="short-answer">Short Answer</SelectItem>
                                      <SelectItem value="essay">Essay</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="question-text">Question Text</Label>
                                  <Textarea
                                    id="question-text"
                                    placeholder="Enter your question here"
                                    className="min-h-[100px]"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Answer Options</Label>
                                  <div className="space-y-2">
                                    {["A", "B", "C", "D"].map((option) => (
                                      <div key={option} className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full border">
                                          {option}
                                        </div>
                                        <Input placeholder={`Option ${option}`} />
                                        <RadioGroupItem value={option} id={`option-${option}`} className="ml-2" />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="correct-answer">Correct Answer</Label>
                                  <Select defaultValue="a">
                                    <SelectTrigger id="correct-answer">
                                      <SelectValue placeholder="Select correct answer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="a">A</SelectItem>
                                      <SelectItem value="b">B</SelectItem>
                                      <SelectItem value="c">C</SelectItem>
                                      <SelectItem value="d">D</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="explanation">Explanation (Optional)</Label>
                                  <Textarea
                                    id="explanation"
                                    placeholder="Explain why this answer is correct"
                                    className="min-h-[100px]"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="difficulty">Difficulty</Label>
                                    <Select defaultValue="medium">
                                      <SelectTrigger id="difficulty">
                                        <SelectValue placeholder="Select difficulty" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="easy">Easy</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="hard">Hard</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="topic">Topic</Label>
                                    <Select defaultValue="algebra">
                                      <SelectTrigger id="topic">
                                        <SelectValue placeholder="Select topic" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="algebra">Algebra</SelectItem>
                                        <SelectItem value="geometry">Geometry</SelectItem>
                                        <SelectItem value="grammar">Grammar</SelectItem>
                                        <SelectItem value="reading">Reading Comprehension</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assign to Students</CardTitle>
                  <CardDescription>Select which students should take this exam</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Assignment Type</Label>
                    <RadioGroup defaultValue="all" className="flex">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all-students" />
                        <Label htmlFor="all-students">All Students</Label>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <RadioGroupItem value="select" id="select-students" />
                        <Label htmlFor="select-students">Select Students</Label>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <RadioGroupItem value="groups" id="student-groups" />
                        <Label htmlFor="student-groups">Student Groups</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due-date">Due Date (Optional)</Label>
                    <Input type="date" id="due-date" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Save as Draft</Button>
                  <div className="flex gap-2">
                    <Button variant="outline">Preview</Button>
                    <Button>Publish Exam</Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
