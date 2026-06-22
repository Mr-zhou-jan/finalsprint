"use client"
import { useEffect, useState } from "react"

export function useDashboard(projectId: string) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const fetchData = () => { setLoading(true); fetch(`/api/projects/${projectId}/dashboard`).then(r => r.json()).then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false)) }
  useEffect(() => { if (projectId) fetchData() }, [projectId])
  return { data, loading, refetch: fetchData }
}
