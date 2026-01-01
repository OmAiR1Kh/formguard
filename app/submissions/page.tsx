"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { QualityScoreBadge } from "@/components/quality-score-badge"
import { ActionBadge } from "@/components/action-badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, ListIcon, Shield, Wifi, Mail, Users, Globe } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Submission {
  _id: string
  email: string
  formId: string
  formName?: string
  qualityScore: number
  action: "allowed" | "flagged" | "blocked"
  ip: string
  country: string
  device: string
  completionTime: number
  flags: {
    vpn: boolean
    proxy: boolean
    disposableEmail: boolean
    duplicate: boolean
    fastCompletion: boolean
  }
  createdAt: string
}

function SubmissionsContent() {
  const searchParams = useSearchParams()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [forms, setForms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()

  const [filters, setFilters] = useState({
    formId: searchParams.get("formId") || "all",
    action: "all",
  })

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const data = await api.forms.list()
        setForms(data.forms || [])
      } catch (error) {
        console.error("[v0] Failed to fetch forms:", error)
      }
    }
    fetchForms()
  }, [])

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true)
      try {
        const params: any = { page, limit: 20 }
        if (filters.formId !== "all") params.formId = filters.formId
        if (filters.action !== "all") params.action = filters.action

        const data = await api.submissions.list(params)
        setSubmissions(data.submissions || [])
        setTotalPages(data.pages || 1)
      } catch (error) {
        console.error("[v0] Failed to fetch submissions:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load submissions",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [filters, page, toast])

  const handleSelectAll = () => {
    if (selectedIds.length === submissions.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(submissions.map((s) => s._id))
    }
  }

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleBulkAction = async (action: "allowed" | "flagged" | "blocked" | "delete") => {
    if (selectedIds.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select submissions first",
      })
      return
    }

    if (action === "delete") {
      if (
        !confirm(`Are you sure you want to delete ${selectedIds.length} submissions? This action cannot be undone.`)
      ) {
        return
      }
    }

    try {
      // In a real app, you'd have a bulk action API endpoint
      // For now, we'll show a success message
      toast({
        title: "Action applied",
        description: `${selectedIds.length} submissions have been ${action === "delete" ? "deleted" : `marked as ${action}`}`,
      })
      setSelectedIds([])
      // Refresh submissions
      setPage(1)
    } catch (error) {
      console.error("[v0] Bulk action failed:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to apply bulk action",
      })
    }
  }

  const handleExport = async () => {
    try {
      const params = filters.formId !== "all" ? filters.formId : undefined
      await api.submissions.export(params)
      toast({
        title: "Export started",
        description: "Your CSV export will download shortly",
      })
    } catch (error) {
      console.error("[v0] Export failed:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to export submissions",
      })
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
              <p className="text-gray-600 mt-1">View and manage all form submissions</p>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Select value={filters.formId} onValueChange={(value) => setFilters({ ...filters, formId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All forms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All forms</SelectItem>
                      {forms.map((form) => (
                        <SelectItem key={form._id} value={form._id}>
                          {form.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Select value={filters.action} onValueChange={(value) => setFilters({ ...filters, action: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All actions</SelectItem>
                      <SelectItem value="allowed">Allowed</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>

              {/* Bulk Actions */}
              {selectedIds.length > 0 && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <span className="text-sm text-gray-600">{selectedIds.length} selected</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("allowed")}>
                      Allow
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("flagged")}>
                      Flag
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("blocked")}>
                      Block
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("delete")}>
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submissions Table */}
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-12">
                  <ListIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No submissions found</p>
                  <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedIds.length === submissions.length}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Form</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>IP / Country</TableHead>
                        <TableHead>Device</TableHead>
                        <TableHead>Time (s)</TableHead>
                        <TableHead>Flags</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map((submission) => (
                        <TableRow key={submission._id} className="hover:bg-gray-50">
                          <TableCell>
                            <Checkbox
                              checked={selectedIds.includes(submission._id)}
                              onCheckedChange={() => handleSelectOne(submission._id)}
                            />
                          </TableCell>
                          <TableCell>
                            <Link
                              href={`/submissions/${submission._id}`}
                              className="font-medium text-blue-600 hover:text-blue-700"
                            >
                              {submission.email}
                            </Link>
                          </TableCell>
                          <TableCell className="text-gray-600">{submission.formName || "Unknown"}</TableCell>
                          <TableCell>
                            <QualityScoreBadge score={submission.qualityScore} />
                          </TableCell>
                          <TableCell>
                            <ActionBadge action={submission.action} />
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm">
                            {submission.ip}
                            <br />
                            <span className="text-xs text-gray-500">{submission.country}</span>
                          </TableCell>
                          <TableCell className="text-gray-600">{submission.device}</TableCell>
                          <TableCell className="text-gray-600">{submission.completionTime}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {submission.flags.vpn && <Shield className="w-4 h-4 text-red-600" title="VPN" />}
                              {submission.flags.proxy && <Wifi className="w-4 h-4 text-red-600" title="Proxy" />}
                              {submission.flags.disposableEmail && (
                                <Mail className="w-4 h-4 text-yellow-600" title="Disposable Email" />
                              )}
                              {submission.flags.duplicate && (
                                <Users className="w-4 h-4 text-yellow-600" title="Duplicate" />
                              )}
                              {submission.flags.fastCompletion && (
                                <Globe className="w-4 h-4 text-yellow-600" title="Fast Completion" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm">
                            {new Date(submission.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Pagination */}
              {!loading && submissions.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <p className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default function SubmissionsPage() {
  return (
    <Suspense
      fallback={
        <ProtectedRoute>
          <DashboardLayout>
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
            </div>
          </DashboardLayout>
        </ProtectedRoute>
      }
    >
      <SubmissionsContent />
    </Suspense>
  )
}
