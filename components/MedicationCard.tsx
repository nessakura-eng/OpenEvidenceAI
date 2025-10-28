import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { MedicationInfoModal } from "./MedicationInfoModal";
import { ReminderTimeEditor } from "./ReminderTimeEditor";
import { Trash2, Info, Clock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  createdAt: string;
  reminderTime?: string;
}

interface MedicationCardProps {
  medication: Medication;
  taken: boolean;
  onMarkTaken: (taken: boolean) => void;
  onDelete: () => void;
  onUpdateReminder: (reminderTime: string | undefined) => void;
  accessToken: string;
}

/** 🔴 Delete Confirmation Button */
export function DeleteMedicationButton({
  onDelete,
}: {
  onDelete: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-2 text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-700">
            Delete Medication
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-700">
            Are you sure you want to delete this medication from
            your medications list?{" "}
            <span className="font-medium text-red-600">
              This action cannot be undone.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** 💊 Medication Card */
export function MedicationCard({
  medication,
  taken,
  onMarkTaken,
  onDelete,
  onUpdateReminder,
  accessToken,
}: MedicationCardProps) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={taken}
            onCheckedChange={(checked) =>
              onMarkTaken(checked as boolean)
            }
            className="mt-1"
          />

          <div className="flex-1">
            <h3
              className={`font-semibold ${
                taken
                  ? "line-through text-muted-foreground"
                  : "text-gray-900"
              }`}
            >
              {medication.name}
            </h3>
            <p className="text-muted-foreground text-sm">
              {medication.dosage} • {medication.frequency}x
              daily
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
              className="p-2 hover:text-blue-600"
            >
              <Info className="w-4 h-4" />
            </Button>

            <DeleteMedicationButton onDelete={onDelete} />
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
  );
}
