"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { QRCodeSVG } from "qrcode.react"

export function TwoFactorSetup() {
  const [qrCode, setQrCode] = useState<string>("")
  const [secret, setSecret] = useState<string>("")
  const [verificationCode, setVerificationCode] = useState<string>("")
  const [isEnabled, setIsEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const setupTwoFactor = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Epic360 Gigs",
      })

      if (error) throw error

      setQrCode(data.totp.qr_code)
      setSecret(data.totp.secret)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to setup 2FA. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const verifyAndEnable = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit code.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.mfa.verify({
        factorId: secret,
        challengeId: secret,
        code: verificationCode,
      })

      if (error) throw error

      setIsEnabled(true)
      toast({
        title: "Success",
        description: "Two-factor authentication has been enabled.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (isEnabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>2FA is enabled and protecting your account</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-green-600">✓ Two-factor authentication is active</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enable Two-Factor Authentication</CardTitle>
        <CardDescription>Add an extra layer of security to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!qrCode ? (
          <Button onClick={setupTwoFactor} disabled={loading}>
            {loading ? "Setting up..." : "Setup 2FA"}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <QRCodeSVG value={qrCode} size={200} />
              <p className="text-sm text-gray-600 mt-2">Scan this QR code with your authenticator app</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verification">Enter verification code</Label>
              <Input
                id="verification"
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
            </div>

            <Button onClick={verifyAndEnable} disabled={loading} className="w-full">
              {loading ? "Verifying..." : "Verify and Enable"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
