"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import * as React from "react";

// ---- Types ----
type OptionObject = Record<string, any>;
type Option = string | OptionObject | any;

interface FilterableSelectProps {
  label?: string;
  labelPosition?: "top" | "inside";
  placeholder?: string;
  className?: string;
  options: Option[];
  keyTitle?: keyof OptionObject;
  keyValue?: keyof OptionObject;
  value?: string | number;
  setvalue?: React.Dispatch<
    React.SetStateAction<string | number | undefined | any>
  >;
  onChange?: (item: OptionObject | "") => void;
  disable?: boolean;
  errorMessage?: string;
}

// ---- Component ----
export function FilterableSelect({
  label,
  labelPosition = "top",
  placeholder = "Select option",
  className,
  options,
  keyTitle = "title",
  keyValue = "value",
  value,
  setvalue,
  onChange,
  disable,
  errorMessage,
}: FilterableSelectProps) {
  // normalize options
  const normalized = React.useMemo(
    () =>
      options?.map((opt) =>
        typeof opt === "string" ? { value: opt, title: opt } : opt
      ) ?? [],
    [options]
  );

  const handleSelect = (val: string | number) => {
    const selected = normalized.find(
      (opt) => opt[keyValue as keyof OptionObject] === val
    );
    setvalue?.(val);
    onChange?.(selected ?? "");
  };

  return (
    <div className={cn("w-full", className)}>
      {label && labelPosition === "top" && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}

      <Select
        value={value?.toString()}
        onValueChange={(v) => handleSelect(v)}
        disabled={disable}
      >
        <SelectTrigger className="w-full rounded-lg p-6">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className="z-[1000]">
          <SelectGroup>
            {label && (
              <SelectLabel className="text-xs text-muted-foreground">
                {label}
              </SelectLabel>
            )}

            {normalized.map((item) => (
              <SelectItem
                key={item[keyValue as keyof OptionObject]?.toString()}
                value={item[keyValue as keyof OptionObject]?.toString()}
              >
                {item[keyTitle as keyof OptionObject]}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {errorMessage && (
        <span className="text-xs text-red-500 mt-1 block">{errorMessage}</span>
      )}
    </div>
  );
}
