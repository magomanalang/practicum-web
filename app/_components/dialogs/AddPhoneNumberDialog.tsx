"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toFormattedPhDateTime } from "@/app/_helpers/FormattedDateTime";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

type FormState = {
  phoneNumber: "";
};

const INITIAL_STATE: FormState = {
  phoneNumber: "",
};

export function AddPhoneNumberDialog({
  open,
  onOpenChange,
  onSuccess,
  customer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  customer: { id: number } | null;
}) {
  const { data: session } = useSession();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!customer) {
        throw new Error("Customer is not available.");
      }
      const payload = {
        CustomerId: customer.id,
        PhoneNumber: form.phoneNumber,
        CreatedBy: session?.user?.email || "Admin",
        CreatedDateTime: toFormattedPhDateTime(),
      };

      const res = await fetch("/api/auth/add-phone-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Something went wrong.");
      }

      setForm(INITIAL_STATE);
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-8.5">
        <DialogHeader>
          <DialogTitle>Add Phone Number</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="p-3 text-sm font-medium text-red-500 bg-red-50 dark:bg-red-950/30 rounded-md border border-red-200 dark:border-red-900/50">
                {error}
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit for Approval"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
