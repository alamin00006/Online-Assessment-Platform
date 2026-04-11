"use client";

import { AlertTriangle, WifiOff } from 'lucide-react';

interface WarningBannerProps {
  message: string;
  variant?: 'warning' | 'danger' | 'offline';
}

// Displays warning, danger, or offline notices inside page layouts.
export const WarningBanner = ({ message, variant = 'warning' }: WarningBannerProps) => {
  const styles = {
    warning: 'bg-warning/10 border-warning text-warning',
    danger: 'bg-destructive/10 border-destructive text-destructive',
    offline: 'bg-muted border-muted-foreground text-muted-foreground',
  };

  const Icon = variant === 'offline' ? WifiOff : AlertTriangle;

  return (
    <div className={`flex items-center gap-3 rounded-lg border p-3 animate-fade-in ${styles[variant]}`}>
      <Icon className="h-5 w-5 shrink-0" />
      <span className="text-sm font-medium font-body">{message}</span>
    </div>
  );
};


