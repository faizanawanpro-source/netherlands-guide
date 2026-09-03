"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const cities = [
  "Amsterdam",
  "Rotterdam",
  "The Hague",
  "Utrecht",
  "Eindhoven",
  "Groningen",
  "Tilburg",
  "Almere",
  "Breda",
  "Nijmegen",
  "Apeldoorn",
  "Haarlem",
  "Arnhem",
  "Amersfoort",
  "Hilversum",
  "Leiden",
  "Delft",
  "Enschede",
  "Zwolle",
  "Other city",
];

const languages = [
  "English",
  "Nederlands",
  "اردو",
  "हिन्दी",
  "ਪੰਜਾਬੀ",
  "العربية",
  "Türkçe",
  "中文",
  "Українська",
  "فارسی",
  "پښتو",
  "Français",
  "Español",
  "Deutsch",
  "Polski",
  "Português",
  "Italiano",
  "Русский",
  "বাংলা",
  "Română",
  "Ελληνικά",
];

const familyOptions = [
  ["partner", "❤️", "Partner / wife / husband"],
  ["children", "👨‍👩‍👧‍👦", "Children"],
  ["parents", "👨‍👩‍👦", "Parents"],
  ["siblings", "👫", "Brothers / sisters"],
  ["other", "👪", "Other family"],
];

const documentOptions = [
  ["bsn", "🔢", "BSN", "My citizen service number"],
  ["digid", "🪪", "DigiD", "My Dutch digital identity"],
  [
    "residence",
    "🛂",
    "Residence document",
    "My residence permit or document",
  ],
  [
    "municipality",
    "🏛️",
    "Municipality registration",
    "I am registered with a Dutch municipality",
  ],
  [
    "letters",
    "📬",
    "Official letters",
    "I receive letters from Dutch authorities",
  ],
];

type ProfileData = {
  name?: string;
  age?: string;
  profile?: string;
  city?: string;

  /*
   * IMPORTANT:
   * language is the EXISTING Voice Assistant language.
   * We are NOT changing its meaning.
   */
  language?: string;

  hasFamily?: string;
  familyMembers?: string[];
  documents?: string[];
};

