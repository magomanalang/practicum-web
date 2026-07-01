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

interface LoanProduct {
  id: string | number;
  name: string;
}

interface LoanDropDownProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}
export default function LoanProductDropDown({
  value,
  onChange,
  className,
}: LoanDropDownProps) {
  const [open, setOpen] = React.useState(false);
  const [products, setProducts] = React.useState<LoanProduct[]>([]);
  const [loading, isLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/auth/get-loan-products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch {
        console.error("Failed to Fetch existing Loan Products");
      } finally {
        isLoading(false);
      }
    }
    fetchProducts();
  }, []);

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
              <Loader2 className="h-4 w-4 animate-spin" /> Loading products...
            </span>
          ) : value ? (
            products.find((p) => String(p.id) === value)?.name ||
            "Select Loan Product..."
          ) : (
            "Select Loan Product..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 min-w-50">
        <Command>
          <CommandInput placeholder="Search loan product..." />
          <CommandList>
            <CommandEmpty>No Loan Product Found</CommandEmpty>
            <CommandGroup>
              {products.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.name}
                  onSelect={() => {
                    onChange(String(product.id));
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === String(product.id)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {product.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
