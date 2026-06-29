"use client";

import { useEffect, useState } from "react";
import React from "react";
import { notFound } from "next/navigation";

interface CustomerProfile {
  Id: string;
  FirstName: string;
  MiddleName?: string;
  Suffix?: string;
  LastName: string;
  DateOfBirth: string;
  Balance: number;
  Status: string;
  CreatedBy: number;
  CreatedDateTime: string;
}

export default function Page({ params }: { params: { Id: string } }) {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.Id) {
      setLoading(false);
      return;
    }

    async function fetchCustomerProfile() {
      setLoading(true);
      try {
        const res = await fetch(`/api/auth/get-customer?id=${params.Id}`);
        if (res.status === 404) {
          setError("Customer not found.");
          return;
        }
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.message || "Failed to fetch customer profile.",
          );
        }
        const data = await res.json();
        setCustomer(data);
      } catch (err: any) {
        console.error("Failed to fetch customer profile:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchCustomerProfile();
  }, [params.Id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100">
        Loading customer profile...
      </div>
    );
  }

  if (error === "Customer not found.") {
    notFound();
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-400">
        Error: {error}
      </div>
    );
  }

  if (!customer) {
    return notFound();
  }

  const fullName = [
    customer.FirstName,
    customer.MiddleName,
    customer.LastName,
    customer.Suffix,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <main className="bg-gray-900 text-gray-100 min-h-screen w-full p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white">Customer Profile</h1>
            <p className="text-gray-400 mt-1">
              Detailed information for {fullName}.
            </p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <InfoItem label="Full Name" value={fullName} />
            <InfoItem label="Customer ID" value={customer.Id} />
            <InfoItem
              label="Date of Birth"
              value={new Date(customer.DateOfBirth).toLocaleDateString()}
            />
            <InfoItem
              label="Balance"
              value={new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
              }).format(customer.Balance)}
            />
            <InfoItem label="Status" value={customer.Status} />
            <InfoItem
              label="Member Since"
              value={new Date(customer.CreatedDateTime).toLocaleDateString()}
            />
            <InfoItem
              label="Record Created By (User ID)"
              value={customer.CreatedBy.toString()}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) {
  if (!value) return null;
  return (
    <div className="grid gap-1">
      <p className="text-sm font-medium text-gray-400">{label}</p>
      <p className="text-base text-white">{value}</p>
    </div>
  );
}
