"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function ApplicationForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    lastName: "",
    middleName: "",
    firstName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleSubmit(): void {
    throw new Error("Function not implemented.");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="lastName">Full Name</FieldLabel>
            <Input
              id="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="middleName">Country</FieldLabel>
            <Input
              id="middleName"
              type="text"
              value={form.middleName}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="firstName">Zip Code</FieldLabel>
            <Input
              id="firstName"
              type="text"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Address Line</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="Unit no. / Brgy. Name / Street Name / Village Name"
              value={form.email}
              onChange={handleChange}
              required
            />
            <FieldDescription>
              We&apos;ll use this to contact you.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Document</FieldLabel>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <FieldDescription>
              Must be at least 8 characters long.
            </FieldDescription>
          </Field>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <FieldGroup>
            <Field>
              <input type="file" name="image" accept="image/*" required />
              <button type="submit">Upload Image</button> 
              <Button type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
              <Button variant="outline" type="button">
                Sign up with Google
              </Button>
              <FieldDescription className="px-6 text-center">
                Already have an account? <a href="#">Sign in</a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldGroup>
      </form>
    </>
  );
}
