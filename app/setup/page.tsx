"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface SetupStatus {
  supabaseUrl: boolean
  supabaseKey: boolean
  siteUrl: boolean
  databaseTables: boolean
  emailService: boolean
}

export default function SetupPage() {
  const [status, setStatus] = useState<SetupStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)

  useEffect(() => {
    checkSetup()
  }, [])

  const checkSetup = async () => {
    try {
      const response = await fetch("/api/setup/check")
      const data = await response.json()

      if (data.success) {
        setStatus(data.checks)
      } else {
        console.error("Setup check failed:", data.error)
      }
    } catch (error) {
      console.error("Failed to check setup:", error)
      // Fallback to client-side check
      const checks: SetupStatus = {
        supabaseUrl: false,
        supabaseKey: false,
        siteUrl: false,
        databaseTables: false,
        emailService: false,
      }
      setStatus(checks)
    } finally {
      setLoading(false)
    }
  }

  const runTest = async () => {
    setTesting(true)
    try {
      const response = await fetch("/api/setup/check")
      const data = await response.json()

      if (data.success && data.allReady) {
        setTestResult({ success: true, message: "Setup is ready for user registration!" })
      } else {
        setTestResult({ success: false, error: "Setup is incomplete. Please complete missing steps." })
      }
    } catch (error) {
      setTestResult({ success: false, error: "Test failed. Please check your configuration." })
    } finally {
      setTesting(false)
    }
  }

  const StatusIcon = ({ isReady }: { isReady: boolean }) => {
    return isReady ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  const allReady = status && Object.values(status).every(Boolean)

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4">Checking setup status...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6" />
              Authentication Setup Status
            </CardTitle>
            <CardDescription>Complete these steps before users can create accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status && (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Supabase URL configured</span>
                    <div className="flex items-center gap-2">
                      <StatusIcon isReady={status.supabaseUrl} />
                      <Badge variant={status.supabaseUrl ? "default" : "destructive"}>
                        {status.supabaseUrl ? "Ready" : "Missing"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Supabase API Key configured</span>
                    <div className="flex items-center gap-2">
                      <StatusIcon isReady={status.supabaseKey} />
                      <Badge variant={status.supabaseKey ? "default" : "destructive"}>
                        {status.supabaseKey ? "Ready" : "Missing"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Site URL configured</span>
                    <div className="flex items-center gap-2">
                      <StatusIcon isReady={status.siteUrl} />
                      <Badge variant={status.siteUrl ? "default" : "destructive"}>
                        {status.siteUrl ? "Ready" : "Missing"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Database tables created</span>
                    <div className="flex items-center gap-2">
                      <StatusIcon isReady={status.databaseTables} />
                      <Badge variant={status.databaseTables ? "default" : "destructive"}>
                        {status.databaseTables ? "Ready" : "Pending"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Email service configured</span>
                    <div className="flex items-center gap-2">
                      <StatusIcon isReady={status.emailService} />
                      <Badge variant={status.emailService ? "default" : "destructive"}>
                        {status.emailService ? "Ready" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button onClick={runTest} disabled={testing} className="w-full">
                    {testing ? "Testing..." : "Test Setup Status"}
                  </Button>

                  {testResult && (
                    <div
                      className={`mt-3 p-3 rounded-md ${
                        testResult.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                      }`}
                    >
                      {testResult.success ? testResult.message : testResult.error}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <div
                    className={`p-4 rounded-md ${
                      allReady ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {allReady ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                      <span className="font-medium">
                        {allReady
                          ? "Authentication is ready! Users can now create accounts."
                          : "Setup incomplete. Complete the missing steps above."}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="font-medium text-blue-900 mb-2">Next Steps:</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                    <li>Create a Supabase project at supabase.com</li>
                    <li>Add environment variables to .env.local</li>
                    <li>Run database scripts in Supabase SQL editor</li>
                    <li>Configure authentication settings in Supabase</li>
                  </ol>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
