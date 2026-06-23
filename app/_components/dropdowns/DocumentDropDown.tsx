"use client";

interface DocumentDropDownProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DocumentDropDown({
  value,
  onChange,
}: DocumentDropDownProps) {
  const documents = [
    "Passport",
    "Driver's License",
    "SSS Id",
    "Philhealth Id",
    "TIN",
    "National Id",
    "Others",
  ];

  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
      >
        <option value="" disabled hidden>
          Select Document Type
        </option>
        {documents.map((doc, index) => (
          <option
            key={index}
            value={doc}
            className="bg-popover text-popover-foreground"
          >
            {doc}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center justify-center opacity-50">
        <span className="text-xs">▼</span>
      </div>
    </div>
  );
}
