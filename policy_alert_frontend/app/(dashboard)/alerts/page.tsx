"use client"

import { useEffect, useState } from "react"

export default function AlertsPage() {

  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    fetch("http://localhost:8000/alerts")
      .then(res => res.json())
      .then(data => {

        if (data.alerts) {
          setAlerts(data.alerts)
        }

        setLoading(false)

      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })

  }, [])

  if (loading) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold">Loading alerts...</h1>
      </div>
    )
  }

  return (

    <div className="p-10 space-y-6">

      <h1 className="text-3xl font-bold">
        Policy Alerts
      </h1>

      {alerts.length === 0 && (
        <p>No alerts detected yet.</p>
      )}

      {alerts.map((alert:any) => (

        <div
          key={alert.bill_id}
          className="border rounded-xl p-6 shadow-sm"
        >

          <h2 className="font-semibold mb-2 text-red-600">
            ⚠ {alert.alert_message}
          </h2>

          <p className="mb-2 font-medium">
            {alert.title}
          </p>

          <p className="text-sm text-gray-500">
            Category: {alert.category}
          </p>

          <p className="text-sm text-gray-500">
            Impact Score: {alert.impact_score}/100
          </p>

          <p className="text-sm text-gray-500">
            Priority: {alert.priority}
          </p>

        </div>

      ))}

    </div>

  )
}