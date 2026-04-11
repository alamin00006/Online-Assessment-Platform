"use client";

// Landing page for the assessment platform platform.
// Redirects authenticated users to their role-specific dashboard.
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
// Imports reusable UI.
import { Button } from "@/components/ui/button";
import { Building2, GraduationCap, Shield } from "lucide-react";

// Renders the landing page and routes authenticated users to their dashboard.
const Index = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  // Redirects authenticated users away from the landing page.
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push(user.role === "employer" ? "/employer" : "/candidate");
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-8 text-center animate-fade-in">
        <div className="space-y-3">
          <div className="mx-auto rounded-2xl gradient-hero p-4 w-fit shadow-lg">
            <Shield className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight">
            Assess<span className="text-primary">Hub</span>
          </h1>
          <p className="text-muted-foreground font-body text-lg max-w-sm mx-auto">
            Secure online assessment platform for employers and candidates
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Button
            onClick={() => router.push("/login/employer")}
            size="lg"
            className="h-24 flex-col gap-2 bg-employer text-employer-foreground hover:bg-employer-accent shadow-employer transition-all hover:scale-[1.02]"
          >
            <Building2 className="h-7 w-7" />
            <span className="font-display text-base">Employer Login</span>
          </Button>
          <Button
            onClick={() => router.push("/login/candidate")}
            size="lg"
            className="h-24 flex-col gap-2 bg-candidate text-candidate-foreground hover:bg-candidate-accent shadow-candidate transition-all hover:scale-[1.02]"
          >
            <GraduationCap className="h-7 w-7" />
            <span className="font-display text-base">Candidate Login</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
