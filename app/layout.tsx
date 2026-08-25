import type { Metadata } from "next";
import "./globals.css";
import GoogleTranslate from "@/components/GoogleTranslate";
import VoiceAssistant from "@/components/VoiceAssistant";

export const metadata: Metadata = {
  title: "Netherway",
  description: "Your guide to life in the Netherlands",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}

        <GoogleTranslate />

        <VoiceAssistant />
      </body>
    </html>
  );
}