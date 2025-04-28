"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit2, Trash2, Eye, BarChart2, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSATTests } from "@/hooks/useSATTests"
import { useState } from "react"
import { toast } from "sonner"

export default function ViewExams() {
  const router = useRouter()
  const { tests, loading, error } = useSATTests()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const handlePreview = (examId: number) => {
    router.push(`/instructor/view-exams/${examId}/preview`)
  }

  const handleEdit = (examId: number) => {
    router.push(`/instructor/view-exams/${examId}/edit`)
  }

  const handleDelete = async (examId: number) => {
    if (!confirm('Are you sure you want to delete this test? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/sat-tests/${examId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete test')
      }

      toast.success('Test deleted successfully')
      // Refresh the tests list
      window.location.reload()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete test')
    }
  }

  // Filter and sort tests
  const filteredTests = tests
    .filter(test => {
      const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" 
        ? true 
        : statusFilter === test.status
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      } else {
        return a.name.localeCompare(b.name)
      }
    })

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

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error loading tests: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Practice Tests</h2>
          <p className="text-muted-foreground">
            Manage your SAT practice tests
          </p>
        </div>
        <Link href="/instructor/create-exams">
          <Button>
            Create New Test
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search tests..." 
                className="flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select 
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Exams List */}
      <div className="space-y-4">
        {filteredTests.map((test) => (
          <Card key={test.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{test.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>Created {new Date(test.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{test.status}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handlePreview(test.id)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(test.id)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-600"
                    onClick={() => handleDelete(test.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Sections</p>
                  <p className="text-sm text-muted-foreground">
                    {test.sections.map((section: { type: string }) => section.type).join(", ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Time</p>
                  <p className="text-sm text-muted-foreground">
                    {test.total_time} minutes
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <Button variant="outline" size="sm" onClick={() => handlePreview(test.id)}>
                  <BarChart2 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 