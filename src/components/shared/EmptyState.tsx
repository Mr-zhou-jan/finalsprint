import { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

export function EmptyState({ icon, title, description, action }: {
  icon?: ReactNode; title: string; description?: string; action?: ReactNode
}) {
  return <Card className="text-center py-12 border-dashed"><CardContent>{icon && <div className="flex justify-center mb-4">{icon}</div>}<p className="font-bold text-lg mb-2">{title}</p>{description && <p className="text-zinc-500 text-sm mb-4">{description}</p>}{action}</CardContent></Card>
}
