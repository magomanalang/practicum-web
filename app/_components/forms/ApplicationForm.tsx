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
import { useState } from "react";
import DocumentDropDown from "../dropdowns/DocumentDropDown";
import CustomerListDropDown from "../dropdowns/CustomerListDropDown";
import { useRouter } from "next/navigation";

type FormState = {
  customerId: string;
  fullName: string;
  country: string;
  zipCode: string;
  addressLine: string;
  documentType: string;
  documentImagePath: string;
  submittedBy: string;
};

const INITIAL_STATE: FormState = {
  customerId: "",
  fullName: "",
  country: "",
  zipCode: "",
  addressLine: "",
  documentType: "",
  documentImagePath: "",
  submittedBy: "System",
};

export function ApplicationForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const numericCustomerId =
        form.customerId.trim() === "" ? "0" : form.customerId;

      const payload = {
        CustomerId: parseInt(numericCustomerId, 10),
        FullName: form.fullName.trim(),
        Country: form.country.trim(),
        ZipCode: form.zipCode.trim(),
        AddressLine: form.addressLine.trim(),
        DocumentType: form.documentType,
        DocumentImagePath: form.documentImagePath.trim(),
        submittedBy: form.submittedBy,
      };

      const res = await fetch("/api/document-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          throw new Error(data.message ?? "Something went wrong.");
        } else {
          const textError = await res.text();
          throw new Error(
            textError || `Server returned status code ${res.status}`,
          );
        }
      }

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not reach the server.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  }

  return (
    <div className="w-full min-h-screen px-4 py-12 md:py-16 flex flex-col items-center justify-center">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-8 text-green-400">
        User Application
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
              {error && (
                <div className="p-3 text-sm font-medium text-red-500 bg-red-50 dark:bg-red-950/30 rounded-md border border-red-200 dark:border-red-900/50">
                  {error}
                </div>
              )}

              <CustomerListDropDown
                value={form.customerId}
                onChange={(selectedId, selectedFullName) =>
                  setForm((prev) => ({
                    ...prev,
                    customerId: selectedId,
                    fullName: selectedFullName,
                  }))
                }
              />

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
                <FieldLabel htmlFor="addressLine">Full Address</FieldLabel>
                <Input
                  id="addressLine"
                  type="text"
                  placeholder="Unit no. / Brgy. Name / Street Name / Village Name"
                  value={form.addressLine}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field>
                <FieldLabel>Document Type</FieldLabel>
                <DocumentDropDown
                  value={form.documentType}
                  onChange={(val) =>
                    setForm((prev) => ({ ...prev, documentType: val }))
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="documentImagePath">
                  Document Path Reference
                </FieldLabel>
                <Input
                  id="documentImagePath"
                  type="text"
                  placeholder="e.g., /uploads/passport_placeholder.png"
                  value={form.documentImagePath}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field className="pt-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Application"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
