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
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import {
  EmployeeRolesReadable,
  EnumKeyToValueMap,
  RoleNameToValueMap,
} from "../_constants/employeeRoles";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const readableRoles = useMemo(() => {
    const rolesValue = session?.user?.employeeRoles;
    console.log("Raw employeeRoles data:", rolesValue);
    if (!rolesValue) return [];

    const rolesArray = [rolesValue]
      .flat()
      .filter((role) => role !== null && role !== undefined);

    return rolesArray.map((role) => {
      if (typeof role === "string") {
        const enumValue = EnumKeyToValueMap[role] ?? RoleNameToValueMap[role];

        return enumValue !== undefined
          ? EmployeeRolesReadable(enumValue)
          : role;
      }

      return EmployeeRolesReadable(role);
    });
  }, [session?.user?.employeeRoles]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!session || !session.user) {
    return null;
  }

  const fullName = [session?.user?.firstName, session?.user?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="w-full min-h-screen px-4 py-8 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold tracking-tight text-green-400">
        User Profile
      </h1>
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Your basic profile and account information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-500 text-sm">
                Photo
              </div>
              <div>
                <Button disabled variant="outline" size="sm">
                  Edit Profile
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <Input disabled value={fullName} />
              </Field>
              <Field>
                <FieldLabel>Employee ID</FieldLabel>
                <Input disabled value={session.user.employeeId || "N/A"} />
              </Field>
              <Field>
                <FieldLabel>Email address</FieldLabel>
                <Input disabled value={session.user.email || "N/A"} />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Account & Security</CardTitle>
          <CardDescription>
            Your account roles and security settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Account Roles</FieldLabel>
                <div className="flex flex-wrap gap-2 mt-2">
                  {readableRoles.length > 0 ? (
                    readableRoles.map((roleName, index) => (
                      <span
                        key={`${roleName}-${index}`}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-400/10 dark:text-indigo-400 dark:ring-indigo-400/30"
                      >
                        {roleName}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400 italic">
                      No Roles Assigned
                    </span>
                  )}
                </div>
              </Field>
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input disabled type="password" value="********" />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Activity & History</CardTitle>
          <CardDescription>
            Your account creation and approval history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Account Created By</FieldLabel>
                <Input disabled value={session.user.createdBy || "N/A"} />
              </Field>
              <Field>
                <FieldLabel>Account Creation Date</FieldLabel>
                <Input
                  disabled
                  value={
                    session.user.createdDateTime
                      ? new Date(session.user.createdDateTime).toLocaleString()
                      : "N/A"
                  }
                />
              </Field>
              <Field>
                <FieldLabel>Approved By</FieldLabel>
                <Input disabled value={session.user.approvedBy || "N/A"} />
              </Field>
              <Field>
                <FieldLabel>Approval Date</FieldLabel>
                <Input
                  disabled
                  value={
                    session.user.approvedDateTime
                      ? new Date(session.user.approvedDateTime).toLocaleString()
                      : "N/A"
                  }
                />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-red-500">Account Actions</CardTitle>
          <CardDescription>Log out or delete your account.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" onClick={() => signOut()}>
            Logout
          </Button>
          <Button disabled variant="destructive">
            Deactivate / Delete account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
