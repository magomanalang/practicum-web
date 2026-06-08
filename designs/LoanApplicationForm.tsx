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
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import LoanProductDropDown from "./LoanProductDropDown";

export function LoanApplicationForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const [form, setForm] = useState({
    loanProduct: "",
    interestRate: "",
    minimumAmount: "",
    maximumAmount: "",
    minimumTerm: "",
    maximumTerm: "",
    proposalAmount: "",
    proposalTerm: "",
  });

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
              <LoanProductDropDown
                value={form.loanProduct}
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, documentType: val }))
                }
              />
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
