"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoanProductsTable } from "../_components/tables/LoanProductsTable";
import { LoanProductFormDialog } from "../_components/dialogs/AddLoanProductDialog";

export default function Page() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tableKey, setTableKey] = useState(0);

  const handleSuccess = () => {
    setTableKey((prevKey) => prevKey + 1);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="mb-4"
        onClick={() => setIsDialogOpen(true)}
      >
        Create Product for Approval
      </Button>
      <LoanProductFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={handleSuccess}
      />
      <LoanProductsTable key={tableKey} />
    </>
  );
}
