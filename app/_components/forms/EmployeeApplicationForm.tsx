"use client";

import { EmployeeRoles } from "@/app/_constants/employeeRoles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import EmployeeRolesDropDown from "../dropdowns/EmployeeRolesDropDown";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface FormState {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  email: string;
  employeeRoles: EmployeeRoles[];
}

export function EmployeeApplicationForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FormState>({
    id: "",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    email: "",
    employeeRoles: [],
    createdBy: "",
    createdDateTime: "",
    requestType: "Add"
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/add-employee-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          middleName: form.middleName,
          lastName: form.lastName,
          suffix: form.suffix,
          email: form.email,
          employeeRoles: form.employeeRoles,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message ?? "Something went wrong.");
        return;
      }
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const stateKey = (id.charAt(0).toUpperCase() +
      id.slice(1)) as keyof FormState;

    setForm((prev) => ({
      ...prev,
      [stateKey]: value,
    }));
  };

  const handleRoleChange = (selectedRole: string) => {
    const role = selectedRole as EmployeeRoles;
    setForm((prev) => {
      if (prev.employeeRoles.includes(role)) return prev;
      return {
        ...prev,
        EmployeeRoles: [...prev.employeeRoles, role],
      };
    });
  };
  return (
    <Card className="w-full max-w-2xl" {...props}>
      <CardHeader>
        <CardTitle>Employee Details</CardTitle>
        <CardDescription>
          Please Fill Out Employee Credentials for Approval.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="firstName">First Name</FieldLabel>
            <Input
              id="firstName"
              type="text"
              value={form.firstName}
              onChange={handleInputChange}
              required
            />
            <FieldLabel htmlFor="middleName">Middle Name</FieldLabel>
            <Input
              id="middleName"
              type="text"
              value={form.middleName}
              onChange={handleInputChange}
              required
            />
            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
            <Input
              id="lastName"
              type="text"
              value={form.lastName}
              onChange={handleInputChange}
              required
            />
            <FieldLabel htmlFor="lastName">Suffix</FieldLabel>
            <Input
              id="suffix"
              type="text"
              value={form.suffix}
              onChange={handleInputChange}
              required
            />
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="text"
              value={form.email}
              onChange={handleInputChange}
              required
            />
            <EmployeeRolesDropDown
              value={form.employeeRoles[form.employeeRoles.length - 1] || ""}
              onChange={handleRoleChange}
            />
            {form.employeeRoles.length > 0 && (
              <div className="mt-2 text-xs text-muted-foreground">
                <strong>Selected:</strong> {form.employeeRoles.join(", ")}
              </div>
            )}

            <Button
              variant="outline"
              type="submit"
              className="w-full"
              disabled={false}
              onClick={handleSubmit}
            >
              Submit For Approval
            </Button>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
