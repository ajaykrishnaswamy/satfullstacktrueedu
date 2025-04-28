"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function CreateExam() {
  const [sections, setSections] = useState([
    { name: "Reading", questions: 52, timeInMinutes: 65 },
    { name: "Writing", questions: 44, timeInMinutes: 35 },
    { name: "Math (No Calculator)", questions: 20, timeInMinutes: 25 },
    { name: "Math (Calculator)", questions: 38, timeInMinutes: 55 }
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create New Exam</h2>
        <p className="text-muted-foreground">
          Create a new SAT practice test for your students
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details of your practice test
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Test Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Practice Test #1"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter a description of the test"
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="isPublic" />
                <Label htmlFor="isPublic">Make this test public</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Sections</CardTitle>
            <CardDescription>
              Configure the sections of your practice test
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sections.map((section, index) => (
                <div key={index} className="grid gap-4 md:grid-cols-3 items-end border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-2">
                    <Label>Section Name</Label>
                    <Input 
                      value={section.name}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Questions</Label>
                    <Input 
                      type="number"
                      value={section.questions}
                      onChange={(e) => {
                        const newSections = [...sections]
                        newSections[index].questions = parseInt(e.target.value)
                        setSections(newSections)
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time (minutes)</Label>
                    <Input 
                      type="number"
                      value={section.timeInMinutes}
                      onChange={(e) => {
                        const newSections = [...sections]
                        newSections[index].timeInMinutes = parseInt(e.target.value)
                        setSections(newSections)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Settings</CardTitle>
            <CardDescription>
              Configure additional test settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Difficulty Level</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="enableTimer" defaultChecked />
                <Label htmlFor="enableTimer">Enable section timers</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="showAnswers" />
                <Label htmlFor="showAnswers">Show answers after submission</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button variant="outline">Save as Draft</Button>
          <Button type="submit">Create Test</Button>
        </div>
      </form>
    </div>
  )
} 