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

/*
 * ============================================================
 * GET APP LANGUAGE
 * ============================================================
 */

function getSelectedLanguage(): string {
  try {
    const savedLanguage = localStorage.getItem(
      "netherlandsGuideAppLanguage"
    );

    if (savedLanguage) {
      return savedLanguage;
    }
  } catch (error) {
    console.warn("Could not read app language:", error);
  }

  return "English";
}

/*
 * ============================================================
 * GOOGLE LANGUAGE
 * ============================================================
 */

function getGoogleLanguage(language: string): string {
  return languageMap[language] || "en";
}

/*
 * ============================================================
 * APPLY GOOGLE TRANSLATE LANGUAGE
 * ============================================================
 */

function setGoogleTranslateLanguage(language: string) {
  const googleLanguage = getGoogleLanguage(language);

  /*
   * ==========================================================
   * ENGLISH
   * ==========================================================
   */

  if (googleLanguage === "en") {
    document.cookie =
      "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    document.cookie =
      `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;

    const select =
      document.querySelector<HTMLSelectElement>(".goog-te-combo");

    if (select) {
      select.value = "en";

      select.dispatchEvent(
        new Event("change", {
          bubbles: true,
        })
      );
    }

    return;
  }

  /*
   * ==========================================================
   * OTHER LANGUAGES
   * ==========================================================
   */

  const cookieValue = `/en/${googleLanguage}`;

  document.cookie =
    `googtrans=${cookieValue}; path=/;`;

  document.cookie =
    `googtrans=${cookieValue}; path=/; domain=${window.location.hostname};`;

  const select =
    document.querySelector<HTMLSelectElement>(".goog-te-combo");

  if (select) {
    select.value = googleLanguage;

    select.dispatchEvent(
      new Event("change", {
        bubbles: true,
      })
    );
  }
}

/*
 * ============================================================
 * COMPONENT
 * ============================================================
 */

export default function GoogleTranslate() {
  useEffect(() => {
    let cancelled = false;

    /*
     * ========================================================
     * HIDE GOOGLE TRANSLATE UI
     * ========================================================
     *
     * Google Translate is still loaded and used as the
     * translation engine.
     *
     * Only Google's visible interface is hidden.
     */

    const style = document.createElement("style");

    style.setAttribute(
      "data-netherway-google-translate",
      "true"
    );

    style.textContent = `
      /*
       * Hide the Google Translate container completely.
       * The Google widget still exists in the DOM so that
       * JavaScript can control its language selector.
       */

      #google_translate_element {
        position: fixed !important;
        width: 0 !important;
        height: 0 !important;
        min-width: 0 !important;
        min-height: 0 !important;
        max-width: 0 !important;
        max-height: 0 !important;
        overflow: hidden !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
        z-index: -999999 !important;
        left: -999999px !important;
        top: -999999px !important;
      }

      /*
       * Google Translate top banner / toolbar
       */

      .goog-te-banner-frame,
      .goog-te-banner-frame.skiptranslate,
      iframe.goog-te-banner-frame,
      body > .skiptranslate {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        width: 0 !important;
        max-height: 0 !important;
        max-width: 0 !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      /*
       * Prevent Google from pushing the entire page down.
       */

      html,
      body {
        top: 0 !important;
        margin-top: 0 !important;
      }

      /*
       * Hide Google's visible gadget/dropdown.
       */

      .goog-te-gadget,
      .goog-te-gadget-simple,
      .goog-te-gadget-icon,
      .goog-te-menu-value,
      .goog-te-menu-frame,
      .goog-te-menu2,
      .goog-te-spinner-pos {
        display: none !important;
        visibility: hidden !important;
      }

      /*
       * Hide Google's branding/text.
       */

      .goog-te-gadget span,
      .goog-te-gadget a,
      .goog-te-gadget img {
        display: none !important;
        visibility: hidden !important;
      }

      /*
       * Hide Google Translate popups/menus if Google creates
       * them outside the main container.
       */

      .goog-te-balloon-frame,
      .goog-te-ftab,
      .goog-te-ftab-float,
      .goog-te-menu-frame {
        display: none !important;
        visibility: hidden !important;
      }

      /*
       * Hide Google Translate tooltip/highlight UI.
       */

      .goog-tooltip,
      .goog-tooltip:hover,
      .goog-text-highlight {
        display: none !important;
        visibility: hidden !important;
        background: transparent !important;
        box-shadow: none !important;
      }

      /*
       * Make sure the page never gets shifted by Google.
       */

      body.translated-ltr,
      body.translated-rtl {
        top: 0 !important;
        margin-top: 0 !important;
      }
    `;

    document.head.appendChild(style);

    /*
     * ========================================================
     * APPLY CURRENT APP LANGUAGE
     * ========================================================
     */

    const applyCurrentLanguage = () => {
      if (cancelled) {
        return;
      }

      const selectedLanguage = getSelectedLanguage();

      setGoogleTranslateLanguage(selectedLanguage);
    };

    /*
     * ========================================================
     * INITIALIZE GOOGLE TRANSLATE
     * ========================================================
     */

    const initializeTranslate = () => {
      if (cancelled) {
        return false;
      }

      const element = document.getElementById(
        "google_translate_element"
      );

      if (
        !element ||
        !window.google?.translate?.TranslateElement
      ) {
        return false;
      }

      /*
       * Don't initialize twice.
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
       * Give Google time to create its internal selector.
       */

      window.setTimeout(() => {
        if (!cancelled) {
          applyCurrentLanguage();
        }
      }, 500);

      return true;
    };

    /*
     * ========================================================
     * GOOGLE CALLBACK
     * ========================================================
     */

    window.googleTranslateElementInit =
      initializeTranslate;

    /*
     * ========================================================
     * LOAD GOOGLE SCRIPT
     * ========================================================
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
       * Keep checking until Google has loaded.
       */

      const interval = window.setInterval(() => {
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
     * ========================================================
     * APP LANGUAGE EVENT
     * ========================================================
     */

    const handleLanguageChange = (event: Event) => {
      const customEvent =
        event as CustomEvent<{
          language?: string;
        }>;

      const selectedLanguage =
        customEvent.detail?.language ||
        getSelectedLanguage();

      /*
       * Save ONLY the app language.
       */

      try {
        localStorage.setItem(
          "netherlandsGuideAppLanguage",
          selectedLanguage
        );
      } catch (error) {
        console.warn(
          "Could not save app language:",
          error
        );
      }

      /*
       * Apply immediately.
       */

      setGoogleTranslateLanguage(
        selectedLanguage
      );

      /*
       * Apply again after Google reacts.
       */

      window.setTimeout(() => {
        if (!cancelled) {
          setGoogleTranslateLanguage(
            selectedLanguage
          );
        }
      }, 700);
    };

    window.addEventListener(
      "netherlandsGuideLanguageChange",
      handleLanguageChange
    );

    /*
     * ========================================================
     * CLEANUP
     * ========================================================
     */

    return () => {
      cancelled = true;

      window.removeEventListener(
        "netherlandsGuideLanguageChange",
        handleLanguageChange
      );

      if (window.googleTranslateElementInit) {
        window.googleTranslateElementInit =
          undefined;
      }

      style.remove();
    };
  }, []);

  /*
   * Google's actual widget exists here.
   *
   * It is invisible, but JavaScript can still control it.
   */

  return (
    <div
      id="google_translate_element"
      aria-hidden="true"
    />
  );
}