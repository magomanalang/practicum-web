"use client";

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

export function LoanProductsTable() {
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
    approvedBy: string;
    approvedDate: Date;
  };

  const [loans, setLoans] = React.useState<TableRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      try {
        const res = await fetch("/api/get-loans");
        if (res.ok) {
          const data = await res.json();
          setLoans(data);
        }
      } catch (error) {
        console.error("Failed to fetch loans list:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const columns = useMemo<ColumnDef<TableRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Product Name",
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "loanCategory",
        header: "Category",
      },
      {
        accessorKey: "minimumAmount",
        header: "Minimum Amount",
      },
      {
        accessorKey: "maximumAmount",
        header: "Maximum Amount",
      },
      {
        accessorKey: "minimumTermMonths",
        header: "Minimum Term (Months)",
      },
      {
        accessorKey: "maximumTermMonths",
        header: "Maximum Term (Months)",
      },
      {
        accessorKey: "isPromotion",
        header: "PROMO",
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
    ],
    [],
  );

  const data = useMemo<TableRow[]>(() => loans, [loans]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Products List</CardTitle>
          <CardDescription>A list of products.</CardDescription>
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
