"use client";

import { EmployeeRoleDisplayValues } from "@/app/_constants/employeeRoles";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface EmployeeRolesMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export default function EmployeeRolesDropDown({
  value,
  onChange,
}: EmployeeRolesMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const employeeRoles = EmployeeRoleDisplayValues;

  const handleSelect = (role: string) => {
    const isAlreadySelected = value.includes(role);
    if (isAlreadySelected) {
      onChange(value.filter((item) => item !== role));
    } else {
      onChange([...value, role]);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    role: string,
  ) => {
    if (e.key === " " || e.key === "Enter") {
      handleSelect(role);
    }
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-10 text-left"
        >
          {value.length > 0 ? (
            <span className="flex flex-wrap gap-1 max-w-[90%] truncate">
              {value.join(", ")}
            </span>
          ) : (
            <span className="text-muted-foreground">Select Employee Roles</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 min-w-50px" align="start">
        <Command>
          <CommandInput placeholder="Search roles..." />
          <CommandList>
            <CommandEmpty>No Roles Found</CommandEmpty>
            <CommandGroup>
              {employeeRoles.map((role) => {
                const isSelected = value.includes(role);
                return (
                  <CommandItem
                    key={role}
                    value={role}
                    onSelect={() => handleSelect(role)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={0}
                      onKeyDown={(e) => handleKeyDown(e, role)}
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm border border-primary transition-all",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50",
                        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 stroke-3" />}
                    </div>
                    <span className={cn(isSelected && "font-medium")}>
                      {role}
                    </span>
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
