"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CreateFormDialog } from "@/components/create-form-dialog"
import { CopyButton } from "@/components/copy-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2, FolderOpen } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Form {
  _id: string
  name: string
  domain: string
  apiKey: string
  stats: {
    totalSubmissions: number
    flaggedSubmissions: number
    blockedSubmissions: number
  }
}

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchForms = async () => {
    try {
      const data = await api.forms.list()
      setForms(data.forms || [])
    } catch (error) {
      console.error("[v0] Failed to fetch forms:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load forms",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchForms()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return
    }

    try {
      await api.forms.delete(id)
      toast({
        title: "Form deleted",
        description: "The form has been deleted successfully",
      })
      fetchForms()
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

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Forms</h1>
              <p className="text-gray-600 mt-1">Manage your form tracking and configurations</p>
            </div>
            <CreateFormDialog onSuccess={fetchForms} />
          </div>

          {forms.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No forms yet</h3>
                  <p className="text-gray-600 mb-6">Create your first form to start tracking submissions</p>
                  <CreateFormDialog onSuccess={fetchForms} />
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {forms.map((form) => (
                <Card key={form._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{form.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{form.domain}</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-2xl font-bold text-gray-900">{form.stats.totalSubmissions}</p>
                        <p className="text-xs text-gray-600">Total</p>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-2">
                        <p className="text-2xl font-bold text-yellow-700">{form.stats.flaggedSubmissions}</p>
                        <p className="text-xs text-yellow-600">Flagged</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-2">
                        <p className="text-2xl font-bold text-red-700">{form.stats.blockedSubmissions}</p>
                        <p className="text-xs text-red-600">Blocked</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-700">API Key</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-gray-50 rounded text-xs font-mono truncate">
                          {form.apiKey.slice(0, 20)}...
                        </code>
                        <CopyButton text={form.apiKey} />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                        <Link href={`/forms/${form._id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/forms/${form._id}?tab=settings`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(form._id, form.name)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
