import { ReactNode } from "react";
// Imports reusable UI.
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

// Wraps form controls with a label, required marker, and validation message.
export const FormField = ({ label, required, error, children }: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-[12px] font-medium text-[#475569]">
        {label}
        {required ? <span className="ml-0.5 text-[#ef4444]">*</span> : null}
      </Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
};



