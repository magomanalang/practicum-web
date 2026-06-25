"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function AuditLogsTable() {
  type TableRow = {
    id: string;
    type: string;
    action: string;
    performedBy: string;
    performedAt: Date;
    details: string;
    oldValue: string;
    newValue: string;
  };

  const [customers, setCustomers] = React.useState<TableRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchAuditLogs() {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/get-audit-logs");
        if (res.ok) {
          const data = await res.json();
          setCustomers(data);
        }
      } catch (error) {
        console.error("Failed to fetch Audit Logs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAuditLogs();
  }, []);

  const columns = useMemo<ColumnDef<TableRow>[]>(
    () => [
      {
        accessor_key: "type",
        header: "Type",
      },
      {
        accessorKey: "action",
        header: "Action",
      },
      {
        accessorKey: "details",
        header: "Details",
      },
      {
        accessorKey: "oldValue",
        header: "Old Value",
      },
      {
        accessorKey: "newValue",
        header: "New Value",
      },
      {
        accessorKey: "performedBy",
        header: "Performed By",
      },
      {
        accessorKey: "performedAt",
        header: "Performed Date Time",
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
          <CardTitle>Audit Logs</CardTitle>
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
