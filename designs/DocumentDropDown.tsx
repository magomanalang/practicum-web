"use client";

import { useState } from "react";

interface DocumentDropDownProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DocumentDropDown({
  value,
  onChange,
}: DocumentDropDownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const documents = [
    "Passport",
    "Driver's License",
    "SSS Id",
    "Philhealth Id",
    "TIN",
    "National Id",
    "Others",
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (doc: string) => {
    onChange(doc);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block w-full text-left">
      <button
        type="button"
        className="inline-flex justify-between items-center w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        onClick={toggleDropdown}
      >
        {value || "Select Document Type"}
        <span className="ml-2 text-xs opacity-50">▼</span>
      </button>

      {isOpen && (
        <div
          className="absolute z-10 mt-1 w-full rounded-md
                     shadow-lg bg-popover ring-1 ring-black
                     ring-opacity-5 focus:outline-none"
        >
          <div className="py-1 max-h-60 overflow-auto">
            {documents.map((doc, index) => (
              <button
                key={index}
                type="button"
                className="block w-full text-left px-4 py-2
                           text-sm text-popover-foreground
                           hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleSelect(doc)}
              >
                {doc}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
