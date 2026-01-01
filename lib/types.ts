// Shared TypeScript types

export interface User {
  id: string
  email: string
  organizationId: string
  organizationName: string
  plan: "free" | "starter" | "pro" | "agency"
}

export interface Organization {
  _id: string
  name: string
  owner: string
  members: Member[]
  plan: "free" | "starter" | "pro" | "agency"
  createdAt: string
}

export interface Member {
  _id: string
  email: string
  role: "owner" | "admin" | "member"
  joinedAt: string
}

export interface Form {
  _id: string
  name: string
  domain: string
  steps: number
  apiKey: string
  webhookUrl?: string
  autoActions: {
    blockOnLowScore: boolean
    scoreThreshold: number
    blockVPN: boolean
    blockDisposableEmail: boolean
  }
  stats: {
    totalSubmissions: number
    flaggedSubmissions: number
    blockedSubmissions: number
    avgQualityScore?: number
  }
  createdAt: string
}

export interface Submission {
  _id: string
  formId: string
  formName?: string
  email: string
  ip: string
  country: string
  city: string
  device: string
  browser: string
  completionTime: number
  qualityScore: number
  action: "allowed" | "flagged" | "blocked"
  flags: {
    vpn: boolean
    proxy: boolean
    disposableEmail: boolean
    duplicate: boolean
    fastCompletion: boolean
  }
  fields: Record<string, any>
  createdAt: string
}

export interface DashboardStats {
  totalForms: number
  totalSubmissions: number
  submissionsThisMonth: number
  submissionsLimit: number
  flaggedSubmissions: number
  blockedSubmissions: number
  avgQualityScore: number
  plan: "free" | "starter" | "pro" | "agency"
  billingPeriodEnd: string
}

export interface Analytics {
  dropOffsByStep: Array<{ _id: number; count: number }>
  fieldErrors: Array<{ _id: string; count: number }>
  scoreDistribution: Array<{ _id: number; count: number }>
  submissionsOverTime: Array<{ _id: string; count: number; avgScore: number }>
}
