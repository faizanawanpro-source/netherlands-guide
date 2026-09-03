"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

const languageMap: Record<string, string> = {
  English: "en",
  Nederlands: "nl",
  اردو: "ur",
  हिन्दी: "hi",
  ਪੰਜਾਬੀ: "pa",
  العربية: "ar",
  Türkçe: "tr",
  中文: "zh-CN",
  Українська: "uk",
  فارسی: "fa",
  پښتو: "ps",
  Français: "fr",
  Español: "es",
  Deutsch: "de",
  Polski: "pl",
  Português: "pt",
  Italiano: "it",
  Русский: "ru",
  বাংলা: "bn",
  Română: "ro",
  Ελληνικά: "el",
};

function getSelectedLanguage() {
  try {
    const directLanguage = localStorage.getItem(
      "netherlandsGuideAppLanguage"
    );

    if (directLanguage) {
      return directLanguage;
    }

    const savedProfile = localStorage.getItem(
      "netherlandsGuideProfile"
    );

    if (savedProfile) {
      const profile = JSON.parse(savedProfile);

      if (profile?.appLanguage) {
        return profile.appLanguage;
      }
    }
  } catch (error) {
    console.warn(
      "Could not read app language:",
      error
    );
  }

  return "English";
}

function getGoogleLanguage(language: string) {
  return languageMap[language] || "en";
}

function setGoogleTranslateLanguage(language: string) {
  const googleLanguage =
    getGoogleLanguage(language);

  /*
   * Google Translate uses the googtrans cookie
   * to remember the selected translation.
   *
   * /en/ur means:
   * translate from English to Urdu.
   */

  if (googleLanguage === "en") {
    document.cookie =
      "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    document.cookie =
      "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" +
      window.location.hostname +
      ";";

    return;
  }

  const cookieValue = `/en/${googleLanguage}`;

  document.cookie =
    `googtrans=${cookieValue}; path=/;`;

  /*
   * Google Translate also sometimes checks
   * the domain cookie.
   */

  document.cookie =
    `googtrans=${cookieValue}; path=/; domain=${window.location.hostname};`;

  /*
   * If the Google Translate select exists,
   * change it directly.
   */

  const select =
    document.querySelector<HTMLSelectElement>(
      ".goog-te-combo"
    );

  if (select) {
    select.value = googleLanguage;

    select.dispatchEvent(
      new Event("change", {
        bubbles: true,
      })
    );
  }
}

export default function GoogleTranslate() {
  useEffect(() => {
    let cancelled = false;

    /*
     * ============================================================
     * HIDE GOOGLE TRANSLATE UI
     * ============================================================
     *
     * Google Translate still runs, but the user never sees
     * the Google Translate dropdown/button.
     */

    const style = document.createElement("style");

    style.setAttribute(
      "data-netherway-google-translate",
      "true"
    );

    style.textContent = `
      #google_translate_element {
        position: fixed !important;
        width: 1px !important;
        height: 1px !important;
        overflow: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        z-index: -1 !important;
        left: -9999px !important;
        bottom: -9999px !important;
      }

      .goog-te-banner-frame {
        display: none !important;
      }

      body {
        top: 0 !important;
      }

      .goog-te-gadget {
        font-size: 0 !important;
      }

      .goog-te-gadget span {
        display: none !important;
      }

      .goog-te-menu-value {
        display: none !important;
      }
    `;

    document.head.appendChild(style);

    /*
     * ============================================================
     * INITIALIZE GOOGLE TRANSLATE
     * ============================================================
     */

    const initializeTranslate = () => {
      if (cancelled) {
        return false;
      }

      const element =
        document.getElementById(
          "google_translate_element"
        );

      if (
        !element ||
        !window.google?.translate?.TranslateElement
      ) {
        return false;
      }

      /*
       * Don't create the widget twice.
       */

      if (element.children.length === 0) {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",

              includedLanguages:
                "en,nl,de,fr,es,it,pt,pl,ar,tr,ur,hi,pa,zh-CN,uk,fa,ps,ro,el,bn,ru",

              autoDisplay: false,
            },

            "google_translate_element"
          );
        } catch (error) {
          console.warn(
            "Google Translate could not initialize:",
            error
          );

          return false;
        }
      }

      /*
       * Give Google a moment to create its
       * internal select element.
       */

      window.setTimeout(() => {
        if (!cancelled) {
          setGoogleTranslateLanguage(
            getSelectedLanguage()
          );
        }
      }, 300);

      return true;
    };

    window.googleTranslateElementInit =
      initializeTranslate;

    /*
     * ============================================================
     * LOAD GOOGLE TRANSLATE SCRIPT
     * ============================================================
     */

    if (!initializeTranslate()) {
      let script =
        document.querySelector<HTMLScriptElement>(
          'script[data-google-translate="true"]'
        );

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

      /*
       * Wait for Google Translate to become available.
       */

      const interval =
        window.setInterval(() => {
          if (initializeTranslate()) {
            window.clearInterval(interval);
          }
        }, 500);

      /*
       * Stop checking after 15 seconds.
       */

      window.setTimeout(() => {
        window.clearInterval(interval);
      }, 15000);
    }

    /*
     * ============================================================
     * LISTEN FOR APP LANGUAGE CHANGES
     * ============================================================
     */

    const handleLanguageChange = (
      event: Event
    ) => {
      const customEvent =
        event as CustomEvent<{
          language?: string;
        }>;

      const selectedLanguage =
        customEvent.detail?.language ||
        getSelectedLanguage();

      localStorage.setItem(
        "netherlandsGuideAppLanguage",
        selectedLanguage
      );

      /*
       * If Google is already ready, switch immediately.
       */

      setGoogleTranslateLanguage(
        selectedLanguage
      );

      /*
       * Google Translate sometimes needs a
       * small delay after initialization.
       */

      window.setTimeout(() => {
        if (!cancelled) {
          setGoogleTranslateLanguage(
            selectedLanguage
          );
        }
      }, 500);
    };

    window.addEventListener(
      "netherlandsGuideLanguageChange",
      handleLanguageChange
    );

    /*
     * ============================================================
     * CLEANUP
     * ============================================================
     */

    return () => {
      cancelled = true;

      window.removeEventListener(
        "netherlandsGuideLanguageChange",
        handleLanguageChange
      );

      if (
        window.googleTranslateElementInit
      ) {
        window.googleTranslateElementInit =
          undefined;
      }

      style.remove();
    };
  }, []);

  /*
   * IMPORTANT:
   * This element must exist so Google Translate
   * can initialize, but it is intentionally invisible.
   */

  return (
    <div
      id="google_translate_element"
      aria-hidden="true"
    />
  );
}