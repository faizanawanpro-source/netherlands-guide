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
    let cancelled = false;

    const initializeTranslate = () => {
      if (cancelled) return;

      const element = document.getElementById(
        "google_translate_element"
      );

      if (
        !element ||
        !window.google?.translate?.TranslateElement
      ) {
        return false;
      }

      // Don't create the widget twice
      if (element.children.length > 0) {
        return true;
      }

      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages:
              "en,nl,de,fr,es,it,pt,pl,ar,tr,ur,hi",
            layout:
              window.google.translate.TranslateElement
                .InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );

        return true;
      } catch (error) {
        console.warn(
          "Google Translate could not initialize:",
          error
        );

        return false;
      }
    };

    window.googleTranslateElementInit =
      initializeTranslate;

    // Google Translate may already be loaded
    if (initializeTranslate()) {
      return () => {
        cancelled = true;
      };
    }

    // Check whether the script already exists
    let script =
      document.querySelector<HTMLScriptElement>(
        'script[data-google-translate="true"]'
      );

    // Create it if it doesn't exist
    if (!script) {
      script = document.createElement("script");

      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

      script.async = true;
      script.defer = true;

      script.setAttribute(
        "data-google-translate",
        "true"
      );

      document.body.appendChild(script);
    }

    // Wait for Google to become available
    const interval = window.setInterval(() => {
      if (initializeTranslate()) {
        window.clearInterval(interval);
      }
    }, 500);

    // Stop checking after 15 seconds
    const timeout = window.setTimeout(() => {
      window.clearInterval(interval);
    }, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.clearTimeout(timeout);

      if (
        window.googleTranslateElementInit
      ) {
        window.googleTranslateElementInit =
          undefined;
      }
    };
  }, []);

  return (
    <div
      id="google_translate_element"
      className="
        fixed
        bottom-5
        left-5
        z-[9998]
        rounded-xl
        bg-white
        p-2
        shadow-lg
      "
    />
  );
}