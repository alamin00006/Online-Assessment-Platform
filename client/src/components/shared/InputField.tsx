"use client";

import { useFormContext } from 'react-hook-form';
// Imports reusable UI.
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}

// Connects a labelled input to React Hook Form validation state.
export const InputField = ({ name, label, type = 'text', placeholder }: InputFieldProps) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="font-body text-sm font-medium text-foreground">
        {label}
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={error ? 'border-destructive ring-destructive/30 ring-2' : ''}
      />
      {error && (
        <p className="text-xs text-destructive animate-fade-in">{error.message as string}</p>
      )}
    </div>
  );
};


