import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface QualityScoreBadgeProps {
  score: number
  className?: string
}

export function QualityScoreBadge({ score, className }: QualityScoreBadgeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 71) return "bg-green-100 text-green-700 border-green-200"
    if (score >= 41) return "bg-yellow-100 text-yellow-700 border-yellow-200"
    return "bg-red-100 text-red-700 border-red-200"
  }

  return (
    <Badge variant="outline" className={cn("font-semibold", getScoreColor(score), className)}>
      {score}
    </Badge>
  )
}
