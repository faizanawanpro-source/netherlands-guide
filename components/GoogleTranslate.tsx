"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export default function GoogleTranslate() {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (
        window.google &&
        window.google.translate &&
        document.getElementById("google_translate_element")
      ) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages:
              "en,nl,de,fr,es,it,pt,pl,ar,tr,ur,hi",
            layout:
              window.google.translate.TranslateElement.InlineLayout
                .SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    const existingScript = document.querySelector(
      'script[src*="translate.google.com"]'
    );

    if (!existingScript) {
      const script = document.createElement("script");

      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

      script.async = true;

      document.body.appendChild(script);
    } else if (window.google?.translate) {
      window.googleTranslateElementInit();
    }

    return () => {
      window.googleTranslateElementInit = undefined;
    };
  }, []);

  return (
    <div
      id="google_translate_element"
      className="fixed bottom-5 left-5 z-[9999] rounded-xl bg-white p-2 shadow-lg"
    />
  );
}