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
import DocumentDropDown from "../dropdowns/DocumentDropDown";
import CustomerListDropDown from "../dropdowns/CustomerListDropDown";
import { useRouter } from "next/navigation";

export function ApplicationForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerId: "",
    fullName: "",
    country: "",
    zipCode: "",
    addressLine: "",
    document: "",
    documentType: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fileInput = document.getElementById("document") as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      setError("Please upload a file.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("CustomerId", form.customerId);
      formData.append("FullName", form.fullName);
      formData.append("Country", form.country);
      formData.append("ZipCode", form.zipCode);
      formData.append("AddressLine", form.addressLine);
      formData.append("DocumentType", form.documentType);
      formData.append("SubmittedBy", "Web_Client_User");
      formData.append("DocumentFile", file);

      const res = await fetch("/api/auth/document-submission", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message ?? "Something went wrong.");
        return;
      }

      router.push("/submission");
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
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
                <FieldDescription>
                  We&apos;ll use this for your personal information.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Document Type</FieldLabel>
                <DocumentDropDown
                  value={form.documentType}
                  onChange={(val) =>
                    setForm((prev) => ({ ...prev, documentType: val }))
                  }
                />
                <FieldDescription>
                  Select the type of ID or document you are uploading.
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
