"use client";

import {
  EmployeeRolesReadable,
  RoleNameToValueMap,
} from "@/app/_constants/employeeRoles";
import { RequestTypeReadable } from "@/app/_constants/requestTypes";
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
import React from "react";
import { useMemo } from "react";

export function EmployeesTable() {
  type TableRow = {
    employeeId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    suffix: string;
    email: string;
    employeeRoles: number[];
    createdBy: string;
    createdDateTime: Date;
    approvedBy: string;
    approvedDateTime: Date;
  };

  const [employees, setEmployees] = React.useState<TableRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchEmployeeRequests() {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/get-employees");
        if (res.ok) {
          const data = await res.json();
          setEmployees(data);
        }
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEmployeeRequests();
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
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "employeeRoles",
        header: "Roles",
        cell: ({ row }) => {
          const rolesValue = row.original.employeeRoles;

          if (
            !rolesValue ||
            (Array.isArray(rolesValue) && rolesValue.length === 0)
          ) {
            return "No Roles";
          }

          const normalizedArray = Array.isArray(rolesValue)
            ? rolesValue
            : [rolesValue];

          return normalizedArray
            .map((role) => {
              if (typeof role === "string") {
                const matchedEnumIntValue = RoleNameToValueMap[role];
                return matchedEnumIntValue !== undefined
                  ? EmployeeRolesReadable(matchedEnumIntValue)
                  : role;
              }

              return EmployeeRolesReadable(role);
            })
            .join(", ");
        },
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

  const data = useMemo<TableRow[]>(() => employees, [employees]);

  // eslint-disable-next-line react-hooks/incompatible-library
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
