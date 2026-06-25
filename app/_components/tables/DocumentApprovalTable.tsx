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

export function DocumentApprovalTable() {
  type TableRow = {
    customer_id: string;
    fullName: string;
    country: string;
    zipCode: string;
    addressLine: string;
    documentType: string;
    documentImagePath: string;
    submittedBy: string;
    submittedAt: Date;
  };

  const [documents, setDocuments] = React.useState<TableRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchDocuments() {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/get-document-submissions");
        if (res.ok) {
          const data = await res.json();
          setDocuments(data);
        }
      } catch (error) {
        console.error("Failed to fetch document submissions:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDocuments();
  }, []);

  const columns = useMemo<ColumnDef<TableRow>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "Full Name",
      },
      {
        accessorKey: "country",
        header: "Country",
      },
      {
        accessorKey: "zipCode",
        header: "Zip Code",
      },
      {
        accessorKey: "addressLine",
        header: "Address Line",
      },
      {
        accessorKey: "documentType",
        header: "Document Type",
      },
      {
        accessorKey: "documentImagePath",
        header: "Document Image Path",
      },
      {
        accessorKey: "submittedBy",
        header: "Submitted By",
      },
      {
        accessorKey: "submittedAt",
        header: "Submitted Date Time",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm">
              Approve
            </Button>
            <Button variant="destructive" size="sm">
              Reject
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  const data = useMemo(() => documents, [documents]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Document Approval Requests</CardTitle>
          <CardDescription>View Customers Requirements</CardDescription>
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
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
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
