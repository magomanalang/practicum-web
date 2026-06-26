"use client";

import {
  EmployeeRolesReadable,
  RoleNameToValueMap,
} from "@/app/_constants/employeeRoles";
import { RequestTypeReadable } from "@/app/_constants/requestTypes";
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

export function EmployeeRequestsTable() {
  type TableRow = {
    id: string;
    employeeId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    suffix: string;
    email: string;
    password?: string;
    employeeRoles: number[];
    requestType: string;
    createdBy: string;
    createdDateTime: Date;
  };

  const [employees, setEmployees] = React.useState<TableRow[]>([]);
  const { data: session } = useSession();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchEmployeeRequests() {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/get-employee-requests");
        if (res.ok) {
          const data = await res.json();
          setEmployees(data);
        }
      } catch (error) {
        console.error("Failed to fetch employee requests:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEmployeeRequests();
  }, []);

  const handleRejectClick = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/reject-employee-request?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEmployees((prevEmployees) =>
          prevEmployees.filter((employee) => employee.id !== id),
        );
      }
    } catch (error) {
      console.error("Failed to reject employee request:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEmployeeRequest = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/delete-employee-request?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEmployees((prevEmployees) =>
          prevEmployees.filter((employee) => employee.id !== id),
        );
      }
    } catch (error) {
      console.error("Failed to delete employee request:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleApproveClick = useCallback(
    async (employee: TableRow) => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const dateTimeNow = toFormattedPhDateTime();
      try {
        const res = await fetch("/api/auth/register-employee", {
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
            CreatedDateTime: employee.createdDateTime,
            CreatedBy: employee.createdBy,
            ApprovedBy: session?.user?.email || "Admin",
            ApprovedDateTime: dateTimeNow,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message ?? "Something went wrong.");
        }

        setSuccess("Employee registration request approved!");
        setEmployees((prev) => prev.filter((e) => e.id !== employee.id));
        deleteEmployeeRequest(employee.id);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not reach the server.",
        );
      } finally {
        setLoading(false);
      }
    },
    [session?.user?.email, deleteEmployeeRequest],
  );

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
        header: "Roles to be Assigned",
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
        accessorKey: "requestType",
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
              variant="outline"
              size="sm"
              onClick={() => handleRejectClick(row.original.id)}
            >
              Reject
            </Button>
          </>
        ),
      },
    ],
    [handleApproveClick, handleRejectClick],
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
          <CardTitle>Employee Requests</CardTitle>
          <CardDescription>
            A list of all employee registration requests.
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
