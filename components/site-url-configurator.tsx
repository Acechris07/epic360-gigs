"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SiteUrlConfigurator() {
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [newUrl, setNewUrl] = useState<string>("")
  const [isConfigured, setIsConfigured] = useState(false)
  const [environment, setEnvironment] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    checkCurrentConfig()
  }, [])

  const checkCurrentConfig = async () => {
    try {
      const response = await fetch("/api/config/site-url")
      const data = await response.json()
      setCurrentUrl(data.siteUrl || "")
      setIsConfigured(data.isConfigured)
      setEnvironment(data.environment)
    } catch (error) {
      console.error("Failed to check config:", error)
    }
  }

  const validateUrl = async () => {
    if (!newUrl) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/config/site-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newUrl }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "URL Validated",
          description: "URL format is correct. Follow the next steps below.",
        })
      } else {
        toast({
          title: "Invalid URL",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate URL",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    })
  }

  const getRecommendedUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.origin
    }
    return "http://localhost:3000"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Site URL Configuration
          {isConfigured ? (
            <Badge variant="default" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Configured
            </Badge>
          ) : (
            <Badge variant="destructive" className="flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              Not Configured
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Configure your site URL for authentication redirects and email links</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Configuration */}
        <div>
          <Label className="text-sm font-medium">Current Configuration</Label>
          <div className="mt-1 p-3 bg-gray-50 rounded-md">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">{currentUrl || "Not configured"}</span>
              {currentUrl && (
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(currentUrl)}>
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">Environment: {environment}</div>
          </div>
        </div>

        {/* URL Input */}
        <div>
          <Label htmlFor="site-url">New Site URL</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="site-url"
              placeholder={getRecommendedUrl()}
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
            <Button onClick={validateUrl}>Validate</Button>
          </div>
        </div>

        {/* Quick Options */}
        <div>
          <Label className="text-sm font-medium">Quick Options</Label>
          <div className="grid grid-cols-1 gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNewUrl("http://localhost:3000")}
              className="justify-start"
            >
              Development: http://localhost:3000
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNewUrl(getRecommendedUrl())}
              className="justify-start"
            >
              Current Origin: {getRecommendedUrl()}
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="font-medium text-blue-900 mb-2">Setup Instructions:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>
              Create or edit <code className="bg-blue-100 px-1 rounded">.env.local</code> in your project root
            </li>
            <li>
              Add this line:
              <div className="mt-1 p-2 bg-blue-100 rounded font-mono text-xs">
                NEXT_PUBLIC_SITE_URL={newUrl || getRecommendedUrl()}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-6 w-6 p-0"
                  onClick={() => copyToClipboard(`NEXT_PUBLIC_SITE_URL=${newUrl || getRecommendedUrl()}`)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </li>
            <li>Restart your development server</li>
            <li>Update your Supabase project settings with the same URL</li>
          </ol>
        </div>

        {/* Supabase Configuration */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h4 className="font-medium text-yellow-900 mb-2">Supabase Configuration:</h4>
          <p className="text-sm text-yellow-800 mb-2">Also update these URLs in your Supabase project settings:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
            <li>
              Site URL: <code className="bg-yellow-100 px-1 rounded">{newUrl || getRecommendedUrl()}</code>
            </li>
            <li>
              Redirect URLs:{" "}
              <code className="bg-yellow-100 px-1 rounded">{newUrl || getRecommendedUrl()}/auth/callback</code>
            </li>
          </ul>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Supabase Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
