"use client";

import { useState } from "react";
import React from "react";

export function CustomerProfilePage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [customer, setCustomer];
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchCustomer() {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/get-customer");
        if (res.ok) {
          const data = await res.json();
          setCustomer(data);
        }
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomer();
  }, []);
  return <h1></h1>;
}
