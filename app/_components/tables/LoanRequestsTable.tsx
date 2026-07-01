"use client";

import { toFormattedPhDateTime } from "@/app/_helpers/FormattedDateTime";
import { Button } from "@/components/ui/button";
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
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import React, { useCallback } from "react";
import { useMemo } from "react";

export function LoanRequestsTable() {
  type TableRow = {
    id: string;
    name: string;
    loanName: string;
    amount: number;
    interestRate: number;
    finalAmount: number;
    status: string;
    endDate: number;
    createdBy: string;
    createdDateTime: Date;
  };

  const [loanRequests, setLoanRequests] = React.useState<TableRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  React.useState<TableRow | null>(null);
  const [tableKey, setTableKey] = React.useState(0);

  const { data: session } = useSession();
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleDeleteLoanRequest = useCallback(
    async (loanRequests: TableRow) => {
      setSuccess(null);
      setError(null);
      setLoading(true);
      try {
        const dateTimeNow = toFormattedPhDateTime();

        const res = await fetch("/api/auth/delete-loan-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Name: loanRequests.name,
            LoanName: loanRequests.loanName,
            Amount: loanRequests.amount,
            InterestRate: loanRequests.interestRate,
            FinalAmount: loanRequests.finalAmount,
            Status: loanRequests.status,
            StartDate: dateTimeNow,
            EndDate: loanRequests.endDate,
            CreatedBy: loanRequests.createdBy,
            CreatedDateTime: loanRequests.createdDateTime,
            ApprovedBy: session?.user?.email || "Admin",
            ApprovedDateTime: dateTimeNow,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.message ?? "Something went wrong.");
        } else {
          setSuccess(
            "Employee delete request submitted successfully for approval!",
          );
        }
      } catch {
        setError("Could not reach the server. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [session?.user?.email],
  );
  const handleApproveLoanRequest = useCallback(
    async (loanRequests: TableRow) => {
      setSuccess(null);
      setError(null);
      setLoading(true);
      try {
        const dateTimeNow = toFormattedPhDateTime();

        const res = await fetch("/api/auth/add-loan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Name: loanRequests.name,
            LoanName: loanRequests.loanName,
            Amount: loanRequests.amount,
            InterestRate: loanRequests.interestRate,
            FinalAmount: loanRequests.finalAmount,
            Status: loanRequests.status,
            StartDate: dateTimeNow,
            EndDate: loanRequests.endDate,
            CreatedBy: loanRequests.createdBy,
            CreatedDateTime: loanRequests.createdDateTime,
            ApprovedBy: session?.user?.email || "Admin",
            ApprovedDateTime: dateTimeNow,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.message ?? "Something went wrong.");
        } else {
          setSuccess(
            "Employee delete request submitted successfully for approval!",
          );
        }
      } catch {
        setError("Could not reach the server. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [session?.user?.email],
  );
  React.useEffect(() => {
    async function fetchLoanRequests() {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/get-loan-requests");
        if (res.ok) {
          const data = await res.json();
          setLoanRequests(data);
        }
      } catch (error) {
        console.error("Failed to fetch loan products list:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLoanRequests();
  }, [tableKey]);

  const columns = useMemo<ColumnDef<TableRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Product Name",
      },
      {
        accessorKey: "loanName",
        header: "Loan Name",
      },
      {
        accessorKey: "amount",
        header: "Proposed Amount",
      },
      {
        accessorKey: "interestRate",
        header: "Interest Rate",
      },
      {
        accessorKey: "finalAmount",
        header: "Final Amount",
      },
      {
        accessorKey: "endDate",
        header: "Proposed Months To Finish",
      },
      {
        accessorKey: "createdBy",
        header: "Created By",
      },
      {
        accessorKey: "createdDateTime",
        header: "Created Date Time",
      },
      {
        accessorKey: "approvedBy",
        header: "Approved By",
      },
      {
        accessorKey: "approvedDateTime",
        header: "Approved Date Time",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <>
            <Button
              variant="link"
              size="sm"
              onClick={() => handleApproveLoanRequest(row.original)}
            >
              Approve
            </Button>
            <Button
              variant="link"
              size="sm"
              onClick={() => handleDeleteLoanRequest(row.original)}
            >
              Reject
            </Button>
          </>
        ),
      },
    ],
    [],
  );

  const data = useMemo<TableRow[]>(() => loanRequests, [loanRequests]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Loan Requests List</CardTitle>
          <CardDescription>A list of customers loan requests.</CardDescription>
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
                  <TableRow
                    key={row.id}
                    className="transition-colors hover:bg-muted/50"
                  >
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
