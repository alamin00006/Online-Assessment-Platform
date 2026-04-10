"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { ChevronDown, LogOut, Mail, Phone, UserCircle2 } from "lucide-react";

interface PortalHeaderProps {
  title: string;
  userName?: string;
  userRef?: string;
  onLogout?: () => void;
}

export function PortalHeader({
  title,
  userName,
  userRef,
  onLogout,
}: PortalHeaderProps) {
  return (
    <header className="border-b border-[#eceff5] bg-white">
      <div className="mx-auto flex min-h-[64px] max-w-[1180px] items-center justify-between gap-3 px-3 sm:min-h-[72px] sm:gap-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-8">
          <Link href="/" className="inline-flex items-center">
            <div className="flex items-end gap-1 font-display font-bold leading-none text-[#1e293b]">
              <span className="text-[20px] tracking-[-0.06em] text-[#4f46e5] sm:text-[28px]">
                AKIJ
              </span>
              <span className="border border-[#1e293b] px-1 py-[2px] text-[8px] uppercase tracking-[0.08em] text-[#1e293b] sm:text-[10px]">
                Resource
              </span>
            </div>
          </Link>
          <span className="text-xs font-medium text-[#334155] sm:text-sm">
            {title}
          </span>
        </div>

        {userName ? (
          <div className="flex items-center gap-2 text-right sm:gap-3">
            <UserCircle2 className="h-8 w-8 text-[#d1d5db] sm:h-9 sm:w-9" />
            <div className="max-w-[92px] sm:max-w-none">
              <p className="truncate text-[10px] font-semibold text-[#334155] sm:text-sm">
                {userName}
              </p>
              <p className="truncate text-[9px] text-[#64748b] sm:text-xs">
                Ref.ID - {userRef}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-[#94a3b8]" />
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="rounded-full p-1.5 text-[#94a3b8] transition-colors hover:bg-[#f8fafc] hover:text-[#334155] sm:p-2"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
}

export function PortalFooter() {
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
}

export function PortalPage({
  children,
  header,
}: {
  children: ReactNode;
  header: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f8fc]">
      {header}
      <main className="flex-1">
        <div className="mx-auto w-full max-w-[1180px] px-3 py-5 sm:px-6 sm:py-8">
          {children}
        </div>
      </main>
      <PortalFooter />
    </div>
  );
}
