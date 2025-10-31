import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { MedicationCard } from "./MedicationCard";
import { AddMedicationModal } from "./AddMedicationModal";
import { InteractionChecker } from "./InteractionChecker";
import { projectId } from "../utils/supabase/info";
import { supabase } from "../utils/supabase/client";
import { RefillRequestPage } from "./RefillRequestPage";
import { PlusCircle, LogOut, CalendarDays } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  createdAt: string;
  reminderTime?: string;
}

interface DashboardProps {
  accessToken: string;
  onLogout: () => void;
}

export function Dashboard({
  accessToken,
  onLogout,
}: DashboardProps) {
  const [medications, setMedications] = useState<Medication[]>(
    [],
  );
  const [takenStatus, setTakenStatus] = useState<
    Record<string, boolean>
  >({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(),
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [userName, setUserName] = useState<string | null>(null); // will be replaced by real name
  const [showRefillPage, setShowRefillPage] = useState(false);

  const formattedDate = selectedDate
    .toISOString()
    .split("T")[0];

  // Fetch user's name from Supabase
  useEffect(() => {
  const fetchUserName = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;

      const nameFromMeta = data.user?.user_metadata?.full_name 
        || data.user?.raw_user_meta_data?.full_name;
      
      if (nameFromMeta) {
        setUserName(nameFromMeta);
      } else {
        console.warn("No full_name found in user metadata");
      }
    } catch (err) {
      console.error("Error fetching user name:", err);
    }
  };

  fetchUserName();
  loadMedications();
}, []);


  useEffect(() => {
    loadTakenStatus(formattedDate);
  }, [formattedDate]);

  const loadMedications = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2e410764/medications`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const data = await response.json();
      if (response.ok) {
        setMedications(data.medications || []);
      } else {
        console.error(
          "Failed to load medications:",
          data.error,
        );
      }
    } catch (error) {
      console.error("Error loading medications:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTakenStatus = async (date: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2e410764/taken/${date}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const data = await response.json();
      if (response.ok) {
        setTakenStatus(data.takenMeds || {});
      }
    } catch (error) {
      console.error("Error loading taken status:", error);
    }
  };

  const handleAddMedication = async (
    medication: Omit<Medication, "id" | "createdAt">,
  ) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2e410764/medications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(medication),
        },
      );
      const data = await response.json();
      if (response.ok) {
        setMedications([...medications, data.medication]);
        setShowAddModal(false);
      } else {
        console.error("Failed to add medication:", data.error);
        alert("Failed to add medication: " + data.error);
      }
    } catch (error) {
      console.error("Error adding medication:", error);
      alert("Failed to add medication");
    }
  };

  const handleRequestRefill = () => {
  setShowRefillPage(true);
};

  const handleUpdateReminder = (
    medicationId: string,
    reminderTime: string | undefined,
  ) => {
    setMedications(
      medications.map((med) =>
        med.id === medicationId
          ? { ...med, reminderTime }
          : med,
      ),
    );
  };

  const handleDeleteMedication = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this medication from your medications list?",
      )
    )
      return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2e410764/medications/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.ok) {
        setMedications(
          medications.filter((med) => med.id !== id),
        );
      } else {
        console.error("Failed to delete medication");
        alert("Failed to delete medication");
      }
    } catch (error) {
      console.error("Error deleting medication:", error);
      alert("Failed to delete medication");
    }
  };

  const handleMarkTaken = async (
    medicationId: string,
    taken: boolean,
  ) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2e410764/mark-taken`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            medicationId,
            date: formattedDate,
            taken,
          }),
        },
      );
      if (response.ok) {
        setTakenStatus({
          ...takenStatus,
          [medicationId]: taken,
        });
      } else {
        console.error("Failed to update taken status");
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating taken status:", error);
      alert("Failed to update status");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  if (showRefillPage) {
  return <RefillRequestPage onBack={() => setShowRefillPage(false)} />;
}

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1>
            {userName
              ? `Welcome back, ${userName}!`
              : "My Medications"}
          </h1>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>
              Medications for{" "}
              {selectedDate.toLocaleDateString()}
            </CardTitle>
            <Button
              variant="ghost"
              onClick={() => setShowCalendar(!showCalendar)}
              className="gap-2"
            >
              <CalendarDays className="w-4 h-4" />
              Calendar
            </Button>
          </CardHeader>

          {/* Modern dropdown calendar */}
          {showCalendar && (
            <div className="mt-3 flex justify-center">
              <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                <Calendar
                  onChange={(date) =>
                    setSelectedDate(date as Date)
                  }
                  value={selectedDate}
                  className="border-0 text-black dark:text-white"
                  tileClassName="!border-0"
                />
              </div>
            </div>
          )}

          <CardContent>
            {loading ? (
              <p>Loading medications...</p>
            ) : medications.length === 0 ? (
              <p className="text-muted-foreground">
                No medications added yet. Add your first
                medication below!
              </p>
            ) : (
              <div className="space-y-3">
                {medications.map((med) => (
                  <MedicationCard
                    key={med.id}
                    medication={med}
                    taken={takenStatus[med.id] || false}
                    onMarkTaken={(taken) =>
                      handleMarkTaken(med.id, taken)
                    }
                    onDelete={() =>
                      handleDeleteMedication(med.id)
                    }
                    onUpdateReminder={(reminderTime) =>
                      handleUpdateReminder(med.id, reminderTime)
                    }
                    accessToken={accessToken}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3">
          {medications.length > 0 && (
            <InteractionChecker
              medications={medications}
              accessToken={accessToken}
            />
          )}

          <Button
            onClick={() => setShowAddModal(true)}
            className="w-full gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Add Medication
          </Button>

          <Button
            onClick={handleRequestRefill}
            className="w-full gap-2"
          >
            <Repeat className="w-5 h-5" />
            Request Refill
          </Button>
        </div>

        {showAddModal && (
          <AddMedicationModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddMedication}
          />
        )}
      </div>
    </div>
  );
}
