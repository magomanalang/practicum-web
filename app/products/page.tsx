import { Button } from "@base-ui/react";
import { LoanProductsTable } from "../_components/tables/LoanProductsTable";

export default function Page() {
  return (
    <>
      <Button>Create Product for Approval</Button>
      <LoanProductsTable />
    </>
  );
}
