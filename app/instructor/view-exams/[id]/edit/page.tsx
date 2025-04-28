"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Plus, Trash2 } from "lucide-react"
import { SATTest } from '@/types/sat'
import { toast } from 'sonner'
import { Separator } from "@/components/ui/separator"

interface Question {
  id: number
  type: "reading" | "listening" | "writing"
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  passage?: string
}

export default function EditExam() {
  const params = useParams()
  const router = useRouter()
  const [test, setTest] = useState<SATTest | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await fetch(`/api/sat-tests/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch test')
        }
        const data = await response.json()
        setTest(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch test')
      } finally {
        setLoading(false)
      }
    }

    fetchTest()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!test) return

    setSaving(true)
    try {
      const response = await fetch(`/api/sat-tests/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(test),
      })

      if (!response.ok) {
        throw new Error('Failed to update test')
      }

      toast.success('Test updated successfully')
      router.push('/instructor/view-exams')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update test')
    } finally {
      setSaving(false)
    }
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    if (!test) return
    const newQuestions = [...test.questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    setTest({ ...test, questions: newQuestions })
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    if (!test) return
    const newQuestions = [...test.questions]
    const newOptions = [...newQuestions[questionIndex].options]
    newOptions[optionIndex] = value
    newQuestions[questionIndex] = { ...newQuestions[questionIndex], options: newOptions }
    setTest({ ...test, questions: newQuestions })
  }

  const addQuestion = () => {
    if (!test) return
    const newQuestion: Question = {
      id: Math.max(0, ...test.questions.map((q: Question) => q.id)) + 1,
      type: "reading",
      options: ["", "", "", ""],
      question: "",
      explanation: "",
      correctAnswer: "A"
    }
    setTest({ ...test, questions: [...test.questions, newQuestion] })
  }

  const removeQuestion = (index: number) => {
    if (!test) return
    const newQuestions = test.questions.filter((_: Question, i: number) => i !== index)
    setTest({ ...test, questions: newQuestions })
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !test) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error || 'Test not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/instructor/view-exams')}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Tests
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Edit Test</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Edit the basic details of your practice test
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Test Name</Label>
                <Input
                  id="name"
                  value={test.name}
                  onChange={(e) => setTest({ ...test, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={test.status}
                  onValueChange={(value) => setTest({ ...test, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="unpublished">Unpublished</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="total_time">Total Time (minutes)</Label>
                <Input
                  id="total_time"
                  type="number"
                  value={test.total_time}
                  onChange={(e) => setTest({ ...test, total_time: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
            <CardDescription>
              Edit test questions and answers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {test.questions.map((question: Question, index: number) => (
              <div key={question.id} className="space-y-4 border-b pb-6 last:border-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Question {index + 1}</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => removeQuestion(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Question Type</Label>
                    <Select
                      value={question.type}
                      onValueChange={(value) => updateQuestion(index, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reading">Reading</SelectItem>
                        <SelectItem value="writing">Writing</SelectItem>
                        <SelectItem value="math_no_calc">Math (No Calculator)</SelectItem>
                        <SelectItem value="math_calc">Math (Calculator)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(question.type === 'reading' || question.type === 'writing') && (
                    <div className="grid gap-2">
                      <Label>Passage</Label>
                      <Textarea
                        value={question.passage || ''}
                        onChange={(e) => updateQuestion(index, 'passage', e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label>Question Text</Label>
                    <Textarea
                      value={question.question}
                      onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Answer Options</Label>
                    <div className="space-y-2">
                      {question.options.map((option: string, optIndex: number) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <span className="text-sm font-medium w-8">
                            {String.fromCharCode(65 + optIndex)})
                          </span>
                          <Input
                            value={option}
                            onChange={(e) => updateOption(index, optIndex, e.target.value)}
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Correct Answer</Label>
                    <Select
                      value={question.correctAnswer}
                      onValueChange={(value) => updateQuestion(index, 'correctAnswer', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        {['A', 'B', 'C', 'D'].map((letter) => (
                          <SelectItem key={letter} value={letter}>
                            Option {letter}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Explanation</Label>
                    <Textarea
                      value={question.explanation}
                      onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                      className="min-h-[100px]"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={addQuestion}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/instructor/view-exams')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
} 