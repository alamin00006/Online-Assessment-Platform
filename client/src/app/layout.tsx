"use client";

// Root layout for the interview task frontend application.
// This file sets up global providers and page metadata used throughout the client.
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>AssessHub - Online Assessment Platform</title>
        <meta
          name="description"
          content="Secure online assessment platform for employers and candidates."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            {children}
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
