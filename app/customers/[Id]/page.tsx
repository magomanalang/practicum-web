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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface EmailDetail {
  email: string;
}

interface PhoneDetail {
  phoneNumber: string;
  type: string;
}

interface KycDetail {
  country: number;
  zipCode: string;
  addressLine: string;
  documentType: string;
  documentImagePath: string;
  submittedBy: string;
  submittedAt: Date;
  reviewedBy: string;
  reviewedAt: Date;
}

interface StatusHistoryDetail {
  beforeStatus: number;
  afterStatus: string;
  createdBy: string;
  createdDateTime: Date;
}

interface LoanHistoryDetail {
  loanAmount: number;
  status: string;
  dueDate: string;
  createdBy: string;
  createdDateTime: Date;
  approvedBy: string;
  approvedDateTime: Date;
}

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
  emailDetails: EmailDetail[];
  phoneDetails: PhoneDetail[];
  kycDetails: KycDetail[];
  statusHistoryDetails: StatusHistoryDetail[];
  loanHistoryDetails: LoanHistoryDetail[];
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

      {/* Contact Details */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
          <CardDescription>
            Customer&apos;s contact information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customer.emailDetails?.length > 0 ||
          customer.phoneDetails?.length > 0 ? (
            <FieldGroup>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Email Address</FieldLabel>
                  <Input
                    disabled
                    value={customer.emailDetails?.[0]?.email ?? "N/A"}
                  />
                </Field>
                <Field>
                  <FieldLabel>Phone Number</FieldLabel>
                  <Input
                    disabled
                    value={
                      customer.phoneDetails?.[0]
                        ? `${customer.phoneDetails[0].phoneNumber} (${customer.phoneDetails[0].type})`
                        : "N/A"
                    }
                  />
                </Field>
              </div>
            </FieldGroup>
          ) : (
            <p className="text-gray-500">No contact details found.</p>
          )}
        </CardContent>
      </Card>

      {/* KYC Information */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>KYC Information</CardTitle>
          <CardDescription>
            Know Your Customer verification details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customer.kycDetails && customer.kycDetails.length > 0 ? (
            <FieldGroup>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Address</FieldLabel>
                  <Input
                    disabled
                    value={customer.kycDetails[0].addressLine}
                  />
                </Field>
                <Field>
                  <FieldLabel>Zip Code</FieldLabel>
                  <Input disabled value={customer.kycDetails[0].zipCode} />
                </Field>
                <Field>
                  <FieldLabel>Country</FieldLabel>
                  <Input
                    disabled
                    value={customer.kycDetails[0].country.toString()}
                  />
                </Field>
                <Field>
                  <FieldLabel>Document Type</FieldLabel>
                  <Input
                    disabled
                    value={customer.kycDetails[0].documentType}
                  />
                </Field>
              </div>
            </FieldGroup>
          ) : (
            <p className="text-gray-500">No KYC details found.</p>
          )}
        </CardContent>
      </Card>

      {/* Status History */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Status History</CardTitle>
          <CardDescription>Record of account status changes.</CardDescription>
        </CardHeader>
        <CardContent>
          {customer.statusHistoryDetails &&
          customer.statusHistoryDetails.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From Status</TableHead>
                  <TableHead>To Status</TableHead>
                  <TableHead>Changed By</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.statusHistoryDetails.map((history, index) => (
                  <TableRow key={index}>
                    <TableCell>{history.beforeStatus}</TableCell>
                    <TableCell>{history.afterStatus}</TableCell>
                    <TableCell>{history.createdBy}</TableCell>
                    <TableCell>
                      {new Date(history.createdDateTime).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">No status history found.</p>
          )}
        </CardContent>
      </Card>

      {/* Loan History */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Loan History</CardTitle>
          <CardDescription>Record of past loans.</CardDescription>
        </CardHeader>
        <CardContent>
          {customer.loanHistoryDetails &&
          customer.loanHistoryDetails.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Approved By</TableHead>
                  <TableHead>Approval Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.loanHistoryDetails.map((loan, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      }).format(loan.loanAmount)}
                    </TableCell>
                    <TableCell>{loan.status}</TableCell>
                    <TableCell>
                      {new Date(loan.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{loan.approvedBy}</TableCell>
                    <TableCell>
                      {new Date(loan.approvedDateTime).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">No loan history found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
