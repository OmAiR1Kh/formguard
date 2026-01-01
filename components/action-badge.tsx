import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react"

interface ActionBadgeProps {
  action: "allowed" | "flagged" | "blocked"
}

export function ActionBadge({ action }: ActionBadgeProps) {
  const config = {
    allowed: {
      label: "Allowed",
      className: "bg-green-100 text-green-700 border-green-200",
      icon: CheckCircle2,
    },
    flagged: {
      label: "Flagged",
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
      icon: AlertTriangle,
    },
    blocked: {
      label: "Blocked",
      className: "bg-red-100 text-red-700 border-red-200",
      icon: XCircle,
    },
  }

  const { label, className, icon: Icon } = config[action]

  return (
    <Badge variant="outline" className={className}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </Badge>
  )
}
