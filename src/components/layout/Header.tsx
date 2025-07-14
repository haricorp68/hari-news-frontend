"use client";

import { CategoryAutocompleteInput } from "@/components/category/CategoryAutocompleteInput";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <div className="flex-1 flex justify-center">
        <CategoryAutocompleteInput />
      </div>
    </header>
  );
} 