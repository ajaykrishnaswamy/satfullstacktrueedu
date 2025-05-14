"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { School, GraduationCap } from "lucide-react"
import { supabase } from '@/utils/supabase'

export default function SelectRole() {
  const router = useRouter()
  const { data: session, update } = useSession()

  if (!session) {
    router.push("/login")
    return null
  }

  const handleRoleSelect = async (role: "instructor" | "student") => {
    // Update the session with the selected role
    await update({
      ...session,
      user: {
        ...session.user,
        type: role
      }
    })

    // Update the user type in the database
    if (session?.user?.email) {
      console.log('Updating user with email:', session.user.email);
      const { data, error } = await supabase
        .from('users')
        .update({ type: role })
        .eq('email', session.user.email)
        .select();
      console.log('Supabase update result:', { data, error });
      if (error) {
        alert('Supabase update error: ' + error.message);
      }
      if (data && data.length === 0) {
        alert('No user row was updated. Check the email value.');
      }
    }

    // Redirect to the appropriate dashboard
    router.push(role === "instructor" ? "/instructor" : "/student")
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-3xl space-y-6 p-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Choose Your Role</h1>
          <p className="text-muted-foreground">
            Select how you would like to use OneClickSAT
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => handleRoleSelect("instructor")}>
            <CardHeader>
              <School className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle>I'm an Instructor</CardTitle>
              <CardDescription>
                Create and manage SAT practice tests, monitor student progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Create custom practice tests</li>
                <li>• Track student performance</li>
                <li>• Generate detailed reports</li>
                <li>• Manage multiple student groups</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => handleRoleSelect("student")}>
            <CardHeader>
              <GraduationCap className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle>I'm a Student</CardTitle>
              <CardDescription>
                Practice for the SAT with personalized tests and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Take practice tests</li>
                <li>• Get personalized feedback</li>
                <li>• Track your progress</li>
                <li>• View detailed explanations</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 