"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

interface SignupStatus {
  canSignup: boolean
  message: string
  missing?: string[]
}

export function SignupStatusBanner() {
  const [status, setStatus] = useState<SignupStatus | null>(null)

  useEffect(() => {
    fetch("/api/test-signup")
      .then((res) => res.json())
      .then(setStatus)
      .catch(() =>
        setStatus({
          canSignup: false,
          message: "❌ Configuration check failed",
        }),
      )
  }, [])

  if (!status) return null

  return (
    <Alert className={`mb-4 ${status.canSignup ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}`}>
      {status.canSignup ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <AlertCircle className="h-4 w-4 text-yellow-600" />
      )}
      <AlertDescription className={status.canSignup ? "text-green-800" : "text-yellow-800"}>
        {status.message}
        {status.missing && status.missing.length > 0 && (
          <div className="mt-2 text-sm">
            <strong>Required:</strong> {status.missing.join(", ")}
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}
