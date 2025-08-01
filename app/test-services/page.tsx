'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestServicesPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testServices = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-services');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to test services', details: error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Test Services Table</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={testServices} disabled={loading}>
            {loading ? 'Testing...' : 'Test Services Table'}
          </Button>

          {result && (
            <div className="mt-4 p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
