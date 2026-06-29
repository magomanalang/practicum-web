"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

interface CustomerProfile {
  id: string;
  firstName: string;
  middleName?: string;
  suffix?: string;
  lastName: string;
  dateOfBirth: string;
  balance: number;
  status: string;
  createdBy: number;
  createdDateTime: string;
}

interface PageProps {
  params: {
    Id: string;
  };
}

export default function Page({ params }: PageProps) {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.Id) return;

    const fetchCustomer = async () => {
      try {
        const response = await fetch(
          `/api/auth/customer/${encodeURIComponent(params.Id)}`,
        );

        if (response.status === 404) {
          setError("Customer not found.");
          return;
        }

        if (!response.ok) {
          const error = await response.json();
          setError(error.message ?? "Failed to fetch customer.");
          return;
        }

        const data: CustomerProfile = await response.json();
        setCustomer(data);
      } catch (error) {
        console.error(error);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [params.Id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error === "Customer not found.") {
    notFound();
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!customer) {
    notFound();
  }

  const fullName = [
    customer.firstName,
    customer.middleName,
    customer.lastName,
    customer.suffix,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Customer Profile</CardTitle>
          <CardDescription>Detailed information for {fullName}</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2">
          <Info label="Full Name" value={fullName} />

          <Info
            label="Date of Birth"
            value={new Date(customer.dateOfBirth).toLocaleDateString()}
          />

          <Info
            label="Balance"
            value={new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
            }).format(customer.balance)}
          />

          <Info label="Status" value={customer.status} />

          <Info
            label="Member Since"
            value={new Date(customer.createdDateTime).toLocaleDateString()}
          />

          <Info
            label="Record Created By"
            value={customer.createdBy.toString()}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p>{value}</p>
    </div>
  );
}
