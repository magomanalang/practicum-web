"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import LoanProductDropDown from "../dropdowns/LoanProductDropDown";
import CustomerListDropDown from "../dropdowns/CustomerListDropDown";
import { toFormattedPhDateTime } from "@/app/_helpers/FormattedDateTime";

export function LoanApplicationForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const [form, setForm] = useState({
    customerId: "",
    loanProduct: "",
    interestRate: "",
    amount: "",
    startDate: "",
    endDate: "",
  });

  const dateToday = toFormattedPhDateTime();

  useEffect(() => {
    if (!form.loanProduct) {
      return;
    }

    const fetchLoanProductDetails = async () => {
      try {
        const res = await fetch(
          `/api/auth/get-loan-product?id=${encodeURIComponent(form.loanProduct)}`,
        );
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.interestRate !== "undefined") {
            setForm((prev) => ({
              ...prev,
              interestRate: data.interestRate.toString(),
            }));
          }
        } else {
          console.error("Failed to fetch loan product details");
        }
      } catch (error) {
        console.error("Error fetching loan product details:", error);
      }
    };
    fetchLoanProductDetails();
  }, [form.loanProduct]);
  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  return (
    <div className="w-full min-h-screen px-4 py-12 md:py-16 flex flex-col items-center justify-center">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-8 text-green-400">
        Loan Application
      </h1>
      <Card className="w-full max-w-2xl" {...props}>
        <CardHeader>
          <CardTitle>Loan Details</CardTitle>
          <CardDescription>
            Please fill out the details below to submit your application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="fullName">Loan Product</FieldLabel>
              </Field>

              <CustomerListDropDown
                value={form.customerId}
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, customerId: val }))
                }
              />
              <LoanProductDropDown
                value={form.loanProduct}
                onChange={(val) =>
                  setForm((prev) => ({
                    ...prev,
                    loanProduct: val,
                    interestRate: "",
                  }))
                }
              />
              <Input
                value={form.amount}
                onChange={handleChange}
                id="amount"
                placeholder="Amount"
              />
              <Input
                value={form.interestRate}
                onChange={handleChange}
                id="interestRate"
                placeholder="Interest Rate"
                disabled
              />

              <Input
                value={form.endDate}
                onChange={handleChange}
                id="endDate"
                min={dateToday}
                placeholder="Months"
              />
              <Button>Submit Loan for Approval</Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
