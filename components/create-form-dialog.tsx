"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

interface CreateFormDialogProps {
  onSuccess?: () => void
}

export function CreateFormDialog({ onSuccess }: CreateFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    steps: 1,
    webhookUrl: "",
    autoActions: {
      blockOnLowScore: false,
      scoreThreshold: 50,
      blockVPN: false,
      blockDisposableEmail: true,
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.forms.create(formData)
      toast({
        title: "Form created",
        description: "Your form has been created successfully",
      })
      setOpen(false)
      setFormData({
        name: "",
        domain: "",
        steps: 1,
        webhookUrl: "",
        autoActions: {
          blockOnLowScore: false,
          scoreThreshold: 50,
          blockVPN: false,
          blockDisposableEmail: true,
        },
      })
      onSuccess?.()
    } catch (error) {
      console.error("[v0] Failed to create form:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create form",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create New Form
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Form</DialogTitle>
          <DialogDescription>Configure your form tracking and automatic actions</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Form Name</Label>
              <Input
                id="name"
                placeholder="Contact Form"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                placeholder="example.com"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="steps">Number of Steps</Label>
              <Input
                id="steps"
                type="number"
                min="1"
                max="10"
                value={formData.steps}
                onChange={(e) => setFormData({ ...formData, steps: Number.parseInt(e.target.value) || 1 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
              <Input
                id="webhookUrl"
                type="url"
                placeholder="https://your-site.com/webhook"
                value={formData.webhookUrl}
                onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <h4 className="font-semibold text-sm">Auto-Actions</h4>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="blockOnLowScore">Block on Low Score</Label>
                <p className="text-sm text-gray-500">Automatically block submissions below threshold</p>
              </div>
              <Switch
                id="blockOnLowScore"
                checked={formData.autoActions.blockOnLowScore}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    autoActions: { ...formData.autoActions, blockOnLowScore: checked },
                  })
                }
              />
            </div>

            {formData.autoActions.blockOnLowScore && (
              <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                <Label>Score Threshold: {formData.autoActions.scoreThreshold}</Label>
                <Slider
                  value={[formData.autoActions.scoreThreshold]}
                  onValueChange={([value]) =>
                    setFormData({
                      ...formData,
                      autoActions: { ...formData.autoActions, scoreThreshold: value },
                    })
                  }
                  min={0}
                  max={100}
                  step={5}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="blockVPN">Block VPN</Label>
                <p className="text-sm text-gray-500">Block submissions from VPN connections</p>
              </div>
              <Switch
                id="blockVPN"
                checked={formData.autoActions.blockVPN}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    autoActions: { ...formData.autoActions, blockVPN: checked },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="blockDisposableEmail">Block Disposable Emails</Label>
                <p className="text-sm text-gray-500">Block temporary and disposable email addresses</p>
              </div>
              <Switch
                id="blockDisposableEmail"
                checked={formData.autoActions.blockDisposableEmail}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    autoActions: { ...formData.autoActions, blockDisposableEmail: checked },
                  })
                }
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Creating..." : "Create Form"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
