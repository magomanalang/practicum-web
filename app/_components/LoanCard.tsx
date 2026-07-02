"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { ReduceBalanceDialog } from "./dialogs/ReduceBalanceDialog";
interface LoanProfile {
  id: number;
  customerId: number;
  loanName: string;
  loanProductId: number;
  amount: number;
  interestRate: number;
  finalAmount: number;
  status: string;
  startDate: Date;
  endDate: Date;
  createdBy: string;
  createdDateTime: Date;
  approvedBy: string;
  approvedDateTime: Date;
}
interface LoanCardProps {
  loan: LoanProfile;
  onSuccess: () => void;
}
export function LoanCard({ loan, onSuccess }: LoanCardProps) {
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = React.useState(false);

  const handleReduceBalanceSuccess = () => {
    setIsBalanceDialogOpen(false);
    onSuccess();
  };

  return (
    <>
      <ReduceBalanceDialog
        loan={loan}
        open={isBalanceDialogOpen}
        onOpenChange={setIsBalanceDialogOpen}
        onSuccess={handleReduceBalanceSuccess}
      />

      <Card className="rounded-2xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{loan.loanName}</CardTitle>
              <CardDescription>Loan #{loan.id}</CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={() => setIsBalanceDialogOpen(true)}>
                Add Payment
              </Button>

              <Badge
                variant={
                  loan.status === "Approved"
                    ? "default"
                    : loan.status === "Pending"
                      ? "secondary"
                      : "destructive"
                }
              >
                {loan.status}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Current Balance</p>
              <p className="text-xl font-bold">₱{loan.amount}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Final Amount</p>
              <p className="text-xl font-bold text-primary">
                ₱{loan.finalAmount}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Interest</p>
              <p>{loan.interestRate}%</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">End Date</p>
              <p>{loan.endDate.toString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
