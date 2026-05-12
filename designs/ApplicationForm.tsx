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

export function ApplicationForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const [form, setForm] = useState({
    fullName: "",
    country: "",
    zipCode: "",
    address: "",
  });

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    // TODO: Handle form submission later
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  return (
    <div className="dark w-full min-h-screen px-4 py-12 md:py-16 flex flex-col items-center justify-center bg-green-950 text-zinc-300">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-8 text-green-400">
        Loan Application
      </h1>
      <Card className="w-full max-w-2xl" {...props}>
        <CardHeader>
          <CardTitle>Applicant Details</CardTitle>
          <CardDescription>
            Please fill out the details below to submit your application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                <Input
                  id="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="country">Country</FieldLabel>
                  <Input
                    id="country"
                    type="text"
                    value={form.country}
                    onChange={handleChange}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="zipCode">Zip Code</FieldLabel>
                  <Input
                    id="zipCode"
                    type="text"
                    value={form.zipCode}
                    onChange={handleChange}
                    required
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="address">Address Line</FieldLabel>
                <Input
                  id="address"
                  type="text"
                  placeholder="Unit no. / Brgy. Name / Street Name / Village Name"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
                <FieldDescription>
                  We&apos;ll use this for your billing information.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="document">Document Upload</FieldLabel>
                <Input
                  id="document"
                  type="file"
                  accept="image/*,.pdf"
                  required
                  className="cursor-pointer"
                />
                <FieldDescription>
                  Please upload a valid ID or required document.
                </FieldDescription>
              </Field>

              <Field className="pt-4">
                <Button type="submit" className="w-full">
                  Submit Application
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
