import { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { MedicationInfoModal } from './MedicationInfoModal'
import { Trash2, Info } from 'lucide-react'

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  createdAt: string
}

interface MedicationCardProps {
  medication: Medication
  taken: boolean
  onMarkTaken: (taken: boolean) => void
  onDelete: () => void
  accessToken: string
}

export function MedicationCard({ medication, taken, onMarkTaken, onDelete, accessToken }: MedicationCardProps) {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <>
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={taken}
            onCheckedChange={(checked) => onMarkTaken(checked as boolean)}
            className="mt-1"
          />
          <div className="flex-1">
            <h3 className={taken ? 'line-through text-muted-foreground' : ''}>
              {medication.name}
            </h3>
            <p className="text-muted-foreground">
              {medication.dosage} • {medication.frequency}x daily
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInfo(true)}
              className="p-2"
            >
              <Info className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="p-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {showInfo && (
        <MedicationInfoModal
          medicationName={medication.name}
          accessToken={accessToken}
          onClose={() => setShowInfo(false)}
        />
      )}
    </>
  )
}
