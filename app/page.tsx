"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Target, Clock, Brain, ChartBar } from "lucide-react"
import { useEffect } from "react"

export default function LandingPage() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session && !session.user?.type) {
      router.push("/select-role")
    }
  }, [session, router])

  const features = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Targeted Practice",
      description: "Personalized SAT practice tests tailored to your needs",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Time Management",
      description: "Learn to manage your time effectively with realistic test conditions",
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Smart Analytics",
      description: "Get detailed insights into your performance and progress",
    },
    {
      icon: <ChartBar className="h-6 w-6" />,
      title: "Progress Tracking",
      description: "Track your improvement over time with comprehensive reports",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Master the SAT with
              <span className="text-blue-600 dark:text-blue-400"> OneClickSAT</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              The most comprehensive SAT preparation platform for students and instructors.
              Practice smarter, not harder.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {session ? (
                session.user?.type ? (
                  <Link href={session.user.type === "instructor" ? "/instructor" : "/student"}>
                    <Button size="lg">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/select-role">
                    <Button size="lg">
                      Choose Your Role
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )
              ) : (
                <>
                  <Link href="/register">
                    <Button size="lg">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose OneClickSAT?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-lg border bg-white dark:bg-gray-800"
              >
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4 dark:bg-blue-900 dark:text-blue-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits</h2>
          <div className="max-w-3xl mx-auto">
            <ul className="space-y-4">
              {[
                "Comprehensive test preparation with real SAT-style questions",
                "Detailed performance analytics and progress tracking",
                "Personalized study plans based on your strengths and weaknesses",
                "Expert-designed practice tests and study materials",
                "Flexible learning paths for different learning styles",
              ].map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your SAT Journey?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of students who have improved their SAT scores with OneClickSAT.
          </p>
          {!session && (
            <Link href="/register">
              <Button size="lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
