import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, format: "short" | "long" | "relative" = "short"): string {
  const d = new Date(date)

  if (format === "relative") {
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 30) return d.toLocaleDateString()
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    return "Just now"
  }

  if (format === "long") {
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return d.toLocaleDateString()
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num)
}

export function getQualityScoreColor(score: number): "red" | "yellow" | "green" {
  if (score >= 71) return "green"
  if (score >= 41) return "yellow"
  return "red"
}

export function truncateEmail(email: string, maxLength = 30): string {
  if (email.length <= maxLength) return email
  const [username, domain] = email.split("@")
  const truncatedUsername = username.slice(0, Math.max(1, maxLength - domain.length - 5)) + "..."
  return `${truncatedUsername}@${domain}`
}

export function maskApiKey(apiKey: string, visibleChars = 20): string {
  if (apiKey.length <= visibleChars) return apiKey
  return `${apiKey.slice(0, visibleChars)}...`
}
