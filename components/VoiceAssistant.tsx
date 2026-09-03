"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Profile = {
  name?: string;
  age?: string;
  city?: string;
  language?: string;
  profile?: string;
  hasFamily?: "yes" | "no";
  familyMembers?: string[];
  documents?: string[];
};

type GeminiMessage = {
  setupComplete?: unknown;
  error?: {
    message?: string;
  };
  serverContent?: {
    modelTurn?: {
      parts?: Array<{
        inlineData?: {
          data?: string;
          mimeType?: string;
        };
      }>;
    };
    inputTranscription?: {
      text?: string;
    };
    outputTranscription?: {
      text?: string;
    };
    interrupted?: boolean;
    turnComplete?: boolean;
  };
  toolCall?: {
    functionCalls?: Array<{
      id?: string;
      name?: string;
      args?: {
        path?: string;
      };
    }>;
  };
};

const ALLOWED_PATHS = new Set([
  "/dashboard",
  "/dutch-phone-number",
  "/housing",
  "/documents",
  "/healthcare",
  "/money",
  "/work",
  "/study",
  "/transport",
  "/municipality",
  "/vehicles",
  "/waste",
  "/explore",
  "/plan-day",
  "/trip-planner",
  "/scanner",
  "/what-do-i-do",
]);

export default function VoiceAssistant() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile>({});
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState("");

  const websocketRef = useRef<WebSocket | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const microphoneContextRef =
    useRef<AudioContext | null>(null);
  const microphoneSourceRef =
    useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef =
    useRef<ScriptProcessorNode | null>(null);

  const outputContextRef =
    useRef<AudioContext | null>(null);
  const nextAudioTimeRef =
    useRef(0);
  const audioSourcesRef =
    useRef<AudioBufferSourceNode[]>([]);

  const isNavigatingRef =
    useRef(false);
  const microphoneStartedRef =
    useRef(false);
  const greetingSentRef =
    useRef(false);
  const lastNavigationTextRef =
    useRef("");

  // ============================================================
  // CONNECTION CONTROL
  // ============================================================

  const connectionIdRef =
    useRef(0);

  const connectionTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  // ============================================================
  // LOAD PROFILE
  // ============================================================

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          "netherlandsGuideProfile"
        );

      if (saved) {
        setProfile(
          JSON.parse(saved)
        );
      }
    } catch (error) {
      console.error(
        "Could not load profile:",
        error
      );
    }
  }, []);

  // ============================================================
  // CLEANUP ON UNMOUNT
  // ============================================================

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  // ============================================================
  // LANGUAGE
  // ============================================================

  function getProfileLanguage() {
    const language = String(
      profile?.language || "English"
    )
      .trim()
      .toLowerCase();

    if (
      language.includes("urdu") ||
      language.includes("اردو")
    ) {
      return "Urdu";
    }

    if (
      language.includes("dutch") ||
      language.includes("nederlands") ||
      language === "nl"
    ) {
      return "Dutch";
    }

    if (
      language.includes("german") ||
      language.includes("deutsch") ||
      language === "de"
    ) {
      return "German";
    }

    if (
      language.includes("french") ||
      language.includes("français") ||
      language === "fr"
    ) {
      return "French";
    }

    if (
      language.includes("spanish") ||
      language.includes("español") ||
      language === "es"
    ) {
      return "Spanish";
    }

    if (
      language.includes("arabic") ||
      language.includes("العربية") ||
      language === "ar"
    ) {
      return "Arabic";
    }

    if (
      language.includes("punjabi") ||
      language.includes("ਪੰਜਾਬੀ") ||
      language === "pa"
    ) {
      return "Punjabi";
    }

    if (
      language.includes("hindi") ||
      language.includes("हिन्दी") ||
      language.includes("हिंदी") ||
      language === "hi"
    ) {
      return "Hindi";
    }

    if (
      language.includes("turkish") ||
      language.includes("türkçe") ||
      language === "tr"
    ) {
      return "Turkish";
    }

    if (
      language.includes("ukrainian") ||
      language.includes("українська") ||
      language === "uk"
    ) {
      return "Ukrainian";
    }

    if (
      language.includes("russian") ||
      language.includes("русский") ||
      language === "ru"
    ) {
      return "Russian";
    }

    if (
      language.includes("chinese") ||
      language.includes("中文") ||
      language.includes("普通话") ||
      language.includes("mandarin") ||
      language === "zh"
    ) {
      return "Chinese";
    }

    if (
      language.includes("pashto") ||
      language.includes("پښتو") ||
      language === "ps"
    ) {
      return "Pashto";
    }

    if (
      language.includes("farsi") ||
      language.includes("persian") ||
      language.includes("فارسی") ||
      language === "fa"
    ) {
      return "Farsi";
    }

    return "English";
  }

  // ============================================================
  // BASE64
  // ============================================================

  function arrayBufferToBase64(
    buffer: ArrayBuffer
  ) {
    const bytes =
      new Uint8Array(buffer);

    let binary = "";

    const chunkSize =
      0x8000;

    for (
      let i = 0;
      i < bytes.length;
      i += chunkSize
    ) {
      const chunk =
        bytes.subarray(
          i,
          Math.min(
            i + chunkSize,
            bytes.length
          )
        );

      binary += String.fromCharCode(
        ...chunk
      );
    }

    return btoa(binary);
  }

  // ============================================================
  // FLOAT -> PCM16
  // ============================================================

  function floatTo16BitPCM(
    input: Float32Array
  ) {
    const output =
      new Int16Array(
        input.length
      );

    for (
      let i = 0;
      i < input.length;
      i++
    ) {
      const sample =
        Math.max(
          -1,
          Math.min(
            1,
            input[i]
          )
        );

      output[i] =
        sample < 0
          ? sample * 0x8000
          : sample * 0x7fff;
    }

    return output.buffer;
  }

  // ============================================================
  // DOWNSAMPLE -> 16KHZ
  // ============================================================

  function downsampleTo16k(
    input: Float32Array,
    inputSampleRate: number
  ) {
    if (
      inputSampleRate ===
      16000
    ) {
      return input;
    }

    const ratio =
      inputSampleRate /
      16000;

    const newLength =
      Math.round(
        input.length /
          ratio
      );

    const result =
      new Float32Array(
        newLength
      );

    let offsetResult = 0;
    let offsetBuffer = 0;

    while (
      offsetResult <
      result.length
    ) {
      const nextOffsetBuffer =
        Math.round(
          (offsetResult + 1) *
            ratio
        );

      let accum = 0;
      let count = 0;

      for (
        let i =
          offsetBuffer;
        i <
          nextOffsetBuffer &&
        i <
          input.length;
        i++
      ) {
        accum += input[i];
        count++;
      }

      result[
        offsetResult
      ] =
        count > 0
          ? accum / count
          : 0;

      offsetResult++;
      offsetBuffer =
        nextOffsetBuffer;
    }

    return result;
  }

  // ============================================================
  // SEND AUDIO
  // ============================================================

  function sendAudioChunk(
    pcmBuffer: ArrayBuffer
  ) {
    const socket =
      websocketRef.current;

    if (
      !socket ||
      socket.readyState !==
        WebSocket.OPEN
    ) {
      return;
    }

    try {
      socket.send(
        JSON.stringify({
          realtimeInput: {
            audio: {
              data:
                arrayBufferToBase64(
                  pcmBuffer
                ),
              mimeType:
                "audio/pcm;rate=16000",
            },
          },
        })
      );
    } catch (error) {
      console.error(
        "Could not send audio:",
        error
      );
    }
  }

  // ============================================================
  // STOP ALL AUDIO
  // ============================================================

  function stopAllAudio() {
    audioSourcesRef.current.forEach(
      (source) => {
        try {
          source.stop();
        } catch {}
      }
    );

    audioSourcesRef.current =
      [];

    nextAudioTimeRef.current =
      0;

    setSpeaking(false);
  }

  // ============================================================
  // PLAY GEMINI AUDIO
  // ============================================================

  async function playAudio(
    base64Audio: string
  ) {
    try {
      let context =
        outputContextRef.current;

      if (!context) {
        context =
          new AudioContext({
            sampleRate: 24000,
          });

        outputContextRef.current =
          context;
      }

      if (
        context.state ===
        "suspended"
      ) {
        await context.resume();
      }

      const binary =
        atob(base64Audio);

      const bytes =
        new Uint8Array(
          binary.length
        );

      for (
        let i = 0;
        i < binary.length;
        i++
      ) {
        bytes[i] =
          binary.charCodeAt(i);
      }

      const pcm =
        new Int16Array(
          bytes.buffer
        );

      const audioBuffer =
        context.createBuffer(
          1,
          pcm.length,
          24000
        );

      const channel =
        audioBuffer.getChannelData(
          0
        );

      for (
        let i = 0;
        i < pcm.length;
        i++
      ) {
        channel[i] =
          pcm[i] / 32768;
      }

      const source =
        context.createBufferSource();

      source.buffer =
        audioBuffer;

      source.connect(
        context.destination
      );

      const now =
        context.currentTime;

      if (
        nextAudioTimeRef.current <
        now
      ) {
        nextAudioTimeRef.current =
          now;
      }

      source.start(
        nextAudioTimeRef.current
      );

      audioSourcesRef.current.push(
        source
      );

      nextAudioTimeRef.current +=
        audioBuffer.duration;

      setSpeaking(true);

      source.onended = () => {
        audioSourcesRef.current =
          audioSourcesRef.current.filter(
            (item) =>
              item !== source
          );

        if (
          audioSourcesRef.current
            .length === 0
        ) {
          setSpeaking(false);
        }
      };
    } catch (error) {
      console.error(
        "Audio playback error:",
        error
      );
    }
  }

  // ============================================================
  // MULTILINGUAL SMART NAVIGATION
  // ============================================================

  function detectNavigationPath(
    text: string
  ): string | null {
    if (!text) {
      return null;
    }

    /*
     * Normalize Unicode so languages such as Arabic,
     * Urdu, Hindi, Chinese etc. can be matched reliably.
     */

    const normalized =
      text
        .toLowerCase()
        .normalize("NFKC")
        .trim();

    if (!normalized) {
      return null;
    }

    /*
     * ----------------------------------------------------------
     * HOUSING
     * ----------------------------------------------------------
     */

    const housingTerms = [
      // English
      "housing",
      "house",
      "apartment",
      "room",
      "rent",
      "rental",
      "accommodation",
      "place to live",

      // Dutch
      "woning",
      "wonen",
      "huis",
      "huur",
      "huren",
      "kamer",
      "woonruimte",
      "huisvesting",

      // German
      "wohnung",
      "haus",
      "zimmer",
      "miete",
      "mieten",
      "unterkunft",

      // French
      "logement",
      "maison",
      "appartement",
      "chambre",
      "loyer",
      "louer",

      // Spanish
      "vivienda",
      "casa",
      "apartamento",
      "habitación",
      "alquiler",
      "alquilar",

      // Turkish
      "ev",
      "konut",
      "daire",
      "oda",
      "kira",
      "kiralık",

      // Arabic
      "سكن",
      "منزل",
      "بيت",
      "شقة",
      "غرفة",
      "إيجار",

      // Urdu
      "گھر",
      "مکان",
      "فلیٹ",
      "کمرہ",
      "کرایہ",
      "رہائش",

      // Hindi
      "घर",
      "मकान",
      "फ्लैट",
      "कमरा",
      "किराया",
      "आवास",

      // Punjabi
      "ਘਰ",
      "ਮਕਾਨ",
      "ਕਮਰਾ",
      "ਕਿਰਾਇਆ",
      "ਰਿਹਾਇਸ਼",

      // Persian
      "خانه",
      "آپارتمان",
      "اتاق",
      "اجاره",
      "مسکن",

      // Russian
      "жилье",
      "дом",
      "квартира",
      "комната",
      "аренда",

      // Ukrainian
      "житло",
      "будинок",
      "квартира",
      "кімната",
      "оренда",
    ];

    if (
      housingTerms.some(
        (term) =>
          normalized.includes(term)
      )
    ) {
      return "/housing";
    }

    /*
     * ----------------------------------------------------------
     * TRANSPORT
     * ----------------------------------------------------------
     */

    const transportTerms = [
      // English
      "transport",
      "public transport",
      "bus",
      "train",
      "tram",
      "metro",
      "subway",
      "ovpay",
      "ov-chipkaart",
      "ov chipkaart",
      "ns",

      // Dutch
      "openbaar vervoer",
      "trein",
      "bus",
      "tram",
      "metro",
      "ovpay",
      "ov-chipkaart",

      // German
      "verkehr",
      "öffentliche verkehrsmittel",
      "zug",
      "bahn",
      "bus",
      "straßenbahn",
      "u-bahn",

      // French
      "transport",
      "transports publics",
      "train",
      "métro",
      "tramway",
      "bus",

      // Spanish
      "transporte",
      "transporte público",
      "tren",
      "metro",
      "autobús",

      // Turkish
      "ulaşım",
      "toplu taşıma",
      "tren",
      "otobüs",
      "metro",
      "tramvay",

      // Arabic
      "المواصلات",
      "النقل",
      "النقل العام",
      "قطار",
      "حافلة",
      "ترام",
      "مترو",

      // Urdu
      "ٹرانسپورٹ",
      "نقل و حمل",
      "پبلک ٹرانسپورٹ",
      "ٹرین",
      "بس",
      "میٹرو",

      // Hindi
      "परिवहन",
      "सार्वजनिक परिवहन",
      "ट्रेन",
      "बस",
      "मेट्रो",

      // Punjabi
      "ਆਵਾਜਾਈ",
      "ਜਨਤਕ ਆਵਾਜਾਈ",
      "ਰੇਲ",
      "ਬੱਸ",
      "ਮੈਟਰੋ",

      // Persian
      "حمل و نقل",
      "حمل‌ونقل",
      "حمل و نقل عمومی",
      "قطار",
      "اتوبوس",
      "مترو",

      // Russian
      "транспорт",
      "общественный транспорт",
      "поезд",
      "автобус",
      "метро",
      "трамвай",

      // Ukrainian
      "транспорт",
      "громадський транспорт",
      "поїзд",
      "автобус",
      "метро",
      "трамвай",
    ];

    if (
      transportTerms.some(
        (term) =>
          normalized.includes(term)
      )
    ) {
      return "/transport";
    }

    /*
     * ----------------------------------------------------------
     * PHONE / SIM
     * ----------------------------------------------------------
     */

    const phoneTerms = [
      "phone number",
      "dutch number",
      "sim card",
      "simkaart",
      "sim",
      "mobile number",
      "telefoonnummer",
      "mobiel nummer",

      "telefonnummer",
      "sim-karte",

      "numéro de téléphone",
      "carte sim",

      "número de teléfono",
      "tarjeta sim",

      "telefon numarası",
      "sim kart",

      "رقم الهاتف",
      "شريحة",
      "شريحة اتصال",

      "فون نمبر",
      "موبائل نمبر",
      "سم کارڈ",

      "फोन नंबर",
      "मोबाइल नंबर",
      "सिम कार्ड",

      "ਫੋਨ ਨੰਬਰ",
      "ਮੋਬਾਈਲ ਨੰਬਰ",
      "ਸਿਮ ਕਾਰਡ",

      "شماره تلفن",
      "سیم کارت",

      "номер телефона",
      "сим-карта",

      "номер телефону",
    ];

    if (
      phoneTerms.some(
        (term) =>
          normalized.includes(term)
      )
    ) {
      return "/dutch-phone-number";
    }

    /*
     * ----------------------------------------------------------
     * DOCUMENTS / BSN / DIGID
     * ----------------------------------------------------------
     */

    const documentTerms = [
      "document",
      "documents",
      "bsn",
      "digid",
      "digi d",
      "residence permit",
      "residence card",
      "passport",
      "letter",

      "documenten",
      "brief",
      "verblijfsvergunning",
      "paspoort",

      "dokument",
      "aufenthaltstitel",
      "reisepass",

      "document",
      "passeport",
      "titre de séjour",

      "documentos",
      "pasaporte",
      "permiso de residencia",

      "belge",
      "ikamet",
      "pasaport",

      "وثيقة",
      "وثائق",
      "جواز سفر",
      "إقامة",

      "دستاویز",
      "دستاویزات",
      "پاسپورٹ",
      "رہائشی اجازت",

      "दस्तावेज़",
      "दस्तावेज",
      "पासपोर्ट",
      "निवास परमिट",

      "ਦਸਤਾਵੇਜ਼",
      "ਪਾਸਪੋਰਟ",

      "مدرک",
      "مدارک",
      "گذرنامه",
      "اقامت",

      "документ",
      "документы",
      "паспорт",
      "вид на жительство",

      "документ",
      "документи",
      "паспорт",
    ];

    if (
      documentTerms.some(
        (term) =>
          normalized.includes(term)
      )
    ) {
      return "/documents";
    }

    /*
     * ----------------------------------------------------------
     * HEALTHCARE
     * ----------------------------------------------------------
     */

    const healthcareTerms = [
      "healthcare",
      "health care",
      "doctor",
      "hospital",
      "health insurance",
      "medicine",
      "medication",
      "pharmacy",

      "huisarts",
      "dokter",
      "ziekenhuis",
      "zorgverzekering",
      "apotheek",
      "medicijn",

      "arzt",
      "krankenhaus",
      "krankenversicherung",
      "apotheke",

      "médecin",
      "hôpital",
      "assurance maladie",
      "pharmacie",

      "médico",
      "hospital",
      "seguro médico",
      "farmacia",

      "doktor",
      "hastane",
      "sağlık sigortası",
      "eczane",

      "طبيب",
      "مستشفى",
      "تأمين صحي",
      "صيدلية",
      "دواء",

      "ڈاکٹر",
      "ہسپتال",
      "صحت",
      "ہیلتھ انشورنس",
      "فارمیسی",
      "دوا",

      "डॉक्टर",
      "अस्पताल",
      "स्वास्थ्य बीमा",
      "दवा",
      "फार्मेसी",

      "ਡਾਕਟਰ",
      "ਹਸਪਤਾਲ",
      "ਸਿਹਤ",
      "ਦਵਾਈ",

      "پزشک",
      "بیمارستان",
      "بیمه",
      "داروخانه",
      "دارو",

      "врач",
      "больница",
      "медицинская страховка",
      "аптека",
      "лекарство",

      "лікар",
      "лікарня",
      "медична страховка",
      "аптека",
    ];

    if (
      healthcareTerms.some(
        (term) =>
          normalized.includes(term)
      )
    ) {
      return "/healthcare";
    }

    /*
     * ----------------------------------------------------------
     * MONEY / TAX / BENEFITS
     * ----------------------------------------------------------
     */

    const moneyTerms = [
      "money",
      "bank",
      "banking",
      "tax",
      "taxes",
      "benefit",
      "benefits",
      "allowance",
      "toeslag",
      "belasting",
      "geld",
      "bankrekening",

      "geld",
      "belasting",
      "toeslagen",

      "geld",
      "steuer",
      "steuern",
      "bank",
      "geldleistung",

      "argent",
      "banque",
      "impôt",
      "allocations",

      "dinero",
      "banco",
      "impuestos",
      "beneficios",

      "para",
      "banka",
      "vergi",

      "مال",
      "بینک",
      "ٹیکس",
      "ٹیکسز",
      "فائدہ",
      "الاؤنس",

      "पैसा",
      "बैंक",
      "टैक्स",
      "लाभ",
      "भत्ता",

      "ਪੈਸਾ",
      "ਬੈਂਕ",
      "ਟੈਕਸ",
      "ਲਾਭ",

      "پول",
      "بانک",
      "مالیات",
      "مالیات",

      "деньги",
      "банк",
      "налог",
      "пособие",

      "гроші",
      "банк",
      "податок",
      "допомога",

      "مال",
      "بنك",
      "ضريبة",
      "إعانة",
    ];

    if (
      moneyTerms.some(
        (term) =>
          normalized.includes(term)
      )
    ) {
      return "/money";
    }

    /*
     * ----------------------------------------------------------
     * WORK
     * ----------------------------------------------------------
     */

    const workTerms = [
      "work",
      "job",
      "employment",
      "salary",
      "career",

      "werk",
      "baan",
      "werken",
      "salaris",
      "vacature",

      "arbeit",
      "job",
      "beruf",
      "gehalt",

      "travail",
      "emploi",
      "salaire",
      "métier",

      "trabajo",
      "empleo",
      "salario",

      "iş",
      "işe",
      "çalışmak",
      "maaş",

      "عمل",
      "وظيفة",
      "راتب",
      "توظيف",

      "کام",
      "نوکری",
      "ملازمت",
      "تنخواہ",

      "काम",
      "नौकरी",
      "रोजगार",
      "वेतन",

      "ਕੰਮ",
      "ਨੌਕਰੀ",
      "ਤਨਖਾਹ",

      "کار",
      "شغل",
      "حقوق",

      "работа",
      "работать",
      "вакансия",
      "зарплата",

      "робота",
      "працювати",
      "вакансія",
      "зарплата",
    ];

    if (
      workTerms.some(
        (term) =>
          normalized.includes(term)
      )
    ) {
      return "/work";
    }

    /*
     * ----------------------------------------------------------
     * STUDY
     * ----------------------------------------------------------
     */

    const studyTerms = [
      "study",
      "studying",
      "school",
      "university",
      "college",
      "education",
      "student",

      "studie",
      "opleiding",
      "universiteit",
      "school",

      "studium",
      "schule",
      "universität",
      "ausbildung",

      "études",
      "étudier",
      "école",
      "université",
      "éducation",

      "estudio",
      "estudiar",
      "escuela",
      "universidad",
      "educación",

      "öğrenim",
      "okul",
      "üniversite",
      "eğitim",
      "öğrenci",

      "دراسة",
      "مدرسة",
      "جامعة",
      "تعليم",
      "طالب",

      "پڑھائی",
      "تعلیم",
      "اسکول",
      "یونیورسٹی",
      "طالب علم",

      "पढ़ाई",
      "स्कूल",
      "विश्वविद्यालय",
      "शिक्षा",
      "छात्र",

      "ਪੜ੍ਹਾਈ",
      "ਸਕੂਲ",
      "ਯੂਨੀਵਰਸਿਟੀ",
      "ਸਿੱਖਿਆ",
      "ਵਿਦਿਆਰਥੀ",

      "تحصیل",
      "دانشگاه",
      "مدرسه",
      "آموزش",

      "учеба",
      "учиться",
      "школа",
      "университет",
      "образование",
      "студент",

      "навчання",
      "вчитися",
      "школа",
      "університет",
      "освіта",
      "студент",
    ];

    if (
      studyTerms.some(
        (term) =>
          normalized.includes(term)
      )
    ) {
      return "/study";
    }

    /*
     * ----------------------------------------------------------
     * MUNICIPALITY
     * ----------------------------------------------------------
     */

    const municipalityTerms = [
      "municipality",
      "registration",
      "register",
      "registering",
      "town hall",
      "city hall",

      "gemeente",
      "registratie",
      "inschrijven",
      "gemeentehuis",

      "gemeinde",
      "anmeldung",
      "rathaus",

      "mairie",
      "commune",
      "inscription",

      "ayuntamiento",
      "municipio",
      "registro",

      "belediye",
      "kayıt",

      "بلدية",
      "تسجيل",
      "البلدية",

      "میونسپلٹی",
      "رجسٹریشن",
      "بلدیہ",

      "नगरपालिका",
      "पंजीकरण",

      "ਨਗਰਪਾਲਿਕਾ",
      "ਰਜਿਸਟ੍ਰੇਸ਼ਨ",

      "شهرداری",
      "ثبت",

      "муниципалитет",
      "регистрация",
      "мэрия",

      "муніципалітет",
      "реєстрація",
      "мерія",
    ];

    if (
      municipalityTerms.some(
        (term) =>
          normalized.includes(term)
      )
    ) {
      return "/municipality";
    }

    /*
     * ----------------------------------------------------------
     * VEHICLES / DRIVING / PARKING
     * ----------------------------------------------------------
     */

    const vehicleTerms = [
      "car",
      "driving",
      "driving licence",
      "driving license",
      "parking",
      "vehicle",

      "auto",
      "rijbewijs",
      "parkeren",
      "auto parkeren",

      "auto",
      "führerschein",
      "parken",
      "fahrzeug",

      "voiture",
      "permis de conduire",
      "stationnement",
      "véhicule",

      "coche",
      "carnet de conducir",
      "aparcar",
      "estacionamiento",

      "araba",
      "ehliyet",
      "park",
      "park etmek",

      "سيارة",
      "قيادة",
      "رخصة القيادة",
      "موقف سيارات",

      "گاڑی",
      "ڈرائیونگ",
      "ڈرائیونگ لائسنس",
      "پارکنگ",

      "कार",
      "ड्राइविंग",
      "ड्राइविंग लाइसेंस",
      "पार्किंग",

      "ਗੱਡੀ",
      "ਡਰਾਈਵਿੰਗ",
      "ਲਾਇਸੈਂਸ",
      "ਪਾਰਕਿੰਗ",

      "ماشین",
      "رانندگی",
      "گواهینامه",
      "پارکینگ",

      "машина",
      "вождение",
      "водительские права",
      "парковка",

      "автомобіль",
      "водіння",
      "водійські права",
      "паркування",
    ];

    if (
      vehicleTerms.some(
        (term) =>
          normalized.includes(term)
      )
    ) {
      return "/vehicles";
    }

    /*
     * ----------------------------------------------------------
     * WASTE
     * ----------------------------------------------------------
     */

    const wasteTerms = [
      "waste",
      "trash",
      "garbage",
      "recycling",
      "recycle",

      "afval",
      "vuilnis",
      "recyclen",

      "müll",
      "abfall",
      "recycling",

      "déchets",
      "ordures",
      "recyclage",

      "residuos",
      "basura",
      "reciclaje",

      "atık",
      "çöp",
      "geri dönüşüm",

      "نفايات",
      "قمامة",
      "إعادة التدوير",

      "کچرا",
      "فضلہ",
      "ری سائیکلنگ",

      "कचरा",
      "अपशिष्ट",
      "रीसाइक्लिंग",

      "ਕੂੜਾ",
      "ਰੱਦੀ",
      "ਰੀਸਾਈਕਲਿੰਗ",

      "زباله",
      "پسماند",
      "بازیافت",

      "мусор",
      "отходы",
      "переработка",

      "сміття",
      "відходи",
      "переробка",
    ];

    if (
      wasteTerms.some(
        (term) =>
          normalized.includes(term)
      )
    ) {
      return "/waste";
    }

    /*
     * ----------------------------------------------------------
     * EXPLORE
     * ----------------------------------------------------------
     */

    const exploreTerms = [
      "things to do",
      "activities",
      "places to visit",
      "what can i do",
      "explore",
      "attractions",

      "activiteiten",
      "uitjes",
      "bezienswaardigheden",

      "aktivitäten",
      "sehenswürdigkeiten",

      "activités",
      "choses à faire",
      "visiter",

      "actividades",
      "cosas que hacer",
      "lugares para visitar",

      "activiteiten",
      "gezellig",

      "أنشطة",
      "أماكن للزيارة",
      "ماذا أفعل",

      "سرگرمیاں",
      "دیکھنے کی جگہیں",
      "کیا کر سکتا ہوں",

      "गतिविधियाँ",
      "घूमने की जगहें",
      "क्या कर सकता हूँ",

      "سرگرمیاں",
      "جگہیں",

      "развлечения",
      "достопримечательности",
      "куда сходить",

      "розваги",
      "пам'ятки",
      "куди піти",
    ];

    if (
      exploreTerms.some(
        (term) =>
          normalized.includes(term)
      )
    ) {
      return "/explore";
    }

    /*
     * ----------------------------------------------------------
     * PLAN DAY
     * ----------------------------------------------------------
     */

    const planDayTerms = [
      "plan my day",
      "plan today",
      "what should i do today",
      "today",

      "vandaag",
      "dag plannen",

      "heute",
      "meinen tag planen",

      "aujourd'hui",
      "planifier ma journée",

      "hoy",
      "planificar mi día",

      "bugün",
      "günümü planla",

      "اليوم",
      "خطط ليومي",

      "آج",
      "میرا دن پلان کرو",

      "आज",
      "मेरा दिन प्लान करो",

      "ਅੱਜ",
      "ਮੇਰਾ ਦਿਨ ਪਲਾਨ ਕਰੋ",

      "امروز",
      "برنامه روز",

      "сегодня",
      "спланировать день",

      "сьогодні",
      "спланувати день",
    ];

    if (
      planDayTerms.some(
        (term) =>
          normalized.includes(term)
      )
    ) {
      return "/plan-day";
    }

    /*
     * ----------------------------------------------------------
     * TRIP PLANNER
     * ----------------------------------------------------------
     */

    const tripTerms = [
      "trip",
      "travel",
      "trip planner",
      "holiday",
      "vacation",

      "reis",
      "vakantie",

      "reise",
      "urlaub",

      "voyage",
      "vacances",

      "viaje",
      "vacaciones",

      "seyahat",
      "tatil",

      "سفر",
      "رحلة",
      "عطلة",

      "سفر",
      "چھٹی",
      "سیر",

      "यात्रा",
      "छुट्टी",
      "सफर",

      "ਯਾਤਰਾ",
      "ਛੁੱਟੀ",

      "سفر",
      "تعطیلات",

      "поездка",
      "путешествие",
      "отпуск",

      "подорож",
      "відпустка",
    ];

    if (
      tripTerms.some(
        (term) =>
          normalized.includes(term)
      )
    ) {
      return "/trip-planner";
    }

    /*
     * ----------------------------------------------------------
     * SCANNER
     * ----------------------------------------------------------
     */

    const scannerTerms = [
      "scan this",
      "scan a letter",
      "scan document",
      "what does this letter say",
      "what does this mean",

      "scan dit",
      "brief scannen",
      "document scannen",

      "scannen",
      "dokument scannen",

      "scanner",
      "numériser",
      "scanner ce document",

      "escanear",
      "escanear documento",

      "belgeyi tara",

      "امسح",
      "مسح المستند",
      "ماذا تعني هذه الرسالة",

      "اسکین",
      "خط اسکین کرو",
      "اس دستاویز کو اسکین کرو",

      "स्कैन",
      "दस्तावेज़ स्कैन करो",

      "ਸਕੈਨ",
      "ਦਸਤਾਵੇਜ਼ ਸਕੈਨ ਕਰੋ",

      "اسکن",
      "مدرک را اسکن کن",

      "сканировать",
      "отсканировать документ",

      "сканувати",
      "відсканувати документ",
    ];

    if (
      scannerTerms.some(
        (term) =>
          normalized.includes(term)
      )
    ) {
      return "/scanner";
    }

    /*
     * ----------------------------------------------------------
     * WHAT DO I DO
     * ----------------------------------------------------------
     */

    const helpTerms = [
      "what should i do",
      "what do i do",
      "what can i do",
      "i don't know what to do",
      "i don't understand",
      "help me",

      "wat moet ik doen",
      "wat kan ik doen",
      "ik begrijp het niet",
      "help me",

      "was soll ich tun",
      "ich verstehe nicht",
      "hilf mir",

      "que debo hacer",
      "no entiendo",
      "ayúdame",

      "que dois-je faire",
      "je ne comprends pas",
      "aidez-moi",

      "ne yapmalıyım",
      "anlamıyorum",
      "yardım et",

      "ماذا يجب أن أفعل",
      "لا أفهم",
      "ساعدني",

      "مجھے کیا کرنا چاہیے",
      "مجھے سمجھ نہیں آ رہی",
      "میری مدد کریں",

      "मुझे क्या करना चाहिए",
      "मुझे समझ नहीं आ रहा",
      "मेरी मदद करो",

      "ਮੈਨੂੰ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ",
      "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆ ਰਹੀ",
      "ਮੇਰੀ ਮਦਦ ਕਰੋ",

      "چه کار کنم",
      "متوجه نمی شوم",
      "کمکم کن",

      "что мне делать",
      "я не понимаю",
      "помоги мне",

      "що мені робити",
      "я не розумію",
      "допоможи мені",
    ];

    if (
      helpTerms.some(
        (term) =>
          normalized.includes(term)
      )
    ) {
      return "/what-do-i-do";
    }

    return null;
  }

  // ============================================================
  // NAVIGATION
  // ============================================================

  function navigateToPage(
    path: string
  ) {
    if (
      !ALLOWED_PATHS.has(path)
    ) {
      console.error(
        "Blocked navigation:",
        path
      );

      return false;
    }

    if (
      isNavigatingRef.current
    ) {
      return false;
    }

    isNavigatingRef.current =
      true;

    console.log(
      "🧭 ACTUALLY NAVIGATING:",
      path
    );

    stopAllAudio();

    try {
      router.push(path);
    } catch (error) {
      console.error(
        "Router navigation failed:",
        error
      );

      isNavigatingRef.current =
        false;

      return false;
    }

    window.setTimeout(() => {
      isNavigatingRef.current =
        false;
    }, 1500);

    return true;
  }

  // ============================================================
  // USER TRANSCRIPTION
  // ============================================================

  function handleUserTranscription(
    text: string
  ) {
    if (!text) {
      return;
    }

    console.log(
      "👤 USER:",
      text
    );

    const normalized =
      text
        .toLowerCase()
        .normalize("NFKC")
        .trim();

    if (
      normalized ===
      lastNavigationTextRef.current
    ) {
      return;
    }

    lastNavigationTextRef.current =
      normalized;

    const path =
      detectNavigationPath(
        normalized
      );

    if (!path) {
      return;
    }

    console.log(
      "🧭 LOCAL MULTILINGUAL NAVIGATION DETECTED:",
      {
        text,
        path,
        language:
          getProfileLanguage(),
      }
    );

    navigateToPage(path);
  }

  // ============================================================
  // TOOL RESPONSE
  // ============================================================

  function sendToolResponse(
    id: string,
    name: string,
    path: string,
    success: boolean
  ) {
    const socket =
      websocketRef.current;

    if (
      !socket ||
      socket.readyState !==
        WebSocket.OPEN
    ) {
      return;
    }

    try {
      socket.send(
        JSON.stringify({
          toolResponse: {
            functionResponses: [
              {
                id,
                name,
                response: {
                  success,
                  path,
                },
              },
            ],
          },
        })
      );

      console.log(
        "📤 Tool response sent:",
        {
          id,
          path,
          success,
        }
      );
    } catch (error) {
      console.error(
        "Could not send tool response:",
        error
      );
    }
  }

  // ============================================================
  // MICROPHONE
  // ============================================================

  async function startMicrophoneProcessing(
    stream: MediaStream
  ) {
    if (
      microphoneStartedRef.current
    ) {
      return;
    }

    microphoneStartedRef.current =
      true;

    try {
      const context =
        new AudioContext();

      microphoneContextRef.current =
        context;

      await context.resume();

      const source =
        context.createMediaStreamSource(
          stream
        );

      microphoneSourceRef.current =
        source;

      const processor =
        context.createScriptProcessor(
          4096,
          1,
          1
        );

      processorRef.current =
        processor;

      processor.onaudioprocess =
        (event) => {
          const input =
            event.inputBuffer.getChannelData(
              0
            );

          const downsampled =
            downsampleTo16k(
              input,
              context.sampleRate
            );

          const pcm =
            floatTo16BitPCM(
              downsampled
            );

          sendAudioChunk(pcm);

          setListening(true);
        };

      source.connect(
        processor
      );

      processor.connect(
        context.destination
      );

      console.log(
        "🎤 Microphone streaming started."
      );
    } catch (error) {
      microphoneStartedRef.current =
        false;

      console.error(
        "Microphone processing error:",
        error
      );

      throw error;
    }
  }

  // ============================================================
  // CONNECTION TIMEOUT
  // ============================================================

  function clearConnectionTimeout() {
    if (
      connectionTimeoutRef.current
    ) {
      clearTimeout(
        connectionTimeoutRef.current
      );

      connectionTimeoutRef.current =
        null;
    }
  }

  function startConnectionTimeout(
    connectionId: number
  ) {
    clearConnectionTimeout();

    connectionTimeoutRef.current =
      setTimeout(() => {
        if (
          connectionIdRef.current !==
          connectionId
        ) {
          return;
        }

        console.error(
          "⏱️ Gemini connection timed out."
        );

        setError(
          "The voice connection took too long. Please try again."
        );

        cleanup();

        setConnecting(false);
        setConnected(false);
        setListening(false);
        setSpeaking(false);
      }, 15000);
  }

  // ============================================================
  // GEMINI MESSAGE
  // ============================================================

  async function handleGeminiMessage(
    data: GeminiMessage
  ) {
    console.log(
      "📩 Gemini:",
      data
    );

    // ----------------------------------------------------------
    // ERROR
    // ----------------------------------------------------------

    if (data.error) {
      console.error(
        "Gemini server error:",
        data.error
      );

      setError(
        data.error.message ||
          "Gemini returned an error."
      );

      return;
    }

    // ----------------------------------------------------------
    // SETUP COMPLETE
    // ----------------------------------------------------------

    if (data.setupComplete) {
      console.log(
        "✅ Gemini setup complete."
      );

      clearConnectionTimeout();

      setConnected(true);
      setConnecting(false);

      const stream =
        microphoneStreamRef.current;

      if (stream) {
        try {
          await startMicrophoneProcessing(
            stream
          );
        } catch (error) {
          console.error(
            "Could not start microphone:",
            error
          );

          setError(
            "Could not start microphone streaming."
          );
        }
      }

      // ONE GREETING ONLY

      if (
        !greetingSentRef.current
      ) {
        greetingSentRef.current =
          true;

        const socket =
          websocketRef.current;

        if (
          socket &&
          socket.readyState ===
            WebSocket.OPEN
        ) {
          socket.send(
            JSON.stringify({
              clientContent: {
                turns: [
                  {
                    role: "user",
                    parts: [
                      {
                        text: `
Give one very short, warm welcome.

Speak ONLY in ${getProfileLanguage()}.

This is the first greeting of the session.

Do not explain anything.

Do not mention AI, technology, APIs, code or systems.

Use the requested language from your very first word.

Keep it natural and conversational.

Do not switch to English unless the user specifically asks for English.
                        `.trim(),
                      },
                    ],
                  },
                ],
                turnComplete: true,
              },
            })
          );

          console.log(
            "👋 One-time multilingual greeting requested."
          );
        }
      }

      return;
    }

    // ----------------------------------------------------------
    // INTERRUPTION
    // ----------------------------------------------------------

    if (
      data.serverContent
        ?.interrupted
    ) {
      console.log(
        "🛑 Gemini interrupted."
      );

      stopAllAudio();
    }

    // ----------------------------------------------------------
    // AUDIO
    // ----------------------------------------------------------

    const audioParts =
      data.serverContent
        ?.modelTurn
        ?.parts || [];

    for (
      const part of audioParts
    ) {
      const inlineData =
        part?.inlineData;

      if (
        inlineData?.data &&
        inlineData?.mimeType?.startsWith(
          "audio/pcm"
        )
      ) {
        await playAudio(
          inlineData.data
        );
      }
    }

    // ----------------------------------------------------------
    // INPUT TRANSCRIPTION
    // ----------------------------------------------------------

    const inputText =
      data.serverContent
        ?.inputTranscription
        ?.text;

    if (inputText) {
      handleUserTranscription(
        inputText
      );
    }

    // ----------------------------------------------------------
    // OUTPUT TRANSCRIPTION
    // ----------------------------------------------------------

    const outputText =
      data.serverContent
        ?.outputTranscription
        ?.text;

    if (outputText) {
      console.log(
        "🤖 GEMINI:",
        outputText
      );
    }

    // ----------------------------------------------------------
    // FUNCTION CALL
    // ----------------------------------------------------------

    const functionCalls =
      data.toolCall
        ?.functionCalls;

    if (functionCalls) {
      console.log(
        "🧭 FUNCTION CALLS RECEIVED:",
        functionCalls
      );

      for (
        const functionCall of functionCalls
      ) {
        if (
          functionCall.name !==
          "navigate_to_page"
        ) {
          continue;
        }

        const path =
          functionCall.args
            ?.path;

        const id =
          functionCall.id;

        console.log(
          "🧭 GEMINI NAVIGATION REQUEST:",
          {
            path,
            id,
          }
        );

        if (
          !id ||
          typeof path !==
            "string"
        ) {
          console.error(
            "Invalid navigation function call."
          );

          continue;
        }

        const success =
          navigateToPage(path);

        sendToolResponse(
          id,
          "navigate_to_page",
          path,
          success
        );
      }
    }

    // ----------------------------------------------------------
    // TURN COMPLETE
    // ----------------------------------------------------------

    if (
      data.serverContent
        ?.turnComplete
    ) {
      setListening(false);
    }
  }

  // ============================================================
  // PARSE WEBSOCKET
  // ============================================================

  async function parseWebSocketMessage(
    event: MessageEvent
  ) {
    try {
      if (
        typeof event.data ===
        "string"
      ) {
        return JSON.parse(
          event.data
        );
      }

      if (
        typeof Blob !==
          "undefined" &&
        event.data instanceof
          Blob
      ) {
        const text =
          await event.data.text();

        return JSON.parse(
          text
        );
      }

      if (
        event.data instanceof
        ArrayBuffer
      ) {
        const text =
          new TextDecoder().decode(
            new Uint8Array(
              event.data
            )
          );

        return JSON.parse(
          text
        );
      }

      if (
        event.data &&
        typeof event.data ===
          "object"
      ) {
        console.warn(
          "Unsupported WebSocket data:",
          event.data
        );

        return null;
      }

      return null;
    } catch (error) {
      console.error(
        "❌ Could not decode Gemini WebSocket message:",
        error
      );

      return null;
    }
  }

  // ============================================================
  // START VOICE
  // ============================================================

  async function startVoice() {
    if (
      connecting ||
      connected
    ) {
      return;
    }

    const connectionId =
      connectionIdRef.current +
      1;

    connectionIdRef.current =
      connectionId;

    setError("");
    setConnecting(true);

    microphoneStartedRef.current =
      false;

    greetingSentRef.current =
      false;

    lastNavigationTextRef.current =
      "";

    startConnectionTimeout(
      connectionId
    );

    try {
      // --------------------------------------------------------
      // MICROPHONE
      // --------------------------------------------------------

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices
          .getUserMedia
      ) {
        throw new Error(
          "Microphone access is not available."
        );
      }

      // --------------------------------------------------------
      // MICROPHONE + TOKEN
      //
      // These two operations do not depend on each other,
      // so start them at the same time.
      // --------------------------------------------------------

      const microphonePromise =
        navigator.mediaDevices.getUserMedia(
          {
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
              channelCount: 1,
            },
          }
        );

      const tokenPromise =
        fetch(
          "/api/realtime",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              profile,
            }),
          }
        );

      const [
        stream,
        tokenResponse,
      ] = await Promise.all([
        microphonePromise,
        tokenPromise,
      ]);

      // --------------------------------------------------------
      // CONNECTION STILL VALID?
      // --------------------------------------------------------

      if (
        connectionIdRef.current !==
        connectionId
      ) {
        stream
          .getTracks()
          .forEach(
            (track) =>
              track.stop()
          );

        return;
      }

      // --------------------------------------------------------
      // MICROPHONE
      // --------------------------------------------------------

      microphoneStreamRef.current =
        stream;

      console.log(
        "🎤 Microphone permission granted."
      );

      // --------------------------------------------------------
      // TOKEN
      // --------------------------------------------------------

      const tokenData =
        await tokenResponse.json();

      if (
        !tokenResponse.ok
      ) {
        throw new Error(
          tokenData?.error ||
            "Could not create Gemini realtime token."
        );
      }

      if (
        !tokenData?.token
      ) {
        throw new Error(
          "Gemini realtime token was not returned."
        );
      }

      console.log(
        "🔑 Ephemeral token received."
      );

      // --------------------------------------------------------
      // WEBSOCKET
      // --------------------------------------------------------

      if (
        connectionIdRef.current !==
        connectionId
      ) {
        return;
      }

      const socketUrl =
        `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(
          tokenData.token
        )}`;

      console.log(
        "🔌 Connecting to Gemini Live..."
      );

      const socket =
        new WebSocket(
          socketUrl
        );

      websocketRef.current =
        socket;

      // --------------------------------------------------------
      // OPEN
      // --------------------------------------------------------

      socket.onopen = () => {
        if (
          connectionIdRef.current !==
          connectionId
        ) {
          socket.close();
          return;
        }

        console.log(
          "✅ WebSocket opened."
        );

        try {
          socket.send(
            JSON.stringify({
              setup: {
                model:
                  `models/${tokenData.model}`,

                generationConfig: {
                  responseModalities: [
                    "AUDIO",
                  ],
                  temperature: 0.7,
                },

                inputAudioTranscription:
                  {},

                outputAudioTranscription:
                  {},

                realtimeInputConfig: {
                  automaticActivityDetection:
                    {},
                },

                tools: [
                  {
                    functionDeclarations: [
                      {
                        name:
                          "navigate_to_page",

                        description: `
Navigate the user to the correct Netherlands Guide page when they clearly need information from one of the available sections.

IMPORTANT:
The user can speak ANY language.

Understand the user's intent regardless of the language they use.

Do NOT require English keywords.

The user may speak Dutch, English, Urdu, Hindi, Punjabi, Arabic, German, French, Spanish, Turkish, Russian, Ukrainian, Chinese, Persian, Pashto, or another language.

Always map the user's intent to one of the canonical English URL paths below.

AVAILABLE PAGES:

Housing:
 /housing

Transport and public transport:
 /transport

Dutch phone number or SIM:
 /dutch-phone-number

Documents, BSN, DigiD, passport or residence documents:
 /documents

Healthcare, doctor, hospital, health insurance, medicine:
 /healthcare

Money, bank, taxes, benefits or allowances:
 /money

Work, jobs, employment or salary:
 /work

Study, school, university or education:
 /study

Municipality, registration, gemeente or town hall:
 /municipality

Car, driving, driving licence or parking:
 /vehicles

Waste, garbage, recycling or rubbish:
 /waste

Things to do, activities or places to visit:
 /explore

Planning what to do today:
 /plan-day

Travel, trips, holidays or vacations:
 /trip-planner

Scanning a letter or document:
 /scanner

General "what should I do?" or "I don't understand":
 /what-do-i-do

EXAMPLES IN ANY LANGUAGE SHOULD BE UNDERSTOOD BY MEANING, NOT ONLY BY EXACT WORD MATCHING.

For example, if a user speaks Urdu and asks about finding a house, use /housing.

If a user speaks Hindi and asks about trains or buses, use /transport.

If a user speaks Dutch and asks about their huisarts, use /healthcare.

If a user speaks Arabic and asks about their documents, use /documents.

If a user speaks German and asks about getting a job, use /work.

If a user speaks French and asks about university, use /study.

If a user speaks Spanish and asks about taxes or benefits, use /money.

Do not navigate for casual conversation.

Do not navigate merely because one random word happens to match.

Navigation should happen when the user's INTENT clearly relates to one of the available sections.

Return only one valid canonical path from the allowed list.
                        `.trim(),

                        parameters: {
                          type:
                            "OBJECT",

                          properties: {
                            path: {
                              type:
                                "STRING",

                              enum: [
                                "/dashboard",
                                "/dutch-phone-number",
                                "/housing",
                                "/documents",
                                "/healthcare",
                                "/money",
                                "/work",
                                "/study",
                                "/transport",
                                "/municipality",
                                "/vehicles",
                                "/waste",
                                "/explore",
                                "/plan-day",
                                "/trip-planner",
                                "/scanner",
                                "/what-do-i-do",
                              ],
                            },
                          },

                          required: [
                            "path",
                          ],
                        },
                      },
                    ],
                  },
                ],
              },
            })
          );

          console.log(
            "📤 Multilingual Gemini setup message sent."
          );
        } catch (error) {
          console.error(
            "Could not send setup:",
            error
          );

          clearConnectionTimeout();

          setError(
            "Could not initialize Gemini Live."
          );

          setConnecting(false);
        }
      };

      // --------------------------------------------------------
      // MESSAGE
      // --------------------------------------------------------

      socket.onmessage =
        async (event) => {
          if (
            connectionIdRef.current !==
            connectionId
          ) {
            return;
          }

          const data =
            await parseWebSocketMessage(
              event
            );

          if (!data) {
            return;
          }

          await handleGeminiMessage(
            data
          );
        };

      // --------------------------------------------------------
      // ERROR
      // --------------------------------------------------------

      socket.onerror =
        (event) => {
          if (
            connectionIdRef.current !==
            connectionId
          ) {
            return;
          }

          console.error(
            "❌ WebSocket error:",
            event
          );

          clearConnectionTimeout();

          setError(
            "Gemini voice connection encountered a problem."
          );

          setConnecting(false);
        };

      // --------------------------------------------------------
      // CLOSE
      // --------------------------------------------------------

      socket.onclose =
        (event) => {
          if (
            connectionIdRef.current !==
            connectionId
          ) {
            return;
          }

          console.log(
            "🔴 WebSocket closed.",
            {
              code: event.code,
              reason: event.reason,
            }
          );

          clearConnectionTimeout();

          setConnected(false);
          setConnecting(false);
          setListening(false);

          stopAllAudio();

          microphoneStartedRef.current =
            false;
        };
    } catch (error) {
      if (
        connectionIdRef.current !==
        connectionId
      ) {
        return;
      }

      console.error(
        "❌ Voice startup error:",
        error
      );

      cleanup();

      setConnecting(false);
      setConnected(false);
      setListening(false);
      setSpeaking(false);

      setError(
        error instanceof Error
          ? error.message
          : "Could not start the voice assistant."
      );
    }
  }

  // ============================================================
  // STOP SPEAKING
  // ============================================================

  function stopSpeaking() {
    stopAllAudio();
  }

  // ============================================================
  // CLEANUP
  // ============================================================

  function cleanup() {
    try {
      // Invalidate the current connection so an old
      // WebSocket cannot interfere with a new one.
      connectionIdRef.current +=
        1;

      clearConnectionTimeout();

      stopAllAudio();

      processorRef.current?.disconnect();

      microphoneSourceRef.current?.disconnect();

      microphoneStreamRef.current
        ?.getTracks()
        .forEach((track) => {
          track.stop();
        });

      microphoneStreamRef.current =
        null;

      if (
        microphoneContextRef.current
      ) {
        microphoneContextRef.current
          .close()
          .catch(() => {});
      }

      microphoneContextRef.current =
        null;

      if (
        outputContextRef.current
      ) {
        outputContextRef.current
          .close()
          .catch(() => {});
      }

      outputContextRef.current =
        null;

      if (
        websocketRef.current
      ) {
        try {
          websocketRef.current.close();
        } catch {}
      }

      websocketRef.current =
        null;

      processorRef.current =
        null;

      microphoneSourceRef.current =
        null;

      microphoneStartedRef.current =
        false;

      greetingSentRef.current =
        false;

      lastNavigationTextRef.current =
        "";
    } catch (error) {
      console.error(
        "Cleanup error:",
        error
      );
    }
  }

  // ============================================================
  // DISCONNECT
  // ============================================================

  function disconnectVoice() {
    cleanup();

    setConnected(false);
    setConnecting(false);
    setListening(false);
    setSpeaking(false);

    isNavigatingRef.current =
      false;
  }

  // ============================================================
  // BUTTON
  // ============================================================

  function handleVoiceButton() {
    setError("");

    if (speaking) {
      stopSpeaking();
      return;
    }

    if (connected) {
      disconnectVoice();
      return;
    }

    startVoice();
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <>
      <button
        type="button"
        onClick={
          handleVoiceButton
        }
        disabled={connecting}
        aria-label={
          connecting
            ? "Connecting"
            : speaking
            ? "Stop speaking"
            : connected
            ? "Turn voice off"
            : "Turn voice on"
        }
        className={`
          fixed
          bottom-6
          right-6
          z-[9999]
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          text-3xl
          shadow-2xl
          transition-all
          duration-200
          ${
            speaking
              ? "bg-green-500 text-white shadow-green-500/50 ring-4 ring-green-200"
              : listening
              ? "animate-pulse bg-orange-500 text-white shadow-orange-500/40 ring-4 ring-orange-200"
              : connecting
              ? "cursor-wait bg-indigo-600 text-white"
              : connected
              ? "bg-orange-500 text-white hover:scale-110 hover:bg-orange-600 shadow-orange-500/40"
              : "bg-orange-500 text-white hover:scale-110 hover:bg-orange-600"
          }
        `}
      >
        {connecting
          ? "..."
          : speaking
          ? "🔊"
          : listening
          ? "🎤"
          : connected
          ? "⏹"
          : "🎤"}
      </button>

      {connecting && (
        <div className="fixed bottom-24 right-6 z-[9998] rounded-full bg-white px-4 py-2 text-sm font-bold text-indigo-600 shadow-xl">
          Connecting...
        </div>
      )}

      {connected &&
        listening &&
        !speaking && (
          <div className="fixed bottom-24 right-6 z-[9998] rounded-full bg-white px-4 py-2 text-sm font-bold text-orange-500 shadow-xl">
            🎤 I'm listening
          </div>
        )}

      {connected &&
        speaking && (
          <div className="fixed bottom-24 right-6 z-[9998] rounded-full bg-white px-4 py-2 text-sm font-bold text-green-600 shadow-xl">
            🔊 I'm here with you
          </div>
        )}

      {connected &&
        !listening &&
        !speaking && (
          <div className="fixed bottom-24 right-6 z-[9998] rounded-full bg-white px-4 py-2 text-sm font-bold text-orange-500 shadow-xl">
            🎤 I'm here whenever you need me
          </div>
        )}

      {error && (
        <div className="fixed bottom-24 right-6 z-[9998] max-w-xs rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 shadow-xl">
          {error}
        </div>
      )}
    </>
  );
}