import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { AlertTriangle, Shield, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from './ui/alert'
import { projectId } from '../utils/supabase/info'

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
}

interface InteractionCheckerProps {
  medications: Medication[]
  accessToken: string
}

export function InteractionChecker({ medications, accessToken }: InteractionCheckerProps) {
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [interactions, setInteractions] = useState('')
  const [error, setError] = useState('')

  const checkInteractions = async () => {
    if (medications.length < 2) {
      setInteractions('You need at least 2 medications to check for interactions.')
      setShowResults(true)
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2e410764/check-interactions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ medications })
        }
      )

      const data = await response.json()

      if (response.ok) {
        setInteractions(data.interactions)
        setShowResults(true)
      } else {
        setError(data.error || 'Failed to check interactions')
      }
    } catch (err) {
      console.error('Error checking interactions:', err)
      setError('Failed to check interactions')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={checkInteractions}
        disabled={loading || medications.length === 0}
        variant="outline"
        className="w-full gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Checking Interactions...
          </>
        ) : (
          <>
            <AlertTriangle className="w-4 h-4" />
            Check Medication Interactions
          </>
        )}
      </Button>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Medication Interaction Analysis
            </DialogTitle>
            <DialogDescription>
              AI-powered analysis of potential medication interactions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                <strong>Medical Disclaimer:</strong> This is educational information only. 
                Always consult your doctor or pharmacist before making any changes to your medications.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Medications Analyzed</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1">
                  {medications.map(med => (
                    <li key={med.id}>
                      {med.name} ({med.dosage})
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">
                  {interactions}
                </div>
              </CardContent>
            </Card>

            <Button onClick={() => setShowResults(false)} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
