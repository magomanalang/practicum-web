"use client";

import { LoanCategoriesToValueMap } from "@/app/_constants/loanCategories";
import {
  RequestTypeReadable,
  RequestTypes,
  RequestTypeToValueMap,
} from "@/app/_constants/requestTypes";
import { toFormattedPhDateTime } from "@/app/_helpers/FormattedDateTime";
import { Badge } from "@/components/ui/badge";
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

export function LoanProductRequestsTable() {
  type TableRow = {
    id: string;
    name: string;
    description: string;
    loanCategory: string;
    interestRate: string;
    minimumAmount: number;
    maximumAmount: number;
    minimumTermMonths: number;
    maximumTermMonths: number;
    isPromotion: boolean;
    requestType: string;
    createdBy: string;
    createdDateTime: Date;
  };

  const [loanProductRequests, setLoanProductRequests] = React.useState<
    TableRow[]
  >([]);
  const [loading, setLoading] = React.useState(true);
  const { data: session } = useSession();
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchLoanProductRequests() {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/get-loan-product-requests");
        if (res.ok) {
          const data = await res.json();
          setLoanProductRequests(data);
        }
      } catch (error) {
        console.error("Failed to fetch loans list:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLoanProductRequests();
  }, []);

  const handleRejectClick = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/auth/reject-loan-product-request?id=${id}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) {
        setLoanProductRequests((prevLoanProductRequests) =>
          prevLoanProductRequests.filter(
            (loanProductRequests) => loanProductRequests.id !== id,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to reject loan product request:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteLoanProductRequest = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/auth/delete-loan-product-request?id=${id}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) {
        setLoanProductRequests((prevLoanProducts) =>
          prevLoanProducts.filter((loanProducts) => loanProducts.id !== id),
        );
      }
    } catch (error) {
      console.error("Failed to delete employee request:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleApproveClick = useCallback(
    async (loanProductRequest: TableRow) => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const dateTimeNow = toFormattedPhDateTime();
      const requestTypeNum =
        typeof loanProductRequest.requestType === "string"
          ? RequestTypeToValueMap[loanProductRequest.requestType]
          : Number(loanProductRequest.requestType);

      if (requestTypeNum === RequestTypes.Add) {
        try {
          const res = await fetch("/api/auth/add-loan-product", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              Name: loanProductRequest.name,
              Description: loanProductRequest.description,
              LoanCategory: loanProductRequest.loanCategory,
              InterestRate: loanProductRequest.interestRate,
              MinimumAmount: loanProductRequest.minimumAmount,
              MaximumAmount: loanProductRequest.maximumAmount,
              MinimumTermMonths: loanProductRequest.minimumTermMonths,
              MaximumTermMonths: loanProductRequest.maximumTermMonths,
              IsPromotion: loanProductRequest.isPromotion,
              CreatedBy: loanProductRequest.createdBy,
              CreatedDateTime: loanProductRequest.createdDateTime,
              ApprovedBy: session?.user?.email || "Admin",
              ApprovedDateTime: dateTimeNow,
            }),
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message ?? "Something went wrong.");
          }

          setLoanProductRequests((prev) =>
            prev.filter((lp) => lp.id !== loanProductRequest.id),
          );
          deleteLoanProductRequest(loanProductRequest.id);
          setSuccess("Loan Product registration quest approved!");
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Could not reach the server.",
          );
        } finally {
          setLoading(false);
        }
      } else {
        try {
          const res = await fetch("/api/auth/delete-loan-product", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              Name: loanProductRequest.name,
              Description: loanProductRequest.description,
            }),
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data?.message ?? "Something went wrong.");
          }

          setLoanProductRequests((prev) =>
            prev.filter((lp) => lp.id !== loanProductRequest.id),
          );
          deleteLoanProductRequest(loanProductRequest.id);
          setSuccess("Loan Product deletion request approved!");
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not approve deletion request.",
          );
        } finally {
          setLoading(false);
        }
      }
    },
    [session?.user?.email, deleteLoanProductRequest],
  );

  const columns = useMemo<ColumnDef<TableRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "loan_category",
        header: "Category",
      },
      {
        accessorKey: "interestRate",
        header: "Interest Rate",
      },
      {
        accessorKey: "minimumAmount",
        header: "Min. Amount",
      },
      {
        accessorKey: "maximumAmount",
        header: "Max. Amount",
      },
      {
        accessorKey: "minimumTermMonths",
        header: "Min. Term",
      },
      {
        accessorKey: "maximumTermMonths",
        header: "Max. Term",
      },
      {
        accessorKey: "isPromotion",
        header: "Promotion",
        cell: ({ row }) => (row.getValue("isPromotion") ? "Yes" : "No"),
      },
      {
        accessorKey: "createdBy",
        header: "Created By",
      },
      {
        accessorKey: "createdDateTime",
        header: "Created At",
      },
      {
        id: "requestType",
        header: "Request Type",
        cell: ({ row }) => {
          const rawType = row.original.requestType;

          const parsedType =
            typeof rawType === "string" && !isNaN(Number(rawType))
              ? parseInt(rawType, 10)
              : rawType;

          return (
            <Badge variant="outline">
              {typeof parsedType === "number"
                ? RequestTypeReadable(parsedType)
                : String(rawType)}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleApproveClick(row.original)}
            >
              Approve
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="ml-2"
              onClick={() => handleRejectClick(row.original.id)}
            >
              Reject
            </Button>
          </>
        ),
      },
    ],
    [handleApproveClick],
  );

  const data = useMemo<TableRow[]>(
    () => loanProductRequests,
    [loanProductRequests],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Loan Product Requests List</CardTitle>
          <CardDescription>
            A list of all current Loan Product Requests.
          </CardDescription>
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
