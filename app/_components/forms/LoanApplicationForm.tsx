"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import LoanProductDropDown from "../dropdowns/LoanProductDropDown";
import CustomerListDropDown from "../dropdowns/CustomerListDropDown";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Banknote,
  CalendarClock,
  Info,
  Percent,
  PiggyBank,
} from "lucide-react";
import { toFormattedPhDateTime } from "@/app/_helpers/FormattedDateTime";
import { useSession } from "next-auth/react";
import { CommonStatus } from "@/app/_constants/commonStatus";

interface LoanProductDetails {
  loanName: string;
  interestRate: number | null;
  minimumAmount: number | null;
  maximumAmount: number | null;
  minimumTermMonths: number | null;
  maximumTermMonths: number | null;
}

const INITIAL_PRODUCT_DETAILS: LoanProductDetails = {
  loanName: "",
  interestRate: null,
  minimumAmount: null,
  maximumAmount: null,
  minimumTermMonths: null,
  maximumTermMonths: null,
};

export function LoanApplicationForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const [customerId, setCustomerId] = useState("");
  const [customerFullName, setCustomerFullName] = useState("");
  const [loanProductId, setLoanProductId] = useState("");
  const [productDetails, setProductDetails] = useState<LoanProductDetails>(
    INITIAL_PRODUCT_DETAILS,
  );
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState({
    requestedAmount: "",
    requestedTerm: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data: session } = useSession();

  const fetchLoanProductDetails = async (loanProductId: string) => {
    try {
      const res = await fetch(
        `/api/auth/get-loan-product?id=${encodeURIComponent(loanProductId)}`,
      );
      if (!res.ok) {
        throw new Error("Failed to fetch loan product");
      }
      const data = await res.json();
      setProductDetails({
        ...data,
        loanName: data.name,
      });
    } catch (err) {
      console.error("Error fetching loan product details:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load loan product details.",
      );
      setProductDetails(INITIAL_PRODUCT_DETAILS);
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (id: string) => {
    setLoanProductId(id);
    if (id) {
      setLoading(true);
      fetchLoanProductDetails(id);
    } else {
      setProductDetails(INITIAL_PRODUCT_DETAILS);
    }
  };

  const dateNow = toFormattedPhDateTime();
  const amount = Number(proposal.requestedAmount);
  const rate = productDetails.interestRate ?? 0;
  const finalAmount = amount + amount * (rate / 100);

  async function handleAddLoanRequest() {
    try {
      const res = await fetch("/api/auth/add-loan-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          CustomerId: parseInt(customerId),
          Name: customerFullName,
          LoanProductId: parseInt(loanProductId),
          LoanName: productDetails.loanName,
          Amount: amount,
          InterestRate: productDetails.interestRate,
          FinalAmount: finalAmount,
          Status: CommonStatus.Pending,
          Months: parseInt(proposal.requestedTerm),
          CreatedBy: session?.user?.email || "Admin",
          CreatedDateTime: dateNow,
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
      setSubmitting(false);
    }
  }

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
  }

  function handleProposalChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setProposal((prev) => ({ ...prev, [id]: value }));
  }

  const formatCurrency = (value: number | null) => {
    if (value === null) return "-";
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(value);
  };

  const isProductSelected = !!productDetails.interestRate;

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-12 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Loan Application
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            A seamless and secure way to apply for your financial needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="h-6 w-6 text-green-600" />
                  <span>Select Your Loan</span>
                </CardTitle>
                <CardDescription>
                  Choose a customer and a loan product to get started.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field>
                    <FieldLabel>Customer</FieldLabel>
                    <CustomerListDropDown
                      value={customerId}
                      onChange={(id, fullName) => {
                        setCustomerId(id);
                        setCustomerFullName(fullName);
                      }}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Loan Product</FieldLabel>
                    <LoanProductDropDown
                      value={loanProductId}
                      onChange={handleProductChange}
                    />
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>

            <Card
              className={`transition-opacity duration-300 ${!isProductSelected ? "opacity-50 pointer-events-none" : ""}`}
            >
              <CardHeader>
                <CardTitle>Your Loan Proposal</CardTitle>
                <CardDescription>
                  Tell us how much you need and for how long.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent>
                  <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field>
                      <FieldLabel htmlFor="requestedAmount">
                        Requested Amount
                      </FieldLabel>
                      <Input
                        id="requestedAmount"
                        type="number"
                        placeholder="e.g., 100000"
                        value={proposal.requestedAmount}
                        onChange={handleProposalChange}
                        disabled={!isProductSelected || submitting}
                      />
                      {isProductSelected && (
                        <p className="pt-2 text-sm text-muted-foreground">
                          Allowed:{" "}
                          {formatCurrency(productDetails.minimumAmount)} –{" "}
                          {formatCurrency(productDetails.maximumAmount)}
                        </p>
                      )}
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="requestedTerm">
                        Requested Term (Months)
                      </FieldLabel>
                      <Input
                        id="requestedTerm"
                        type="number"
                        placeholder="e.g., 24"
                        value={proposal.requestedTerm}
                        onChange={handleProposalChange}
                        disabled={!isProductSelected || submitting}
                      />
                      {isProductSelected && (
                        <p className="pt-2 text-sm text-muted-foreground">
                          Allowed: {productDetails.minimumTermMonths} –{" "}
                          {productDetails.maximumTermMonths} months
                        </p>
                      )}
                    </Field>
                  </FieldGroup>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                    disabled={!isProductSelected || submitting}
                    onClick={handleAddLoanRequest}
                  >
                    {submitting ? "Submitting..." : "Submit Loan Request"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Loan Product Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-8 w-2/3" />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-8 w-2/3" />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-8 w-2/3" />
                    </div>
                  </div>
                ) : isProductSelected ? (
                  <div className="space-y-6">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Percent className="h-4 w-4 mr-2" />
                        Interest Rate
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        {productDetails.interestRate?.toFixed(2)}%
                      </span>
                    </div>
                    <Separator />
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Banknote className="h-4 w-4 mr-2" />
                        Amount Range
                      </span>
                      <span className="text-xl font-semibold">
                        {formatCurrency(productDetails.minimumAmount)} –{" "}
                        {formatCurrency(productDetails.maximumAmount)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <CalendarClock className="h-4 w-4 mr-2" />
                        Loan Term
                      </span>
                      <span className="text-xl font-semibold">
                        {productDetails.minimumTermMonths} –{" "}
                        {productDetails.maximumTermMonths} months
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-10">
                    <Info className="mx-auto h-12 w-12" />
                    <p className="mt-4 text-sm">
                      Select a loan product to see its details here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
