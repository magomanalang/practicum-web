"use client";

import { EmployeeRoles } from "@/app/_constants/employeeRoles";

interface EmployeeRolesDropDownProps {
  value: string;
  onChange: (value: string) => void;
}

export default function EmployeeRolesDropDown({
  value,
  onChange,
}: EmployeeRolesDropDownProps) {
  const employeeRoles = Object.values(EmployeeRoles);
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
      >
        <option value="" disabled hidden>
          Employee Roles{" "}
        </option>
        {employeeRoles.map((emp, index) => (
          <option
            key={index}
            value={emp}
            className="bg-popover text-popover-foreground"
          >
            {emp}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center justify-center opacity-50">
        <span className="text-xs">▼</span>
      </div>
    </div>
  );
}
