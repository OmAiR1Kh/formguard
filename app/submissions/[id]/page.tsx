"use client"

import { useEffect, useState, use } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { QualityScoreBadge } from "@/components/quality-score-badge"
import { ActionBadge } from "@/components/action-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Shield, Wifi, Mail, Users, Clock, CheckCircle2, XCircle } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface SubmissionDetailsProps {
  params: Promise<{ id: string }>
}

export default function SubmissionDetailsPage({ params }: SubmissionDetailsProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [submission, setSubmission] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const data = await api.submissions.get(resolvedParams.id)
        setSubmission(data.submission)
      } catch (error) {
        console.error("[v0] Failed to fetch submission:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load submission details",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSubmission()
  }, [resolvedParams.id, toast])

  const handleActionChange = async (newAction: string) => {
    try {
      await api.submissions.update(resolvedParams.id, { action: newAction })
      setSubmission({ ...submission, action: newAction })
      toast({
        title: "Action updated",
        description: `Submission has been marked as ${newAction}`,
      })
    } catch (error) {
      console.error("[v0] Failed to update action:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update action",
      })
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this submission? This action cannot be undone.")) {
      return
    }

    try {
      await api.submissions.delete(resolvedParams.id)
      toast({
        title: "Submission deleted",
        description: "The submission has been deleted successfully",
      })
      router.push("/submissions")
    } catch (error) {
      console.error("[v0] Failed to delete submission:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete submission",
      })
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (!submission) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="text-center py-12">
            <p className="text-gray-600">Submission not found</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  // Mock quality score breakdown
  const scoreBreakdown = [
    { name: "Email verification", impact: 10 },
    { name: "IP reputation", impact: 15 },
    { name: "Completion time", impact: -5 },
    { name: "Device fingerprint", impact: 20 },
    { name: "Behavior patterns", impact: 25 },
    { name: "Geographic location", impact: 18 },
  ]

  // Mock timeline events
  const timeline = [
    { event: "Form started", timestamp: "2026-01-01T12:00:00Z" },
    { event: "Step 1 completed", timestamp: "2026-01-01T12:00:15Z" },
    { event: "Step 2 completed", timestamp: "2026-01-01T12:00:30Z" },
    { event: "Form submitted", timestamp: "2026-01-01T12:00:45Z" },
  ]

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" asChild>
                <Link href="/submissions">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{submission.email}</h1>
                <p className="text-gray-600 mt-1">Submission details</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={submission.action} onValueChange={handleActionChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allowed">Allow</SelectItem>
                  <SelectItem value="flagged">Flag</SelectItem>
                  <SelectItem value="blocked">Block</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>

          {/* Quality Score Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900 mb-2">{submission.qualityScore}</div>
                    <QualityScoreBadge score={submission.qualityScore} className="text-sm" />
                  </div>
                  <div className="h-16 w-px bg-gray-200" />
                  <ActionBadge action={submission.action} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Submission Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Form Name</p>
                    <p className="text-gray-900">{submission.formName || "Unknown Form"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                    <p className="text-gray-900">{submission.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">IP Address</p>
                    <p className="text-gray-900">{submission.ip}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Location</p>
                    <p className="text-gray-900">
                      {submission.city}, {submission.country}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Device</p>
                    <p className="text-gray-900">{submission.device}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Browser</p>
                    <p className="text-gray-900">{submission.browser}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Completion Time</p>
                    <p className="text-gray-900">{submission.completionTime} seconds</p>
                  </div>
                </CardContent>
              </Card>

              {/* Form Fields */}
              <Card>
                <CardHeader>
                  <CardTitle>Form Fields</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(submission.fields || {}).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm font-medium text-gray-500 mb-1">{key}</p>
                      <p className="text-gray-900">{String(value)}</p>
                    </div>
                  ))}
                  {Object.keys(submission.fields || {}).length === 0 && (
                    <p className="text-sm text-gray-500">No additional fields submitted</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quality Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {scoreBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.name}</span>
                        <Badge variant={item.impact >= 0 ? "default" : "destructive"} className="font-semibold">
                          {item.impact > 0 ? "+" : ""}
                          {item.impact}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Flags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">VPN detected</span>
                      </div>
                      {submission.flags.vpn ? (
                        <CheckCircle2 className="w-5 h-5 text-red-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Proxy detected</span>
                      </div>
                      {submission.flags.proxy ? (
                        <CheckCircle2 className="w-5 h-5 text-red-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Disposable email</span>
                      </div>
                      {submission.flags.disposableEmail ? (
                        <CheckCircle2 className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Duplicate submission</span>
                      </div>
                      {submission.flags.duplicate ? (
                        <CheckCircle2 className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Fast completion</span>
                      </div>
                      {submission.flags.fastCompletion ? (
                        <CheckCircle2 className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timeline.map((item, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          {index < timeline.length - 1 && <div className="w-px h-full bg-gray-200" />}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="text-sm font-medium text-gray-900">{item.event}</p>
                          <p className="text-xs text-gray-500 mt-1">{new Date(item.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
