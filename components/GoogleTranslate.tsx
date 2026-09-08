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

function getGoogleLanguage(language: string): string {
  return languageMap[language] || "en";
}

function setGoogleTranslateLanguage(language: string) {
  const googleLanguage = getGoogleLanguage(language);

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

export default function GoogleTranslate() {
  useEffect(() => {
    let cancelled = false;

    /*
     * ========================================================
     * PROTECT REACT FROM GOOGLE TRANSLATE DOM CHANGES
     * ========================================================
     *
     * Google Translate can remove or replace DOM nodes that
     * React still expects to exist.
     *
     * When React tries to remove a node that Google Translate
     * has already removed, the browser throws:
     *
     * NotFoundError: The object can not be found here.
     *
     * This small protection only skips the DOM operation when
     * the node is genuinely no longer a child of the parent.
     *
     * Normal React DOM operations continue to work normally.
     */

    const originalRemoveChild = Node.prototype.removeChild;

    Node.prototype.removeChild = function <T extends Node>(
      child: T
    ): T {
      if (child.parentNode !== this) {
        return child;
      }

      return originalRemoveChild.call(this, child) as T;
    };

    /*
     * Google Translate can also change the reference node
     * used by insertBefore. Protect that operation as well.
     */

    const originalInsertBefore = Node.prototype.insertBefore;

    Node.prototype.insertBefore = function <T extends Node>(
      node: T,
      child: Node | null
    ): T {
      if (child && child.parentNode !== this) {
        return originalInsertBefore.call(this, node, null) as T;
      }

      return originalInsertBefore.call(this, node, child) as T;
    };

    /*
     * ========================================================
     * HIDE GOOGLE TRANSLATE UI
     * ========================================================
     */

    const style = document.createElement("style");

    style.setAttribute(
      "data-netherway-google-translate",
      "true"
    );

    style.textContent = `
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

      html,
      body {
        top: 0 !important;
        margin-top: 0 !important;
      }

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

      .goog-te-gadget span,
      .goog-te-gadget a,
      .goog-te-gadget img {
        display: none !important;
        visibility: hidden !important;
      }

      .goog-te-balloon-frame,
      .goog-te-ftab,
      .goog-te-ftab-float,
      .goog-te-menu-frame {
        display: none !important;
        visibility: hidden !important;
      }

      .goog-tooltip,
      .goog-tooltip:hover,
      .goog-text-highlight {
        display: none !important;
        visibility: hidden !important;
        background: transparent !important;
        box-shadow: none !important;
      }

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

      const interval = window.setInterval(() => {
        if (initializeTranslate()) {
          window.clearInterval(interval);
        }
      }, 500);

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

      setGoogleTranslateLanguage(
        selectedLanguage
      );

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

      /*
       * Restore the original browser DOM methods.
       */

      Node.prototype.removeChild =
        originalRemoveChild;

      Node.prototype.insertBefore =
        originalInsertBefore;

      style.remove();
    };
  }, []);

  return (
    <div
      id="google_translate_element"
      aria-hidden="true"
    />
  );
}
