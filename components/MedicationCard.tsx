import { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { MedicationInfoModal } from './MedicationInfoModal'
import { ReminderTimeEditor } from './ReminderTimeEditor'
import { Trash2, Info, Clock } from 'lucide-react'

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  createdAt: string
  reminderTime?: string
}

interface MedicationCardProps {
  medication: Medication
  taken: boolean
  onMarkTaken: (taken: boolean) => void
  onDelete: () => void
  onUpdateReminder: (reminderTime: string | undefined) => void
  accessToken: string
}

export function MedicationCard({ medication, taken, onMarkTaken, onDelete, onUpdateReminder, accessToken }: MedicationCardProps) {
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
            {medication.reminderTime && (
              <p className="text-sm text-primary flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3" />
                Reminder: {medication.reminderTime}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <ReminderTimeEditor
              medicationId={medication.id}
              medicationName={medication.name}
              currentReminderTime={medication.reminderTime}
              accessToken={accessToken}
              onUpdate={onUpdateReminder}
            />
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
