"use client";

import { LoanCategoriesToValueMap } from "@/app/_constants/loanCategories";
import { RequestTypes } from "@/app/_constants/requestTypes";
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
import { useSession } from "next-auth/react";
import React from "react";
import { useMemo } from "react";

export function LoanProductsTable() {
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
    createdBy: string;
    createdDateTime: Date;
    approvedBy: string;
    approvedDate: Date;
  };

  const [loanProducts, setLoanProducts] = React.useState<TableRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  const { data: session } = useSession();
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleDeleteLoanProduct = async (loanProducts: TableRow) => {
    setSuccess(null);
    setError(null);
    setLoading(true);
    try {
      const dateTimeNow = toFormattedPhDateTime();
      const toLoanCategory =
        LoanCategoriesToValueMap[loanProducts.loanCategory] ?? 0;

      const res = await fetch("/api/add-loan-product-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Name: loanProducts.name,
          Description: loanProducts.description,
          LoanCategory: toLoanCategory,
          InterestRate: loanProducts.interestRate,
          MinimumAmount: loanProducts.minimumAmount,
          MaximumAmount: loanProducts.maximumAmount,
          MinimumTermMonths: loanProducts.minimumTermMonths,
          MaximumTermMonths: loanProducts.maximumTermMonths,
          IsPromotion: loanProducts.isPromotion,
          RequestType: RequestTypes.Remove,
          CreatedBy: session?.user?.email || "Admin",
          CreatedDateTime: dateTimeNow,
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
    async function fetchLoanProducts() {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/get-loan-products");
        if (res.ok) {
          const data = await res.json();
          setLoanProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch loan products list:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLoanProducts();
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
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <>
            <Button variant="link" size="sm">
              Edit Value
            </Button>{" "}
            <Button
              variant="link"
              size="sm"
              onClick={() => handleDeleteLoanProduct(row.original)}
            >
              Delete
            </Button>
          </>
        ),
      },
    ],
    [],
  );

  const data = useMemo<TableRow[]>(() => loanProducts, [loanProducts]);

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
