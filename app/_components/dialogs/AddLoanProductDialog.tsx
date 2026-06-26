"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LoanCategoryNames,
  LoanCategoriesToValueMap,
} from "@/app/_constants/loanCategories";
import { RequestTypes } from "@/app/_constants/requestTypes";
import { toFormattedPhDateTime } from "@/app/_helpers/FormattedDateTime";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

type FormState = {
  name: string;
  description: string;
  loanCategory: string;
  interestRate: string;
  minimumAmount: string;
  maximumAmount: string;
  minimumTermMonths: string;
  maximumTermMonths: string;
  isPromotion: boolean;
};

const INITIAL_STATE: FormState = {
  name: "",
  description: "",
  loanCategory: "",
  interestRate: "",
  minimumAmount: "",
  maximumAmount: "",
  minimumTermMonths: "",
  maximumTermMonths: "",
  isPromotion: false,
};

export function LoanProductFormDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
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

  const handleSelectChange = (value: string) => {
    setForm((prev) => ({ ...prev, loanCategory: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setForm((prev) => ({ ...prev, isPromotion: checked }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const toLoanCategory = LoanCategoriesToValueMap[form.loanCategory];

      const payload = {
        name: form.name,
        description: form.description,
        loanCategory: toLoanCategory,
        interestRate: parseFloat(form.interestRate),
        maximumAmount: parseFloat(form.maximumAmount),
        minimumAmount: parseFloat(form.minimumAmount),
        minimumTermMonths: parseInt(form.minimumTermMonths, 10),
        maximumTermMonths: parseInt(form.maximumTermMonths, 10),

        requestType: RequestTypes.Add,
        createdBy: session?.user?.email || "Admin",
        createdDateTime: toFormattedPhDateTime(),
      };

      const res = await fetch("/api/auth/add-loan-product-request", {
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Loan Product for Approval</DialogTitle>
          <DialogDescription>
            Fill in the details for the new loan product. Click submit to send
            for approval.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="p-3 text-sm font-medium text-red-500 bg-red-50 dark:bg-red-950/30 rounded-md border border-red-200 dark:border-red-900/50">
                {error}
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={form.description}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="loanCategory" className="text-right">
                Category
              </Label>
              <Select
                onValueChange={handleSelectChange}
                value={form.loanCategory}
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(LoanCategoryNames).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="interestRate" className="text-right">
                Interest Rate (%)
              </Label>
              <Input
                id="interestRate"
                type="number"
                value={form.interestRate}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="minimumAmount" className="text-right">
                Min. Amount
              </Label>
              <Input
                id="minimumAmount"
                type="number"
                value={form.minimumAmount}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maximumAmount" className="text-right">
                Max. Amount
              </Label>
              <Input
                id="maximumAmount"
                type="number"
                value={form.maximumAmount}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="minimumTermMonths" className="text-right">
                Min. Term (Months)
              </Label>
              <Input
                id="minimumTermMonths"
                type="number"
                value={form.minimumTermMonths}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maximumTermMonths" className="text-right">
                Max. Term (Months)
              </Label>
              <Input
                id="maximumTermMonths"
                type="number"
                value={form.maximumTermMonths}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="flex items-center space-x-2 justify-end col-span-4">
              <Checkbox
                id="isPromotion"
                checked={form.isPromotion}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="isPromotion">Is this a promotion?</Label>
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
