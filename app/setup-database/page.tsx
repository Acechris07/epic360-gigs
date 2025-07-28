"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Database, 
  Storage, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Copy,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

export default function SetupDatabasePage() {
  const [testResults, setTestResults] = useState<any>(null)
  const [verificationResults, setVerificationResults] = useState<any>(null)
  const [storageResults, setStorageResults] = useState<any>(null)
  const [loading, setLoading] = useState<string | null>(null)

  const testConnection = async () => {
    setLoading('connection')
    try {
      const response = await fetch('/api/test-supabase')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ success: false, error: 'Failed to test connection' })
    } finally {
      setLoading(null)
    }
  }

  const verifyDatabase = async () => {
    setLoading('verification')
    try {
      const response = await fetch('/api/verify-database')
      const data = await response.json()
      setVerificationResults(data)
    } catch (error) {
      setVerificationResults({ success: false, error: 'Failed to verify database' })
    } finally {
      setLoading(null)
    }
  }

  const setupStorage = async () => {
    setLoading('storage')
    try {
      const response = await fetch('/api/setup-storage', { method: 'POST' })
      const data = await response.json()
      setStorageResults(data)
    } catch (error) {
      setStorageResults({ success: false, error: 'Failed to setup storage' })
    } finally {
      setLoading(null)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Setup Guide</h1>
          <p className="text-gray-600">Follow these steps to set up your Supabase database for the freelance platform.</p>
        </div>

        {/* Step 1: SQL Schema */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Step 1: Run Database Schema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Instructions:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase Dashboard</a></li>
                <li>Select your project: <code className="bg-gray-100 px-1 rounded">zhifxamtdygbufbzwgvu</code></li>
                <li>Click on "SQL Editor" in the left sidebar</li>
                <li>Click "New query"</li>
                <li>Copy the schema from <code className="bg-gray-100 px-1 rounded">scripts/setup-database.sql</code></li>
                <li>Paste and run the SQL script</li>
              </ol>
            </div>

            <div className="flex gap-2">
              <Button asChild>
                <Link href="/scripts/setup-database.sql" target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Schema File
                </Link>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => copyToClipboard('scripts/setup-database.sql')}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy File Path
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Test Connection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Step 2: Test Database Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">Test if your Supabase connection is working properly.</p>
            
            <Button 
              onClick={testConnection}
              disabled={loading === 'connection'}
            >
              {loading === 'connection' ? 'Testing...' : 'Test Connection'}
            </Button>

            {testResults && (
              <div className={`p-4 rounded-lg ${testResults.success ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {testResults.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="font-semibold">
                    {testResults.success ? 'Connection Successful' : 'Connection Failed'}
                  </span>
                </div>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(testResults, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 3: Verify Database */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Step 3: Verify Database Tables
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">Verify that all database tables and policies are set up correctly.</p>
            
            <Button 
              onClick={verifyDatabase}
              disabled={loading === 'verification'}
            >
              {loading === 'verification' ? 'Verifying...' : 'Verify Database'}
            </Button>

            {verificationResults && (
              <div className={`p-4 rounded-lg ${verificationResults.success ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {verificationResults.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="font-semibold">
                    {verificationResults.success ? 'Verification Complete' : 'Verification Failed'}
                  </span>
                </div>
                
                {verificationResults.summary && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Summary:</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total Tables:</span>
                        <span className="ml-2 font-semibold">{verificationResults.summary.total_tables}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Existing:</span>
                        <span className="ml-2 font-semibold">{verificationResults.summary.existing_tables}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Working:</span>
                        <span className="ml-2 font-semibold">{verificationResults.summary.working_tables}</span>
                      </div>
                    </div>
                  </div>
                )}

                <details className="text-sm">
                  <summary className="cursor-pointer font-semibold">View Details</summary>
                  <pre className="mt-2 overflow-auto">
                    {JSON.stringify(verificationResults.results, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 4: Setup Storage */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Storage className="h-5 w-5" />
              Step 4: Setup File Storage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">Set up storage buckets for file uploads (images, documents, etc.).</p>
            
            <Button 
              onClick={setupStorage}
              disabled={loading === 'storage'}
            >
              {loading === 'storage' ? 'Setting up...' : 'Setup Storage'}
            </Button>

            {storageResults && (
              <div className={`p-4 rounded-lg ${storageResults.success ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {storageResults.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="font-semibold">
                    {storageResults.success ? 'Storage Setup Complete' : 'Storage Setup Failed'}
                  </span>
                </div>
                
                {storageResults.summary && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Summary:</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total Buckets:</span>
                        <span className="ml-2 font-semibold">{storageResults.summary.total_buckets}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Created:</span>
                        <span className="ml-2 font-semibold">{storageResults.summary.created_buckets}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Existing:</span>
                        <span className="ml-2 font-semibold">{storageResults.summary.existing_buckets}</span>
                      </div>
                    </div>
                  </div>
                )}

                <details className="text-sm">
                  <summary className="cursor-pointer font-semibold">View Details</summary>
                  <pre className="mt-2 overflow-auto">
                    {JSON.stringify(storageResults.results, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge variant="outline">1</Badge>
                <div>
                  <h4 className="font-semibold">Test the Application</h4>
                  <p className="text-sm text-gray-600">Try creating a user account and testing the order system.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline">2</Badge>
                <div>
                  <h4 className="font-semibold">Configure Payment System</h4>
                  <p className="text-sm text-gray-600">Set up Stripe keys for payment processing.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline">3</Badge>
                <div>
                  <h4 className="font-semibold">Add Sample Data</h4>
                  <p className="text-sm text-gray-600">Add some sample gigs and services to test the platform.</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Link href="/">
                  <Button>Go to Homepage</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 