export default function OnboardingPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [profile, setProfile] = useState("");
  const [city, setCity] = useState("");

  /*
   * ============================================================
   * VOICE ASSISTANT LANGUAGE
   * ============================================================
   *
   * DO NOT CHANGE THIS.
   *
   * This is the existing Preferred language setting.
   */

  const [language, setLanguage] = useState("English");

  /*
   * ============================================================
   * APP READING LANGUAGE
   * ============================================================
   *
   * NEW
   *
   * This is completely separate from "language".
   *
   * This controls Google Translate / the written app language.
   */

  const [appLanguage, setAppLanguage] = useState("English");

  const [hasFamily, setHasFamily] = useState("");
  const [familyMembers, setFamilyMembers] = useState<string[]>([]);
  const [documents, setDocuments] = useState<string[]>([]);

  const [loaded, setLoaded] = useState(false);

  const isTourist = profile === "tourist";
  const isStudent = profile === "student";
  const isNewcomer = profile === "refugee";
  const isResident = profile === "resident";

  /*
   * ============================================================
   * LOAD EXISTING PROFILE
   * ============================================================
   */

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(
        "netherlandsGuideProfile"
      );

      /*
       * Load the EXISTING profile.
       *
       * The "language" property here remains the Voice
       * Assistant language.
       */

      if (savedProfile) {
        const parsed: ProfileData = JSON.parse(savedProfile);

        setName(parsed.name || "");
        setAge(parsed.age || "");
        setProfile(parsed.profile || "");
        setCity(parsed.city || "");

        /*
         * EXISTING VOICE ASSISTANT LANGUAGE.
         * DO NOT CONNECT THIS TO GOOGLE TRANSLATE.
         */

        setLanguage(parsed.language || "English");

        setHasFamily(parsed.hasFamily || "");

        setFamilyMembers(
          Array.isArray(parsed.familyMembers)
            ? parsed.familyMembers
            : []
        );

        setDocuments(
          Array.isArray(parsed.documents)
            ? parsed.documents
            : []
        );
      }

      /*
       * ========================================================
       * LOAD SEPARATE APP LANGUAGE
       * ========================================================
       */

      const savedAppLanguage = localStorage.getItem(
        "netherlandsGuideAppLanguage"
      );

      if (savedAppLanguage) {
        setAppLanguage(savedAppLanguage);
      }
    } catch (error) {
      console.error(
        "Could not load saved profile:",
        error
      );
    }

    setLoaded(true);
  }, []);

  /*
   * ============================================================
   * APP LANGUAGE CHANGE
   * ============================================================
   *
   * IMPORTANT:
   *
   * This does NOT change "language".
   *
   * It only changes the written app language.
   */

  function handleAppLanguageChange(
    selectedLanguage: string
  ) {
    setAppLanguage(selectedLanguage);

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
     * Tell GoogleTranslate.tsx that the app language changed.
     */

    window.dispatchEvent(
      new CustomEvent(
        "netherlandsGuideLanguageChange",
        {
          detail: {
            language: selectedLanguage,
          },
        }
      )
    );
  }

  /*
   * ============================================================
   * REQUIREMENTS
   * ============================================================
   */

  const baseRequirements =
    name.trim() !== "" &&
    age !== "" &&
    profile !== "" &&
    language !== "";

  const touristRequirements = isTourist;

  const studentRequirements =
    isStudent && city !== "";

  const newcomerRequirements =
    isNewcomer &&
    city !== "" &&
    hasFamily !== "" &&
    documents.length > 0 &&
    (hasFamily === "no" ||
      familyMembers.length > 0);

  const residentRequirements =
    isResident &&
    city !== "" &&
    hasFamily !== "" &&
    documents.length > 0 &&
    (hasFamily === "no" ||
      familyMembers.length > 0);

  const canContinue =
    baseRequirements &&
    (
      touristRequirements ||
      studentRequirements ||
      newcomerRequirements ||
      residentRequirements
    );

  /*
   * ============================================================
   * PROFILE CHANGE
   * ============================================================
   */

  function handleProfileChange(
    selectedProfile: string
  ) {
    setProfile(selectedProfile);

    if (selectedProfile === "tourist") {
      setCity("");
      setHasFamily("");
      setFamilyMembers([]);
      setDocuments([]);
    }

    if (selectedProfile === "student") {
      setHasFamily("");
      setFamilyMembers([]);
      setDocuments([]);
    }

    if (
      selectedProfile === "refugee" ||
      selectedProfile === "resident"
    ) {
      setHasFamily("");
      setFamilyMembers([]);
      setDocuments([]);
    }
  }

  /*
   * ============================================================
   * FAMILY
   * ============================================================
   */

  function toggleFamily(id: string) {
    setFamilyMembers((current) => {
      if (current.includes(id)) {
        return current.filter(
          (item) => item !== id
        );
      }

      return [...current, id];
    });
  }

  /*
   * ============================================================
   * DOCUMENTS
   * ============================================================
   */

  function toggleDocument(id: string) {
    setDocuments((current) => {
      if (current.includes(id)) {
        return current.filter(
          (item) => item !== id
        );
      }

      return [...current, id];
    });
  }

  /*
   * ============================================================
   * SAVE PROFILE
   * ============================================================
   */

  function handleContinue() {
    if (!canContinue) {
      return;
    }

    const profileData: ProfileData = {
      name: name.trim(),
      age,
      profile,
      city,

      /*
       * EXISTING VOICE ASSISTANT LANGUAGE.
       * KEEP EXACTLY AS BEFORE.
       */

      language,

      hasFamily:
        isNewcomer || isResident
          ? hasFamily
          : "",

      familyMembers:
        isNewcomer || isResident
          ? familyMembers
          : [],

      documents:
        isNewcomer || isResident
          ? documents
          : [],
    };

    try {
      /*
       * Existing profile storage.
       */

      localStorage.setItem(
        "netherlandsGuideProfile",
        JSON.stringify(profileData)
      );

      /*
       * NEW:
       * Store APP READING LANGUAGE separately.
       *
       * This does NOT overwrite profile.language.
       */

      localStorage.setItem(
        "netherlandsGuideAppLanguage",
        appLanguage
      );

      /*
       * Existing onboarding completion flag.
       */

      localStorage.setItem(
        "netherlandsGuideOnboardingComplete",
        "true"
      );

      router.push("/dashboard");
    } catch (error) {
      console.error(
        "Could not save profile:",
        error
      );
    }
  }

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">

          <div className="text-5xl">
            🇳🇱
          </div>

          <p className="mt-4 font-bold text-slate-700">
            Loading your profile...
          </p>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <header className="border-b bg-white">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-2xl">
              🇳🇱
            </div>

            <div>

              <h1 className="font-bold">
                Netherlands Guide
              </h1>

              <p className="text-xs text-slate-500">
                Your guide to life and travel in the Netherlands
              </p>

            </div>

          </div>

          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold">
            {localStorage.getItem(
              "netherlandsGuideProfile"
            )
              ? "Edit profile"
              : "Get started"}
          </span>

        </div>

      </header>


      {/* ====================================================== */}
      {/* MAIN */}
      {/* ====================================================== */}

      <section className="mx-auto max-w-4xl px-6 py-10">

        <div className="rounded-3xl bg-white p-8 shadow-xl md:p-10">

          <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
            Personalize your guide
          </p>

          <h2 className="mt-2 text-3xl font-black">
            {name
              ? `Welcome back, ${name}!`
              : "Let's set up your profile"}
          </h2>

          <p className="mt-3 text-slate-500">
            Tell us a little about yourself so we can show you
            the information and tools that actually matter to you.
          </p>


          {/* ================================================== */}
          {/* NAME */}
          {/* ================================================== */}

          <div className="mt-8">

            <label className="font-bold">
              What is your name?
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="e.g. Faizan"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 focus:bg-white"
            />

          </div>


          {/* ================================================== */}
          {/* AGE */}
          {/* ================================================== */}

          <div className="mt-6">

            <label className="font-bold">
              How old are you?
            </label>

            <input
              type="number"
              min="0"
              max="120"
              value={age}
              onChange={(event) =>
                setAge(event.target.value)
              }
              placeholder="e.g. 25"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 focus:bg-white"
            />

          </div>


          {/* ================================================== */}
          {/* PROFILE */}
          {/* ================================================== */}

          <div className="mt-8">

            <h3 className="font-bold">
              Which describes you best?
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">

              {/* REFUGEE */}

              <button
                type="button"
                onClick={() =>
                  handleProfileChange("refugee")
                }
                className={`rounded-2xl border p-5 text-left transition ${
                  profile === "refugee"
                    ? "border-orange-500 bg-orange-50"
                    : "border-slate-200 hover:border-orange-300"
                }`}
              >

                <div className="text-3xl">
                  🕊️
                </div>

                <p className="mt-3 font-bold">
                  Refugee / newcomer
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  I am settling into life in the Netherlands.
                </p>

              </button>


              {/* STUDENT */}

              <button
                type="button"
                onClick={() =>
                  handleProfileChange("student")
                }
                className={`rounded-2xl border p-5 text-left transition ${
                  profile === "student"
                    ? "border-orange-500 bg-orange-50"
                    : "border-slate-200 hover:border-orange-300"
                }`}
              >

                <div className="text-3xl">
                  🎓
                </div>

                <p className="mt-3 font-bold">
                  International student
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  I am studying or starting my education.
                </p>

              </button>


              {/* TOURIST */}

              <button
                type="button"
                onClick={() =>
                  handleProfileChange("tourist")
                }
                className={`rounded-2xl border p-5 text-left transition ${
                  profile === "tourist"
                    ? "border-orange-500 bg-orange-50"
                    : "border-slate-200 hover:border-orange-300"
                }`}
              >

                <div className="text-3xl">
                  ✈️
                </div>

                <p className="mt-3 font-bold">
                  Tourist
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  I am visiting the Netherlands.
                </p>

              </button>


              {/* RESIDENT */}

              <button
                type="button"
                onClick={() =>
                  handleProfileChange("resident")
                }
                className={`rounded-2xl border p-5 text-left transition ${
                  profile === "resident"
                    ? "border-orange-500 bg-orange-50"
                    : "border-slate-200 hover:border-orange-300"
                }`}
              >

                <div className="text-3xl">
                  🏡
                </div>

                <p className="mt-3 font-bold">
                  Resident
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  I already live in the Netherlands.
                </p>

              </button>

            </div>

          </div>


          {/* ================================================== */}
          {/* TOURIST MESSAGE */}
          {/* ================================================== */}

          {isTourist && (

            <div className="mt-8 rounded-2xl border border-orange-200 bg-orange-50 p-5">

              <div className="flex gap-4">

                <div className="text-3xl">
                  ✈️
                </div>

                <div>

                  <h3 className="font-black text-orange-900">
                    Welcome, traveller!
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-orange-800">
                    We'll focus your guide on places to visit,
                    trip planning, transport, food, activities
                    and practical travel help.
                  </p>

                </div>

              </div>

            </div>

          )}


          {/* ================================================== */}
          {/* CITY */}
          {/* ================================================== */}

          {!isTourist && profile !== "" && (

            <div className="mt-8">

              <label className="font-bold">

                {isStudent
                  ? "Which city do you live or study in?"
                  : "Which city do you live in?"}

              </label>

              <p className="mt-1 text-sm text-slate-500">
                Choose the city that is most relevant to you.
              </p>

              <select
                value={city}
                onChange={(event) =>
                  setCity(event.target.value)
                }
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 focus:bg-white"
              >

                <option value="">
                  Choose your city
                </option>

                {cities.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}

              </select>

            </div>

          )}


          {/* ================================================== */}
          {/* TOURIST DESTINATION */}
          {/* ================================================== */}

          {isTourist && (

            <div className="mt-8">

              <label className="font-bold">

                Where are you staying?

                <span className="ml-2 font-normal text-slate-400">
                  Optional
                </span>

              </label>

              <p className="mt-1 text-sm text-slate-500">
                Choose your main destination if you already know it.
              </p>

              <select
                value={city}
                onChange={(event) =>
                  setCity(event.target.value)
                }
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 focus:bg-white"
              >

                <option value="">
                  I'm travelling around / not decided
                </option>

                {cities.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}

              </select>

            </div>

          )}


          {/* ================================================== */}
          {/* FAMILY */}
          {/* ================================================== */}

          {(isNewcomer || isResident) && (

            <div className="mt-8">

              <h3 className="font-bold">
                Do you have family in the Netherlands?
              </h3>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">

                <button
                  type="button"
                  onClick={() =>
                    setHasFamily("yes")
                  }
                  className={`rounded-2xl border p-5 text-left transition ${
                    hasFamily === "yes"
                      ? "border-orange-500 bg-orange-50"
                      : "border-slate-200 hover:border-orange-300"
                  }`}
                >

                  <div className="text-3xl">
                    👨‍👩‍👧‍👦
                  </div>

                  <p className="mt-3 font-bold">
                    Yes
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    I have family here.
                  </p>

                </button>


                <button
                  type="button"
                  onClick={() => {
                    setHasFamily("no");
                    setFamilyMembers([]);
                  }}
                  className={`rounded-2xl border p-5 text-left transition ${
                    hasFamily === "no"
                      ? "border-orange-500 bg-orange-50"
                      : "border-slate-200 hover:border-orange-300"
                  }`}
                >

                  <div className="text-3xl">
                    🙋
                  </div>

                  <p className="mt-3 font-bold">
                    No
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    I don't have family here.
                  </p>

                </button>

              </div>

            </div>

          )}


          {/* ================================================== */}
          {/* FAMILY TYPES */}
          {/* ================================================== */}

          {(isNewcomer || isResident) &&
            hasFamily === "yes" && (

              <div className="mt-6 rounded-2xl bg-slate-50 p-5">

                <h3 className="font-bold">
                  Who do you have here?
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  You can choose more than one.
                </p>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">

                  {familyOptions.map((item) => {

                    const id = item[0];
                    const icon = item[1];
                    const label = item[2];

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() =>
                          toggleFamily(id)
                        }
                        className={`rounded-xl border p-4 text-left transition ${
                          familyMembers.includes(id)
                            ? "border-orange-500 bg-orange-50"
                            : "border-white bg-white hover:border-orange-300"
                        }`}
                      >

                        <span className="mr-2">
                          {icon}
                        </span>

                        <span className="font-semibold">
                          {label}
                        </span>

                        {familyMembers.includes(id) && (
                          <span className="float-right">
                            ✅
                          </span>
                        )}

                      </button>
                    );

                  })}

                </div>

              </div>

            )}


          {/* ================================================== */}
          {/* DOCUMENTS */}
          {/* ================================================== */}

          {(isNewcomer || isResident) && (

            <div className="mt-8">

              <h3 className="font-bold">
                Which documents or services do you already have?
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                This helps us personalize your Netherlands-life tools.
              </p>

              <div className="mt-4 space-y-3">

                {documentOptions.map((item) => {

                  const id = item[0];
                  const icon = item[1];
                  const title = item[2];
                  const description = item[3];

                  const selected =
                    documents.includes(id);

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() =>
                        toggleDocument(id)
                      }
                      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                        selected
                          ? "border-green-500 bg-green-50"
                          : "border-slate-200 bg-white hover:border-orange-300"
                      }`}
                    >

                      <div className="text-3xl">
                        {icon}
                      </div>

                      <div className="flex-1">

                        <p className="font-bold">
                          {title}
                        </p>

                        <p className="text-sm text-slate-500">
                          {description}
                        </p>

                      </div>

                      <div className="text-xl">
                        {selected
                          ? "✅"
                          : "○"}
                      </div>

                    </button>
                  );

                })}

              </div>

            </div>

          )}


          {/* ================================================== */}
          {/* VOICE ASSISTANT LANGUAGE */}
          {/* ================================================== */}

          <div className="mt-8">

            <label className="font-bold">
              Preferred language
            </label>

            <p className="mt-1 text-sm text-slate-500">
              We'll use this for your guide and explanations.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">

              {languages.map((item) => (

                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setLanguage(item)
                  }
                  className={`rounded-full px-4 py-2 font-semibold transition ${
                    language === item
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200 bg-white hover:bg-blue-50"
                  }`}
                >
                  {item}
                </button>

              ))}

            </div>

          </div>


          {/* ================================================== */}
          {/* NEW: APP LANGUAGE / GOOGLE TRANSLATE */}
          {/* ================================================== */}

          <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">

            <div className="flex items-start gap-3">

              <div className="text-2xl">
                🌐
              </div>

              <div className="flex-1">

                <label className="font-bold">
                  App language
                </label>

                <p className="mt-1 text-sm text-slate-500">
                  Choose the language you want to read Netherway in.
                </p>

              </div>

            </div>

            <div className="mt-4 flex flex-wrap gap-2">

              {languages.map((item) => (

                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    handleAppLanguageChange(item)
                  }
                  className={`rounded-full px-4 py-2 font-semibold transition ${
                    appLanguage === item
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200 bg-white hover:bg-blue-50"
                  }`}
                >
                  {item}
                </button>

              ))}

            </div>

          </div>


          {/* ================================================== */}
          {/* SUMMARY */}
          {/* ================================================== */}

          <div className="mt-10 rounded-2xl bg-slate-50 p-5">

            <h3 className="font-bold">
              Your profile
            </h3>

            <div className="mt-3 space-y-1 text-sm text-slate-600">

              {name && (
                <p>
                  👋 Name: {name}
                </p>
              )}

              {age && (
                <p>
                  🎂 Age: {age}
                </p>
              )}

              {profile && (
                <p>
                  👤 Profile: {profile}
                </p>
              )}

              {city && (
                <p>
                  📍{" "}
                  {isTourist
                    ? `Main destination: ${city}`
                    : `City: ${city}`}
                </p>
              )}

              {language && (
                <p>
                  🎤 Voice Assistant language: {language}
                </p>
              )}

              {appLanguage && (
                <p>
                  🌐 App language: {appLanguage}
                </p>
              )}

              {(isNewcomer || isResident) &&
                hasFamily && (

                  <p>
                    👨‍👩‍👧‍👦 Family in Netherlands:{" "}
                    {hasFamily === "yes"
                      ? "Yes"
                      : "No"}
                  </p>

                )}

              {(isNewcomer || isResident) && (

                <p>
                  📄 Documents selected:{" "}
                  {documents.length}
                </p>

              )}

            </div>

          </div>


          {/* ================================================== */}
          {/* CONTINUE */}
          {/* ================================================== */}

          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue}
            className={`mt-8 w-full rounded-2xl py-4 font-bold transition ${
              canContinue
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "cursor-not-allowed bg-slate-200 text-slate-400"
            }`}
          >

            {canContinue
              ? "Save my profile →"
              : "Complete your profile to continue"}

          </button>


          {/* ================================================== */}
          {/* PRIVACY */}
          {/* ================================================== */}

          <p className="mt-4 text-center text-xs text-slate-400">
            Your profile is currently stored only on this device.
            Never enter your DigiD password, PIN or other secret
            login details.
          </p>

        </div>

      </section>

    </main>
  );
}