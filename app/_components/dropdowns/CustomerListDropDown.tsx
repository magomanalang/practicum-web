"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Customers {
  id: string | number;
  firstName: string;
  lastName: string;
}

interface CustomerDropDownProps {
  value: string;
  onChange: (id: string, fullName: string) => void;
  className?: string;
}
export default function CustomerListDropDown({
  value,
  onChange,
  className,
}: CustomerDropDownProps) {
  const [open, setOpen] = React.useState(false);
  const [customers, setCustomers] = React.useState<Customers[]>([]);
  const [loading, isLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch("/api/auth/get-customers");
        if (res.ok) {
          const data = await res.json();
          setCustomers(data);
        }
      } catch {
        console.error("Failed to Fetch existing Loan Products");
      } finally {
        isLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const getCustomerFullName = (customer: Customers) => {
    return `${customer.firstName} ${customer.lastName}`.trim();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-left font-normal",
            className,
          )}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading customers...
            </span>
          ) : value ? (
            (() => {
              const selected = customers.find((p) => String(p.id) === value);
              return selected
                ? getCustomerFullName(selected)
                : "Select Assigned Customers...";
            })()
          ) : (
            "Select Assigned Customers..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 min-w-50">
        <Command>
          <CommandInput placeholder="Search customers..." />
          <CommandList>
            <CommandEmpty>No Customers Found</CommandEmpty>
            <CommandGroup>
              {customers.map((customer) => {
                const fullName = getCustomerFullName(customer);
                return (
                  <CommandItem
                    key={customer.id}
                    value={fullName}
                    onSelect={() => {
                      onChange(String(customer.id), fullName);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === String(customer.id)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {fullName}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
