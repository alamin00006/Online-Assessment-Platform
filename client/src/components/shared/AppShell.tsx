"use client";
// Shared application shell for the assessment client.
// Provides header, footer, and page layout elements used by role-based pages.

import Link from "next/link";
import { ReactNode } from "react";
import { ChevronDown, LogOut, Mail, Phone, UserCircle2 } from "lucide-react";
// Imports reusable UI.
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppHeaderProps {
  title: string;
  userName?: string;
  userRef?: string;
  onLogout?: () => void;
}

// Renders the shared application header with account dropdown support.
export const AppHeader = ({
  title,
  userName,
  userRef,
  onLogout,
}: AppHeaderProps) => {
  return (
    <header className="border-b border-[#eceff5] bg-white">
      <div className="mx-auto grid min-h-[64px] max-w-[1180px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-3 sm:min-h-[72px] sm:gap-4 sm:px-6">
        <div className="flex min-w-0 items-center justify-start">
          <Link href="/" className="inline-flex min-w-0 items-center">
            <div className="flex items-end gap-1 font-display font-bold leading-none text-[#1e293b]">
              <span className="text-[20px] tracking-[-0.06em] text-[#4f46e5] sm:text-[28px]">
                AKIJ
              </span>
              <span className="border border-[#1e293b] px-1 py-[2px] text-[8px] uppercase tracking-[0.08em] text-[#1e293b] sm:text-[10px]">
                Resource
              </span>
            </div>
          </Link>
        </div>

        <div className="min-w-0 px-1 text-center">
          <span className="block truncate text-xs font-medium text-[#334155] sm:text-sm">
            {title}
          </span>
        </div>

        {userName ? (
          <div className="flex min-w-0 justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex min-w-[132px] max-w-full items-center justify-end gap-2 rounded-[10px] px-1.5 py-1 text-right transition-colors hover:bg-[#f8fafc] sm:min-w-[188px] sm:gap-3 sm:px-2"
                  aria-label="Open account menu"
                >
                  <UserCircle2 className="h-8 w-8 shrink-0 text-[#d1d5db] sm:h-9 sm:w-9" />
                  <div className="min-w-0 max-w-[92px] flex-1 sm:max-w-[132px] hidden md:block ">
                    <p className="truncate text-[10px] font-semibold text-[#334155] sm:text-sm">
                      {userName}
                    </p>
                    <p className="truncate text-[9px] text-[#64748b] sm:text-xs">
                      Ref.ID - {userRef}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 text-[#94a3b8]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 rounded-[12px] border-[#e5ebf3] p-2"
              >
                <DropdownMenuLabel className="px-3 py-2">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-[#334155]">
                      {userName}
                    </p>
                    <p className="text-xs font-normal text-[#64748b]">
                      Ref.ID - {userRef}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#edf1f7]" />
                <DropdownMenuItem
                  onClick={onLogout}
                  disabled={!onLogout}
                  className="rounded-[8px] px-3 py-2 text-sm font-medium text-[#475569] focus:bg-[#f8fafc] focus:text-[#334155]"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : null}
      </div>
    </header>
  );
};

// Renders the shared footer with brand and support contact details.
export const AppFooter = () => {
  return (
    <footer className="bg-[#170b3a]">
      <div className="mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-3 px-4 py-4 text-sm text-white sm:min-h-[56px] sm:flex-row sm:items-center sm:px-6 sm:py-0">
        <div className="flex items-center gap-2">
          <span className="text-white/80">Powered by</span>
          <div className="flex items-end gap-1 font-display font-bold leading-none">
            <span className="text-[18px] tracking-[-0.06em] text-[#f8d548] sm:text-[20px]">
              AKIJ
            </span>
            <span className="border border-[#f8d548] px-1 py-[2px] text-[8px] uppercase tracking-[0.08em] text-[#f8d548] sm:text-[9px]">
              Resource
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 text-[11px] text-white/80 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4 sm:text-sm">
          <span className="font-medium text-white">Helpline</span>
          <span className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" />
            +88 0110202505
          </span>
          <span className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            support@akij.work
          </span>
        </div>
      </div>
    </footer>
  );
};

// Composes the shared header, content area, and footer layout.
export const AppShell = ({
  children,
  header,
}: {
  children: ReactNode;
  header: ReactNode;
}) => {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f8fc]">
      {header}
      <main className="flex-1">
        <div className="mx-auto w-full max-w-[1180px] px-4 py-5 sm:px-6 sm:py-8">
          {children}
        </div>
      </main>
      <AppFooter />
    </div>
  );
};
