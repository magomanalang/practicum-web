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

export function LoansTable() {
  type TableRow = {
    id: string;
    customerId: string;
    name: string;
    loanProductId: string;
    loanName: string;
    description: string;
    amount: number;
    interestRate: string;
    status: string;
    startDate: Date;
    endDate: Date;
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
        header: "Customer Name",
      },
      {
        accessorKey: "loanName",
        header: "Loan Product",
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        id: "amount",
        header: "Amount",
      },
      {
        id: "interest",
        header: "Interest",
      },
      {
        id: "status",
        header: "Status",
      },
      {
        id: "startDate",
        header: "Start Date",
      },
      {
        id: "endDate",
        header: "End Date",
      },
      {
        id: "approvedBy",
        header: "Approved By",
      },
      {
        id: "approvedDate",
        header: "Approved Date",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button variant="link" size="sm">
            Click to View
          </Button>
        ),
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
          <CardTitle>Loans List</CardTitle>
          <CardDescription>A list of all current Loans.</CardDescription>
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
