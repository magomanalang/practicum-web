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
} from "@/components/ui/table";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  createColumnHelper,
  getCoreRowModel,
  flexRender,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { AddPhoneNumberDialog } from "@/app/_components/dialogs/AddPhoneNumberDialog";
import { AddEmailDialog } from "@/app/_components/dialogs/AddEmailDialog";
import { ReduceBalanceDialog } from "@/app/_components/dialogs/ReduceBalanceDialog";
import { LoanCard } from "@/app/_components/LoanCard";

interface EmailDetail {
  customerId: number;
  email: string;
  createdBy: string;
  createdDateTime: Date;
}

interface PhoneDetail {
  phoneNumber: string;
  // customerId: number;
  // createdBy: string;
  // createdDateTime: Date;
}

interface KycDetail {
  country: number;
  zipCode: string;
  addressLine: string;
  documentType: string;
  documentImagePath: string;
  submittedBy: string;
  submittedAt: Date;
  // The backend response for KycDetail does not include `reviewedBy` or `reviewedAt`.
  // fullName: string;
}

interface StatusHistoryDetail {
  customerId: number;
  customerName: string;
  beforeStatus: number;
  afterStatus: string;
  createdBy: string;
  createdDateTime: Date;
}

interface LoanHistoryDetail {
  customerId: number;
  loanId: number;
  loanAmount: number;
  status: string;
  repaymentScheduleId: number;
  dueDate: string;
  createdBy: string;
  createdDateTime: Date;
  approvedBy: string;
  approvedAt: Date;
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
  customerLoanHistories: LoanHistoryDetail[];
  customerStatusHistories: StatusHistoryDetail[];
}

interface LoanProfile {
  Id: number;
  customerId: number;
  LoanName: string;
  LoanProductId: number;
  Amount: number;
  InterestRate: number;
  FinalAmount: number;
  Status: string;
  StartDate: Date;
  EndDate: Date;
  CreatedBy: string;
  CreatedDateTime: Date;
  ApprovedBy: string;
  ApprovedDateTime: Date;
}

const columnHelper = createColumnHelper<StatusHistoryDetail>();

const columns = [
  columnHelper.accessor("beforeStatus", {
    header: "From Status",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("afterStatus", {
    header: "To Status",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("createdBy", {
    header: "Changed By",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("createdDateTime", {
    header: "Date",
    cell: (info) => new Date(info.getValue()).toLocaleString("en-PH"),
  }),
];

export default function Page() {
  const { Id } = useParams<{ Id: string }>();
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [customerLoans, setCustomerLoans] = useState<LoanProfile[]>([]);
  const [loanLoading, setLoanLoading] = useState(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = React.useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = React.useState(false);
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = React.useState(false);

  const table = useReactTable({
    data: customer?.customerStatusHistories ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const fetchCustomerLoans = useCallback(async (customerId: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/auth/get-customer-loans?id=${encodeURIComponent(customerId)}`,
      );

      if (!res.ok) {
        throw new Error(`Failed to load profile (Status: ${res.status})`);
      }

      const loanData = await res.json();

      console.log("=== API RESPONSE RECEIVED ===");
      console.log(loanData);
      console.table(
        customerLoans.map((loan) => ({
          Id: loan.Id,
          LoanName: loan.LoanName,
        })),
      );
      setCustomerLoans(loanData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Failed to fetch customer profile:", err);
      setError(
        err.message ||
          "An unexpected error occurred while loading the profile.",
      );
    } finally {
      setLoanLoading(false);
    }
  }, []);

  useEffect(() => {
    if (Id) {
      fetchCustomerLoans(Id);
    }
  }, [Id, fetchCustomerLoans]);

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

  const handleAddPhoneSuccess = () => {
    setIsPhoneDialogOpen(false);
    if (Id) {
      fetchCustomer(Id);
    }
  };
  const handleAddEmailSuccess = () => {
    setIsEmailDialogOpen(false);
    if (Id) {
      fetchCustomer(Id);
    }
  };
  const handleReduceBalanceSuccess = () => {
    setIsBalanceDialogOpen(false);
    if (Id) {
      fetchCustomer(Id);
    }
  };

  if (loading || loanLoading) {
    return (
      <div className="flex items-center justify-center min-h-50">
        Loading...
      </div>
    );
  }

  return (
    <>
      <AddPhoneNumberDialog
        customer={customer}
        open={isPhoneDialogOpen}
        onOpenChange={setIsPhoneDialogOpen}
        onSuccess={handleAddPhoneSuccess}
      />
      <AddEmailDialog
        customer={customer}
        open={isEmailDialogOpen}
        onOpenChange={setIsEmailDialogOpen}
        onSuccess={handleAddEmailSuccess}
      />
      <ReduceBalanceDialog
        customer={customer}
        open={isBalanceDialogOpen}
        onOpenChange={setIsBalanceDialogOpen}
        onSuccess={handleReduceBalanceSuccess}
      />
      <div className="w-full min-h-screen px-4 py-8 flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold tracking-tight">Customer Profile</h1>

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

        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {customerLoans.length === 0 ? (
            <Card>
              <CardContent className="flex h-32 items-center justify-center">
                <p className="text-muted-foreground">
                  This customer has no loans.
                </p>
              </CardContent>
            </Card>
          ) : (
            customerLoans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                onSuccess={() => fetchCustomerLoans(Id)}
              />
            ))
          )}
        </div>

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

        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
            <div className="flex gap-2">
              <Button onClick={() => setIsEmailDialogOpen(true)}>
                Add Email
              </Button>
              <Button onClick={() => setIsPhoneDialogOpen(true)}>
                Add Phone Number
              </Button>
            </div>
            <CardDescription>
              Customer&apos;s contact information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {customer.emailDetails.length > 0 ||
            customer.phoneDetails.length > 0 ? (
              <FieldGroup>
                {customer.emailDetails.length > 0 && (
                  <>
                    <h3 className="font-semibold mb-2">Email Addresses</h3>
                    {customer.emailDetails.map((email, index) => (
                      <Field key={`email-${index}`} className="mb-2">
                        <FieldLabel>Email #{index + 1}</FieldLabel>
                        <Input disabled value={email.email} />
                      </Field>
                    ))}
                  </>
                )}
                {customer.phoneDetails.length > 0 && (
                  <>
                    <h3 className="font-semibold mt-4 mb-2">Phone Numbers</h3>
                    {customer.phoneDetails.map((phone, index) => (
                      <Field key={`phone-${index}`} className="mb-2">
                        <FieldLabel>Phone #{index + 1}</FieldLabel>
                        <Input disabled value={phone.phoneNumber} />
                      </Field>
                    ))}
                  </>
                )}
              </FieldGroup>
            ) : (
              <p className="text-gray-500">No contact details found.</p>
            )}
          </CardContent>
        </Card>

        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle>Document Information</CardTitle>
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

        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle>Status History</CardTitle>
            <CardDescription>Record of account status changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No status history found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle>Loan History</CardTitle>
            <CardDescription>
              Record of Active or Inactive loans.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {customer.customerLoanHistories &&
            customer.customerLoanHistories.length > 0 ? (
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
                  {customer.customerLoanHistories.map((loan, index) => (
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
                        {new Date(loan.approvedAt).toLocaleString()}
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
    </>
  );
}
