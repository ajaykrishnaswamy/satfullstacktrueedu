"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { SATTest } from '@/types/sat'
import { Separator } from "@/components/ui/separator"

interface Question {
  id: number
  type: string
  options: string[]
  passage?: string
  question: string
  explanation: string
  correctAnswer: string
}

export default function PreviewExam() {
  const params = useParams()
  const router = useRouter()
  const [test, setTest] = useState<SATTest | null>(null)
  const [loading, setLoading] = useState(true)
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
          <h2 className="text-3xl font-bold tracking-tight">{test.name}</h2>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <h3 className="font-medium">Status</h3>
              <p className="text-muted-foreground">{test.status}</p>
            </div>
            <div>
              <h3 className="font-medium">Total Time</h3>
              <p className="text-muted-foreground">{test.total_time} minutes</p>
            </div>
            <div>
              <h3 className="font-medium">Sections</h3>
              <div className="space-y-2">
                {test.sections.map((section: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium">{section.type}</h4>
                    <p className="text-sm text-muted-foreground">
                      {section.questions?.length || 0} questions
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {test.questions.map((question: Question, index: number) => (
              <div key={question.id} className="space-y-4">
                {/* Question Number */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Question {index + 1}</h3>
                  <span className="text-sm text-muted-foreground capitalize">
                    {question.type}
                  </span>
                </div>

                {/* Passage */}
                {question.passage && (
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <h4 className="font-medium">Passage:</h4>
                    <p className="text-sm">{question.passage}</p>
                  </div>
                )}

                {/* Question Text */}
                <div className="space-y-2">
                  <h4 className="font-medium">Question:</h4>
                  <p>{question.question}</p>
                </div>

                {/* Answer Options */}
                <div className="space-y-2">
                  <h4 className="font-medium">Options:</h4>
                  <div className="grid gap-2">
                    {question.options.map((option: string, optIndex: number) => (
                      <div 
                        key={optIndex} 
                        className={`p-3 rounded-lg border ${
                          String.fromCharCode(65 + optIndex) === question.correctAnswer 
                            ? 'border-green-500 bg-green-50' 
                            : ''
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{option}</span>
                          {String.fromCharCode(65 + optIndex) === question.correctAnswer && (
                            <span className="ml-auto text-sm text-green-600">Correct Answer</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                {question.explanation && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Explanation:</h4>
                    <p className="text-sm text-muted-foreground">{question.explanation}</p>
                  </div>
                )}

                {index < test.questions.length - 1 && (
                  <Separator className="my-6" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 