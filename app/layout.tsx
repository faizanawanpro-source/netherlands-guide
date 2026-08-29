import type { Metadata } from "next";
import "./globals.css";

import GoogleTranslate from "@/components/GoogleTranslate";
import VoiceAssistant from "@/components/VoiceAssistant";

export const metadata: Metadata = {
  title: {
    default: "Netherway",
    template: "%s | Netherway",
  },
  description:
    "Your personalised guide to life in the Netherlands. Get help with housing, documents, healthcare, work, money, transport and more.",

  keywords: [
    "Netherlands",
    "Netherway",
    "Dutch guide",
    "refugees Netherlands",
    "newcomers Netherlands",
    "international students Netherlands",
    "living in Netherlands",
    "BSN",
    "DigiD",
    "housing Netherlands",
    "work Netherlands",
  ],

  authors: [
    {
      name: "Netherway",
    },
  ],

  applicationName: "Netherway",

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* Main page content */}
        {children}

        {/* Language translation */}
        <GoogleTranslate />

        {/* AI voice assistant */}
        <VoiceAssistant />
      </body>
    </html>
  );
}