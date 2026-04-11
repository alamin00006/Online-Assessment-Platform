import { ReactNode } from "react";
// Imports reusable UI.
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppHeader, AppShell } from "@/components/shared";

interface ExamStatusScreenProps {
  title: string;
  description: string;
  icon: ReactNode;
  userName?: string;
  userRef?: string;
  onBack: () => void;
  onLogout?: () => void;
}

// Renders the completed or timeout status screen after an exam ends.
export const ExamStatusScreen = ({
  title,
  description,
  icon,
  userName,
  userRef,
  onBack,
  onLogout,
}: ExamStatusScreenProps) => (
  <AppShell
    header={
      <AppHeader
        title="Akij Resource"
        userName={userName}
        userRef={userRef}
        onLogout={onLogout}
      />
    }
  >
    <div className="px-4 py-7 sm:px-6 sm:py-10">
      <Card className="w-full rounded-[16px] border border-[#e5ebf3] bg-white shadow-none">
        <CardContent className="space-y-4 px-6 py-12 text-center sm:px-10 sm:py-16">
          <div className="mx-auto w-fit">{icon}</div>
          <h2 className="font-display text-[20px] font-semibold text-[#334155] sm:text-[26px]">
            {title}
          </h2>
          <p className="mx-auto max-w-[720px] text-[13px] text-[#718096] sm:text-sm">
            {description}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="h-[38px] rounded-[10px] border-[#d7dee7] px-5 text-sm font-medium text-[#475569]"
          >
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  </AppShell>
);






