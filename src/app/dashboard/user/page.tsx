"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface Pet {
  id: string;
  name: string;
  type: string;
}

interface Session {
  id: string;
  date: string;
  diagnosis: string;
  doctor_email: string;
  Pet: {
    name: string;
    type: string;
  };
}

export default function UserDashboardPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [pets, setPets] = useState<Pet[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/dashboard/user");
        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
          setPets(data.pets);
          setSessions(data.sessions);
        } else {
          // console.error('Error:', data.message);
          setIsFailed(true);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  async function deletePet(
    petId: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch(`/api/pet/deletepet/${petId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        return { success: true };
      } else {
        return {
          success: false,
          message: data.message || "Failed to delete pet.",
        };
      }
    } catch (error) {
      console.error("Delete pet error:", error);
      return { success: false, message: "Something went wrong." };
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }
  if (isFailed) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-5.1rem)] text-2xl">
        Please&nbsp;
        <button
          onClick={() => {
            setLoading(true);
            setTimeout(() => {
              router.push("/login");
            }, 1000);
          }}
          className="lowercase text-blue-400 underline"
        >
          {" "}
          login
        </button>
        &nbsp;to see your details
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-semibold tracking-tight">
            Welcome back, {user?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-base">
            Email: {user?.email}
          </p>
        </CardContent>
      </Card>

      <Separator />

      {/* Pets Section */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-semibold">Your Pets</CardTitle>
          </div>
          <div>
            <button
              onClick={() => {
                setLoading(true);
                router.push("/pet/addPet");
                setLoading(false);
              }}
            >
              <Plus color="gray" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {pets.length > 0 ? (
            pets.map((pet) => (
              <div
                key={pet.id}
                className="border border-muted rounded-xl p-4 bg-muted/40 shadow-sm flex justify-between items-center"
              >
                <span>
                  <p className="text-lg font-medium">{pet.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Species: {pet.type}
                  </p>
                </span>
                <span>
                  <button
                    onClick={async () => {
                      const confirmed = confirm(`Delete pet "${pet.name}"?`);
                      if (!confirmed) return;

                      const result = await deletePet(pet.id);
                      if (result.success) {
                        setPets((prevPets) =>
                          prevPets.filter((p) => p.id !== pet.id)
                        );
                        toast({
                          title: "Pet Deleted",
                          description: `Pet "${pet.name}" has been successfully deleted.`,
                        });
                      } else {
                        toast({
                          title: "Error",
                          description:
                            result.message || "Failed to delete pet.",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <Trash2 className="text-red-500" />
                  </button>
                  {/* {pet.id} */}
                </span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground italic">
              You don’t have any pets registered yet.
            </p>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Sessions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Previous Consultations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session.id}
                className="border border-muted rounded-xl p-4 bg-muted/40 shadow-sm"
              >
                <p className="font-medium text-base mb-1">
                  Diagnosis:{" "}
                  <span className="text-foreground">{session.diagnosis}</span>
                </p>
                <p className="text-sm">
                  Pet: <span className="font-medium">{session.Pet.name}</span> (
                  {session.Pet.type})
                </p>
                <p className="text-sm">
                  Attending Doctor:{" "}
                  <span className="text-muted-foreground">
                    {session.doctor_email}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Date: {new Date(session.date).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground italic">
              No previous sessions available.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
