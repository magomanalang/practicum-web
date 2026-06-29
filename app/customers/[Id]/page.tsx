"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface CustomerProfile {
  Id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  dateOfBirth: string;
  balance: number;
  status: string | number;
  createdBy: string;
  createdDateTime: string;
}

export default function Page() {
  const { Id } = useParams<{ Id: string }>();
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = useCallback(async (customerId: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/auth/get-customer?id=${encodeURIComponent(customerId)}`,
      );

      if (!res.ok) {
        throw new Error(`Failed to load profile (Status: ${res.status})`);
      }

      const data = await res.json();

      console.log("=== API RESPONSE RECEIVED ===");
      console.log(data);

      setCustomer(data);
    } catch (err: any) {
      console.error("Failed to fetch customer profile:", err);
      setError(
        err.message ||
          "An unexpected error occurred while loading the profile.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (Id) {
      fetchCustomer(Id);
    }
  }, [Id, fetchCustomer]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-50 p-6 text-gray-500 animate-pulse">
        Loading customer profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg shadow-sm">
          <p className="font-semibold">Error Fetching Data</p>
          <p className="text-sm opacity-90">{error}</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-6 text-center text-gray-500">
        No profile data found.
      </div>
    );
  }

  const fullName = [
    customer.firstName,
    customer.middleName,
    customer.lastName,
    customer.suffix,
  ]
    .filter(Boolean)
    .join(" ");

  const formattedBalance = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(customer.balance);

  return (
    <div className="w-full min-h-screen px-4 py-8 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Customer Profile</h1>

      {/* Profile Information */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Basic information for {fullName}.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <Input disabled value={fullName} />
              </Field>
              <Field>
                <FieldLabel>Date of Birth</FieldLabel>
                <Input
                  disabled
                  value={new Date(customer.dateOfBirth).toLocaleDateString()}
                />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Account Details */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>
            Customer account status and history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Balance</FieldLabel>
                <Input disabled value={formattedBalance} />
              </Field>
              <Field>
                <FieldLabel>Status</FieldLabel>
                <Input disabled value={customer.status.toString()} />
              </Field>
              <Field>
                <FieldLabel>Member Since</FieldLabel>
                <Input
                  disabled
                  value={new Date(
                    customer.createdDateTime,
                  ).toLocaleDateString()}
                />
              </Field>
              <Field>
                <FieldLabel>Record Created By</FieldLabel>
                <Input disabled value={customer.createdBy} />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}
