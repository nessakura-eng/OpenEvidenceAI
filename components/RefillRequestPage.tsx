import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Store,
  ShoppingCart,
  Building2,
  Package,
  ShoppingBag,
} from "lucide-react"; // icons

export function RefillRequestPage({
  onBack,
}: {
  onBack: () => void;
}) {
  const [requestedMed, setRequestedMed] = useState("");
  const [selectedPharmacy, setSelectedPharmacy] = useState<
    string | null
  >(null);

  const pharmacies = [
    {
      name: "Publix",
      icon: <ShoppingCart className="w-6 h-6" />,
    },
    { name: "Walmart", icon: <Store className="w-6 h-6" /> },
    { name: "CVS", icon: <Building2 className="w-6 h-6" /> },
    {
      name: "Walgreens",
      icon: <Package className="w-6 h-6" />,
    },
    {
      name: "Amazon",
      icon: <ShoppingBag className="w-6 h-6" />,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPharmacy) {
      alert("Please select a pharmacy.");
      return;
    }
    alert(
      `Refill request sent to ${selectedPharmacy} for ${requestedMed}`,
    );
    setRequestedMed("");
    setSelectedPharmacy(null);
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
                onChange={(e) =>
                  setRequestedMed(e.target.value)
                }
                placeholder="Enter medication name"
                className="w-full border rounded-lg p-2"
                required
              />

              <div>
                <p className="font-medium mb-2">
                  Select your pharmacy:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {pharmacies.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() =>
                        setSelectedPharmacy(p.name)
                      }
                      className={`flex flex-col items-center justify-center border rounded-xl p-3 hover:bg-accent transition ${
                        selectedPharmacy === p.name
                          ? "border-primary bg-accent"
                          : "border-gray-300"
                      }`}
                    >
                      {p.icon}
                      <span className="mt-1 text-sm">
                        {p.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

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
