"use client";

import React from "react";

interface LoanProduct {
  id: string | number;
  name: string;
}

interface LoanDropDownProps {
  value: string;
  onChange: (value: string) => void;
}
export default function LoanProductDropDown({
  value,
  onChange,
}: LoanDropDownProps) {
  const [open, setOpen] = React.useState(false);
  const [products, setProducts] = React.useState<LoanProduct[]>([]);
  const [loading, isLoading] = React.useState(true);

  React.useEffect(() =>{
    async function fetchProducts(){
      try {
        
      }
    }
  }
  )
}
