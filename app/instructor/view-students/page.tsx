"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Mail, BookOpen, Clock, GraduationCap, X, Pencil } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from 'sonner'
import type { Student } from '@/types/student'
import type { SATTest } from '@/types/sat'
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface TestAttempt {
  id: string
  test_name: string
  score: number
  status: string
  date: string
}

export default function ViewStudents() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [progressFilter, setProgressFilter] = useState("all")
  const [sortBy, setSortBy] = useState("score")
  const [addStudentOpen, setAddStudentOpen] = useState(false)
  const [assignExamOpen, setAssignExamOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [availableExams, setAvailableExams] = useState<SATTest[]>([])
  const [selectedExams, setSelectedExams] = useState<string[]>([])
  const [examDetails, setExamDetails] = useState<{[key: string]: SATTest}>({})
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null)
  const [studentAttempts, setStudentAttempts] = useState<{[key: string]: any[]}>({})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })
  const [editStudentOpen, setEditStudentOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
  })

  useEffect(() => {
    fetchStudents()
    fetchExams()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')
      if (!response.ok) {
        throw new Error('Failed to fetch students')
      }
      const data = await response.json()
      setStudents(data)
      
      // Fetch exam details for all assigned exams
      const allExamIds = new Set<string>()
      data.forEach((student: Student) => {
        if (student.student_exams) {
          student.student_exams.forEach((examId: string) => allExamIds.add(examId))
        }
      })
      
      if (allExamIds.size > 0) {
        const examResponse = await fetch('/api/sat-tests')
        if (!examResponse.ok) {
          throw new Error('Failed to fetch exam details')
        }
        const examData = await examResponse.json()
        const examMap = examData.reduce((acc: {[key: string]: SATTest}, exam: SATTest) => {
          acc[exam.id] = exam
          return acc
        }, {})
        setExamDetails(examMap)
      }
    } catch (error) {
      toast.error('Failed to fetch students')
    } finally {
      setLoading(false)
    }
  }

  const fetchExams = async () => {
    try {
      const response = await fetch('/api/sat-tests')
      if (!response.ok) {
        throw new Error('Failed to fetch exams')
      }
      const data = await response.json()
      setAvailableExams(data)
    } catch (error) {
      toast.error('Failed to fetch exams')
    }
  }

  const fetchStudentAttempts = async (studentId: string) => {
    try {
      const response = await fetch(`/api/student-test-attempts?studentId=${studentId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch student attempts')
      }
      const data = await response.json()
      setStudentAttempts(prev => ({
        ...prev,
        [studentId]: data
      }))
    } catch (error) {
      toast.error('Failed to fetch student attempts')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to add student')
      }

      toast.success('Student added successfully')
      setAddStudentOpen(false)
      setFormData({ name: '', email: '' })
      fetchStudents()
    } catch (error) {
      toast.error('Failed to add student')
    }
  }

  const handleAssignExams = async () => {
    if (!selectedStudent || selectedExams.length === 0) return

    try {
      const response = await fetch('/api/student-exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentIds: [selectedStudent.id],
          examIds: selectedExams,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to assign exams')
      }

      toast.success('Exams assigned successfully')
      setAssignExamOpen(false)
      setSelectedExams([])
      setSelectedStudent(null)
      fetchStudents()
    } catch (error) {
      toast.error('Failed to assign exams')
    }
  }

  const handleUnassignExam = async (studentId: string, examId: string) => {
    try {
      const response = await fetch(`/api/student-exams?studentId=${studentId}&examId=${examId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to unassign exam')
      }

      toast.success('Exam unassigned successfully')
      fetchStudents()
    } catch (error) {
      toast.error('Failed to unassign exam')
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStudent) return

    try {
      const response = await fetch(`/api/students/${selectedStudent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      })

      if (!response.ok) {
        throw new Error('Failed to update student')
      }

      toast.success('Student updated successfully')
      setEditStudentOpen(false)
      setSelectedStudent(null)
      fetchStudents()
    } catch (error) {
      toast.error('Failed to update student')
    }
  }

  // Filter students
  const filteredStudents = students
    .filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })

  // Get unassigned exams for the selected student
  const getUnassignedExams = (student: Student) => {
    if (!student?.student_exams) return availableExams;
    return availableExams.filter(exam => !student.student_exams.includes(exam.id.toString()));
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground">
            Manage and monitor your students' progress
          </p>
        </div>
        <Dialog open={addStudentOpen} onOpenChange={setAddStudentOpen}>
          <DialogTrigger asChild>
            <Button>Add Student</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Add Student</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search students..." 
                className="flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={progressFilter} onValueChange={setProgressFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by progress" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Progress</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="improving">Improving</SelectItem>
                <SelectItem value="needs-help">Needs Help</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Highest Score</SelectItem>
                <SelectItem value="recent">Recently Active</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <div className="space-y-4">
        {filteredStudents.map((student) => {
          const studentExams = student.student_exams || []
          const hasAssignedExams = studentExams.length > 0

          return (
            <Card key={student.id}>
              <CardContent className="p-6">
                <div 
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => {
                    if (expandedStudent === student.id) {
                      setExpandedStudent(null)
                    } else {
                      setExpandedStudent(student.id)
                      fetchStudentAttempts(student.id)
                    }
                  }}
                >
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{student.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{student.email}</span>
                    </div>
                    {hasAssignedExams && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Assigned Exams</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {studentExams.map((examId: string) => (
                            <Badge 
                              key={examId} 
                              variant="secondary"
                              className="flex items-center gap-1 pr-1"
                            >
                              <span className="py-0.5">{examDetails[examId]?.name || `Exam ${examId}`}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 rounded-full hover:bg-muted"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleUnassignExam(student.id, examId)
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={editStudentOpen && selectedStudent?.id === student.id}
                            onOpenChange={(open) => {
                              setEditStudentOpen(open)
                              if (open && student) {
                                setSelectedStudent(student)
                                setEditFormData({
                                  name: student.name,
                                  email: student.email,
                                })
                              } else {
                                setSelectedStudent(null)
                              }
                            }}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Student Information</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                              id="edit-name"
                              value={editFormData.name}
                              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                              id="edit-email"
                              type="email"
                              value={editFormData.email}
                              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                              required
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setEditStudentOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">
                              Save Changes
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Dialog open={assignExamOpen && selectedStudent?.id === student.id} 
                            onOpenChange={(open) => {
                              setAssignExamOpen(open)
                              if (!open) {
                                setSelectedStudent(null)
                                setSelectedExams([])
                              }
                            }}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedStudent(student)
                          }}
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Assign Exams
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign Exams to {selectedStudent?.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            {selectedStudent && getUnassignedExams(selectedStudent).map((exam) => (
                              <div key={exam.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`exam-${exam.id}`}
                                  checked={selectedExams.includes(exam.id.toString())}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedExams(prev => [...prev, exam.id.toString()])
                                    } else {
                                      setSelectedExams(prev => prev.filter(id => id !== exam.id.toString()))
                                    }
                                  }}
                                />
                                <Label htmlFor={`exam-${exam.id}`}>{exam.name}</Label>
                              </div>
                            ))}
                            {selectedStudent && getUnassignedExams(selectedStudent).length === 0 && (
                              <div className="text-center py-4 text-muted-foreground">
                                No exams available to assign
                              </div>
                            )}
                          </div>
                          <div className="flex justify-end">
                            <Button 
                              onClick={handleAssignExams}
                              disabled={selectedExams.length === 0}
                            >
                              Assign Selected Exams
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Expanded Test Attempts Section */}
                {expandedStudent === student.id && (
                  <div className="mt-6 border-t pt-4">
                    <h4 className="text-sm font-medium mb-3">Test Attempts</h4>
                    {studentAttempts[student.id] ? (
                      studentAttempts[student.id].length > 0 ? (
                        <div className="space-y-3">
                          {studentAttempts[student.id].map((attempt, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-3">
                              <div className="grid grid-cols-4 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">Test</p>
                                  <p className="text-sm font-medium">{examDetails[attempt.test_id]?.name || `Test ${attempt.test_id}`}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Score</p>
                                  <p className="text-sm font-medium">{attempt.score}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Status</p>
                                  <p className="text-sm font-medium">{attempt.status}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Date</p>
                                  <p className="text-sm font-medium">
                                    {new Date(attempt.start_time).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No test attempts yet</p>
                      )
                    ) : (
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 grid gap-4 md:grid-2">
                  <div>
                    <p className="text-sm font-medium">Joined</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(student.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Active</p>
                    <p className="text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1 inline-block" />
                      Just now
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {filteredStudents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No students found
          </div>
        )}
      </div>
    </div>
  )
} 