"use client";

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
import React from "react";
import { useMemo } from "react";

export function LoanProductRequestsTable() {
  type TableRow = {
    id: string;
    name: string;
    description: string;
    loan_category: string;
    interestRate: string;
    minimumAmount: number;
    maximumAmount: number;
    minimumTermMonths: number;
    maximumTermMonths: number;
    isPromotion: boolean;
    createdBy: string;
    createdDateTime: Date;
  };

  const [loanProductRequests, setLoanProductRequests] = React.useState<
    TableRow[]
  >([]);
  const [loading, setLoading] = React.useState(true);

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
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <>
            <Button variant="outline" size="sm">
              Approve
            </Button>
            <Button variant="destructive" size="sm" className="ml-2">
              Reject
            </Button>
          </>
        ),
      },
    ],
    [],
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
