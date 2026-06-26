"use client";

import {
  EmployeeRolesReadable,
  RoleNameToValueMap,
} from "@/app/_constants/employeeRoles";
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
import React, { useMemo } from "react";
import { useSession } from "next-auth/react";
import { RequestTypes } from "@/app/_constants/requestTypes";

export function EmployeesTable() {
  type TableRow = {
    employeeId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    suffix: string;
    email: string;
    password: string;
    employeeRoles: number[];
    createdBy: string;
    createdDateTime: Date;
    approvedBy: string;
    approvedDateTime: Date;
  };

  const [employees, setEmployees] = React.useState<TableRow[]>([]);
  const { data: session } = useSession();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleDeleteEmployee = async (employee: TableRow) => {
    setSuccess(null);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/add-employee-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          FirstName: employee.firstName,
          MiddleName: employee.middleName,
          LastName: employee.lastName,
          Suffix: employee.suffix,
          Email: employee.email,
          Password: employee.password,
          EmployeeId: employee.employeeId,
          EmployeeRoles: employee.employeeRoles,
          RequestType: RequestTypes.Remove,
          CreatedDateTime: toFormattedPhDateTime(),
          CreatedBy: session?.user?.email || "Admin",
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
  };

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
      { accessorKey: "employeeId", header: "Employee ID" },
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
            <Button variant="link" size="sm">
              Add Role
            </Button>{" "}
            <Button
              variant="link"
              size="sm"
              onClick={() => handleDeleteEmployee(row.original)}
            >
              Delete
            </Button>
          </>
        ),
      },
    ], // eslint-disable-next-line react-hooks/exhaustive-deps
    [session],
  );

  const data = useMemo<TableRow[]>(() => employees, [employees]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Card>
        <CardHeader>
          {success && (
            <div className="p-3 text-sm font-medium text-green-600 bg-green-50 dark:bg-green-950/30 rounded-md border border-green-200 dark:border-green-900/50">
              {success}
            </div>
          )}
          {error && (
            <div className="p-3 text-sm font-medium text-red-500 bg-red-50 dark:bg-red-950/30 rounded-md border border-red-200 dark:border-red-900/50">
              {error}
            </div>
          )}
          <CardTitle>Employee List</CardTitle>
          <CardDescription>A list of all Employees.</CardDescription>
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
