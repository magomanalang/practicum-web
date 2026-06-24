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

interface FormState {
  Id: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Suffix: string;
  Email: string;
  EmployeeRoles: EmployeeRoles[];
}

export function EmployeeApplicationForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    Id: "",
    FirstName: "",
    MiddleName: "",
    LastName: "",
    Suffix: "",
    Email: "",
    EmployeeRoles: [],
  });
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
      // Avoid duplicate selections if they select it again
      if (prev.EmployeeRoles.includes(role)) return prev;
      return {
        ...prev,
        EmployeeRoles: [...prev.EmployeeRoles, role],
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
              value={form.FirstName}
              onChange={handleInputChange}
              required
            />
            <FieldLabel htmlFor="middleName">Middle Name</FieldLabel>
            <Input
              id="middleName"
              type="text"
              value={form.MiddleName}
              onChange={handleInputChange}
              required
            />
            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
            <Input
              id="lastName"
              type="text"
              value={form.LastName}
              onChange={handleInputChange}
              required
            />
            <FieldLabel htmlFor="lastName">Suffix</FieldLabel>
            <Input
              id="suffix"
              type="text"
              value={form.Suffix}
              onChange={handleInputChange}
              required
            />
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="text"
              value={form.Email}
              onChange={handleInputChange}
              required
            />
            <EmployeeRolesDropDown
              value={form.EmployeeRoles[form.EmployeeRoles.length - 1] || ""}
              onChange={handleRoleChange}
            />
            {form.EmployeeRoles.length > 0 && (
              <div className="mt-2 text-xs text-muted-foreground">
                <strong>Selected:</strong> {form.EmployeeRoles.join(", ")}
              </div>
            )}
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
