"use client";

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
import { useSession } from "next-auth/react";
import { toFormattedPhDateTime } from "@/app/_helpers/FormattedDateTime";
import { RoleNameToValueMap } from "@/app/_constants/employeeRoles";

interface FormState {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  employeeRoles: string[];
}

export function EmployeeApplicationForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FormState>({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    employeeRoles: [],
  });
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const backendNumericRoles = form.employeeRoles.map(
      (roleName) => RoleNameToValueMap[roleName],
    );
    const firstInitial = form.firstName[0].toUpperCase();
    const lastInitial = form.middleName[0].toUpperCase();
    const year = new Date().getFullYear();
    const generatedEmployeeId = `${firstInitial}${lastInitial}${year}0001`;

    const generatedPassword = `${form.firstName}${year}`;
    const generatedEmail = `${form.firstName}${lastInitial}${year}@gmail.com`;
    const dateTimeNow = toFormattedPhDateTime();
    const sessionUser = session?.user?.email || "Admin";

    try {
      const res = await fetch("/api/add-employee-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          FirstName: form.firstName,
          MiddleName: form.middleName,
          LastName: form.lastName,
          Suffix: form.suffix,
          Email: generatedEmail,
          Password: generatedPassword,
          EmployeeId: generatedEmployeeId,
          EmployeeRoles: backendNumericRoles,
          CreatedDateTime: dateTimeNow,
          CreatedBy: sessionUser,
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

    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleRoleChange = (selectedRoles: string[]) => {
    setForm((prev) => ({
      ...prev,
      employeeRoles: selectedRoles,
    }));
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
        <form onSubmit={handleSubmit}>
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
              <FieldLabel htmlFor="suffix">Suffix</FieldLabel>
              <Input
                id="suffix"
                type="text"
                value={form.suffix}
                onChange={handleInputChange}
              />
              <EmployeeRolesDropDown
                value={form.employeeRoles}
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
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit For Approval"}{" "}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
