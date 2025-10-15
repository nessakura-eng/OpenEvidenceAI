import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { projectId } from '../utils/supabase/info'
import { AlertTriangle, Loader2 } from 'lucide-react'

interface MedicationInfoModalProps {
  medicationName: string
  accessToken: string
  onClose: () => void
}

export function MedicationInfoModal({ medicationName, accessToken, onClose }: MedicationInfoModalProps) {
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMedicationInfo()
  }, [])

  const fetchMedicationInfo = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2e410764/medication-info`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ medicationName })
        }
      )

      const data = await response.json()

      if (response.ok) {
        setInfo(data.info)
      } else {
        setError(data.error || 'Failed to fetch medication information')
      }
    } catch (err) {
      console.error('Error fetching medication info:', err)
      setError('Failed to fetch medication information')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Medication Information: {medicationName}</CardTitle>
          <CardDescription>AI-generated educational information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>IMPORTANT DISCLAIMER:</strong> This AI-generated information is for educational purposes only. 
              It CANNOT and SHOULD NOT be used as medical advice. Always consult your doctor or pharmacist for 
              medical guidance regarding your medications, side effects, interactions, and treatment decisions.
            </AlertDescription>
          </Alert>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading medication information...</span>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!loading && !error && info && (
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap bg-muted p-4 rounded-md">
                {info}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button onClick={onClose}>Close</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
