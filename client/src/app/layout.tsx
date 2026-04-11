// This file defines the server root layout and global metadata for the app.
import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "AssessHub - Online Assessment Platform",
  description: "Secure online assessment platform for employers and candidates.",
};

// Provides global providers and document metadata for the client application.
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${dmSans.variable}`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
};

export default RootLayout;

