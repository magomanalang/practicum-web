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

export function CustomersTable() {
  type TableRow = {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    suffix: string;
    balance: number;
    dateOfBirth: Date;
    status: string;
  };

  const [customers, setCustomers] = React.useState<TableRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/get-customers");
        if (res.ok) {
          const data = await res.json();
          setCustomers(data);
        }
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const columns = useMemo<ColumnDef<TableRow>[]>(
    () => [
      {
        accessorFn: (row) =>
          [row.firstName, row.middleName, row.lastName, row.suffix]
            .filter(Boolean)
            .join(" "),
        id: "fullName",
        header: "Full Name",
      },
      {
        accessorKey: "balance",
        header: () => <div className="text-center">Balance</div>,
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("balance"));
          const formatted = new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
          }).format(amount);

          return <div className="text-center font-medium">{formatted}</div>;
        },
      },
      {
        accessorKey: "dateOfBirth",
        header: "Date Of Birth",
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        id: "view",
        header: "View",
        cell: ({ row }) => (
          <Button variant="link" size="sm">
            View Full Profile
          </Button>
        ),
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

  const data = useMemo<TableRow[]>(() => customers, [customers]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>A list of all customers.</CardDescription>
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
