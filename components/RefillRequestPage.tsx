// src/components/RefillRequestPage.tsx
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function RefillRequestPage({ onBack }: { onBack: () => void }) {
  const [requestedMed, setRequestedMed] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Refill request submitted for: ${requestedMed}`);
    setRequestedMed("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Request Medication Refill</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={requestedMed}
                onChange={(e) => setRequestedMed(e.target.value)}
                placeholder="Enter medication name"
                className="w-full border rounded-lg p-2"
                required
              />
              <Button type="submit" className="w-full">
                Submit Request
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={onBack}
                className="w-full"
              >
                Back to Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
