"use client";
// Shared login page used for both employer and candidate sign-in flows.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { api } from "@/services/api";
import { loginSchema, type LoginForm } from "@/schemas/auth.schema";
// Imports reusable UI.
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppHeader, AppShell } from "@/components/shared";


interface AuthLoginPageProps {
  role: "employer" | "candidate";
}

// Handles role-aware login, validation, and post-authentication routing.
export const AuthLoginPage = ({ role }: AuthLoginPageProps) => {
  const router = useRouter();
  const { login, setError, error } = useAuthStore();
  const isEmployer = role === "employer";
  const [showPassword, setShowPassword] = useState(false);

  const methods = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: isEmployer ? "employer@test.com" : "candidate@test.com",
      password: "password123",
    },
  });

  // Execute login and validate that the returned role matches the current page.
  // Runs authentication and routes users according to their validated role.
  const mutation = useMutation({
    mutationFn: (data: LoginForm) => api.login(data.email, data.password),
    onSuccess: ({ user, token }) => {
      if (user.role !== role) {
        setError(
          `This account is not a ${isEmployer ? "employer" : "candidate"} account`,
        );
        return;
      }

      login(user, token);
      router.push(isEmployer ? "/employer" : "/candidate");
    },
    onError: (err: Error) => setError(err.message),
  });

  return (
    <AppShell header={<AppHeader title="Dashboard" />}>
      <div className="flex justify-center py-2 sm:py-6">
        <div className="w-full max-w-[571px] animate-fade-in">
          <h1 className="text-center font-display text-[34px] font-bold text-[#334155] sm:text-[42px]">
            Sign In
          </h1>

          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit((data) => mutation.mutate(data))}
              className="mx-auto mt-8 w-full rounded-[20px] border border-[#d9dfe8] bg-white px-8 py-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:px-8 sm:py-8 md:max-w-[700px] md:px-8"
            >
              <div className="space-y-7">
                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-[18px] font-medium text-[#475569]"
                  >
                    Email/ User ID
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email/User ID"
                    {...methods.register("email")}
                    className="h-[48px] rounded-[11px] border-[#d7dee7] px-4 text-[16px] text-[#334155] placeholder:text-[#94a3b8] focus-visible:ring-1 focus-visible:ring-[#6736f6] focus-visible:ring-offset-0"
                  />
                  {methods.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {methods.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="password"
                    className="text-[18px] font-medium text-[#475569]"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...methods.register("password")}
                      className="h-[48px] rounded-[11px] border-[#d7dee7] px-4 pr-12 text-[16px] text-[#334155] placeholder:text-[#94a3b8] focus-visible:ring-1 focus-visible:ring-[#6736f6] focus-visible:ring-offset-0"
                    />
                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() =>
                        setShowPassword(
                          (currentVisibility) => !currentVisibility,
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] transition-colors hover:text-[#64748b]"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    {methods.formState.errors.password ? (
                      <p className="text-sm text-destructive">
                        {methods.formState.errors.password.message}
                      </p>
                    ) : (
                      <span />
                    )}
                    <button
                      type="button"
                      className="text-right text-[16px] font-medium text-[#475569] transition-colors hover:text-[#6736f6]"
                    >
                      Forget Password?
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-destructive">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="mt-3 h-[46px] w-full rounded-[13px] bg-primary text-[16px] font-semibold text-primary-foreground shadow-none hover:bg-primary/90"
                >
                  {mutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign In
                </Button>

                <div className="space-y-3 pt-1 text-center">
                  {/* <p className="text-sm text-[#64748b]">
                    Demo: {isEmployer ? "employer" : "candidate"}@test.com /
                    password123
                  </p> */}
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-auto p-0 text-sm font-medium text-[#64748b] hover:bg-transparent hover:text-[#6736f6]"
                    onClick={() =>
                      router.push(
                        isEmployer ? "/login/candidate" : "/login/employer",
                      )
                    }
                  >
                    Login as {isEmployer ? "Candidate" : "Employer"} instead
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </AppShell>
  );
};




