"use client"

import { useEffect, useState, use } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatCard } from "@/components/stat-card"
import { CopyButton } from "@/components/copy-button"
import { CodeBlock } from "@/components/code-block"
import { QualityScoreBadge } from "@/components/quality-score-badge"
import { ActionBadge } from "@/components/action-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, AlertTriangle, CheckCircle2, XCircle, FileText, RefreshCw } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface FormDetailsProps {
  params: Promise<{ id: string }>
}

export default function FormDetailsPage({ params }: FormDetailsProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [form, setForm] = useState<any>(null)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formData, submissionsData, analyticsData] = await Promise.all([
          api.forms.get(resolvedParams.id),
          api.submissions.list({ formId: resolvedParams.id, limit: 10 }),
          api.forms.getAnalytics(resolvedParams.id),
        ])
        setForm(formData.form)
        setSubmissions(submissionsData.submissions || [])
        setAnalytics(analyticsData.analytics)
      } catch (error) {
        console.error("[v0] Failed to fetch form details:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load form details",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [resolvedParams.id, toast])

  const handleRegenerateKey = async () => {
    if (!confirm("Are you sure you want to regenerate the API key? The old key will stop working immediately.")) {
      return
    }

    try {
      const data = await api.forms.regenerateKey(resolvedParams.id)
      setForm({ ...form, apiKey: data.apiKey })
      toast({
        title: "API key regenerated",
        description: "Your new API key is ready to use",
      })
    } catch (error) {
      console.error("[v0] Failed to regenerate key:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to regenerate API key",
      })
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${form.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      await api.forms.delete(resolvedParams.id)
      toast({
        title: "Form deleted",
        description: "The form has been deleted successfully",
      })
      router.push("/forms")
    } catch (error) {
      console.error("[v0] Failed to delete form:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete form",
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

  if (!form) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="text-center py-12">
            <p className="text-gray-600">Form not found</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  const installCode = `<script src="https://cdn.formguard.com/sdk/v1/formguard.js"></script>
<script>
  FormGuard.init('${form.apiKey}');
  
  // Your form submission
  FormGuard.submit({
    email: email,
    fields: { name, company }
  });
</script>`

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{form.name}</h1>
              <p className="text-gray-600 mt-1">{form.domain}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                Delete
              </Button>
            </div>
          </div>

          {/* API Key Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>API Key</CardTitle>
                <Button variant="outline" size="sm" onClick={handleRegenerateKey}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <code className="flex-1 px-4 py-3 bg-gray-50 rounded-lg text-sm font-mono">{form.apiKey}</code>
                <CopyButton text={form.apiKey} />
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Submissions"
              value={form.stats?.totalSubmissions || 0}
              icon={<FileText className="w-6 h-6 text-blue-600" />}
            />
            <StatCard
              title="Average Quality Score"
              value={form.stats?.avgQualityScore || 0}
              icon={<CheckCircle2 className="w-6 h-6 text-green-600" />}
            />
            <StatCard
              title="Flagged"
              value={form.stats?.flaggedSubmissions || 0}
              icon={<AlertTriangle className="w-6 h-6 text-yellow-600" />}
            />
            <StatCard
              title="Blocked"
              value={form.stats?.blockedSubmissions || 0}
              icon={<XCircle className="w-6 h-6 text-red-600" />}
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="submissions" className="space-y-6">
            <TabsList>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="installation">Installation</TabsTrigger>
            </TabsList>

            <TabsContent value="submissions">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Submissions</CardTitle>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/submissions?formId=${form._id}`}>View all</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {submissions.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No submissions yet</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions.map((submission) => (
                          <TableRow key={submission._id}>
                            <TableCell className="font-medium">{submission.email}</TableCell>
                            <TableCell>
                              <QualityScoreBadge score={submission.qualityScore} />
                            </TableCell>
                            <TableCell>
                              <ActionBadge action={submission.action} />
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {new Date(submission.createdAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Drop-offs by Step</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={analytics?.dropOffsByStep || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="_id"
                          stroke="#6b7280"
                          fontSize={12}
                          label={{ value: "Step", position: "insideBottom", offset: -5 }}
                        />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Field Errors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={analytics?.fieldErrors || []} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" stroke="#6b7280" fontSize={12} />
                        <YAxis dataKey="_id" type="category" stroke="#6b7280" fontSize={12} width={80} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#ef4444" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Submissions Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics?.submissionsOverTime || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="_id" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: "#3b82f6" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="avgScore"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ fill: "#10b981" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="installation">
              <Card>
                <CardHeader>
                  <CardTitle>SDK Installation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Add the FormGuard SDK to your website:</h4>
                    <CodeBlock code={installCode} language="html" />
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <strong>Note:</strong> Replace the email and fields with your actual form data. The SDK will
                      automatically track and score submissions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
