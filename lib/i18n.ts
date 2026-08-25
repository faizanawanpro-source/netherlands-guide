export const languages = {
  en: "English",
  nl: "Nederlands",
  uk: "Українська",
  ur: "اردو",
  ar: "العربية",
  tr: "Türkçe",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  pl: "Polski",
  ro: "Română",
  ru: "Русский",
} as const;

export type Language = keyof typeof languages;

export const translations: Record<
  Language,
  Record<string, string>
> = {
  en: {
    personalisedAssistant: "Your personalised Netherlands assistant",
    editProfile: "Edit profile",
    personalised: "Personalised",
    yourGuide: "Your guide",
    dashboardChanges:
      "Your dashboard changes based on the information you gave us.",

    recommendedForYou: "Recommended for you",
    mostUsefulTools: "Your most useful tools",
    selectedBasedOnProfile:
      "These tools are selected based on your profile.",

    smartTools: "Smart tools",
    getHelpInstantly: "Get help instantly",
    useAI: "Use AI and practical tools when you need help.",

    askAI: "Ask AI",
    askAIButton: "Ask Netherlands Guide →",
    askAIDescription:
      "Ask questions about the Netherlands and get explanations based on your situation.",

    scanLetter: "Scan a Letter",
    scanLetterDescription:
      "Take a photo of a Dutch letter and get help understanding what it says.",
    openScanner: "Open document scanner →",

    voiceAssistant: "Voice Assistant",
    voiceDescription:
      "Speak naturally and get help using your voice.",
    talkToGuide: "Talk to Netherlands Guide →",

    yourProfile: "Your profile",
    profileDescription:
      "Your guide uses these details to personalise your experience.",

    name: "Name",
    profile: "Profile",
    location: "Location",
    language: "Language",
    notSet: "Not set",

    family: "Family",
    familyInNetherlands: "Family in the Netherlands",
    noFamilyInNetherlands: "No family in the Netherlands",

    documentsServices: "Documents & services",
    selected: "selected",
    noneSelected: "None selected",

    emergency: "Emergency?",
    emergencyDescription:
      "If someone is in immediate danger or there is a serious emergency, call 112.",
    call112: "🚨 Call 112",

    explore: "Explore",
    planMyTrip: "Plan my trip →",
    touristMode: "Tourist mode",
    readyToExplore: "Ready to explore?",
    tripPlannerDescription:
      "Use the trip planner to build your itinerary.",

    footer: "Your personalised guide to the Netherlands",

    refugee: "Refugee / newcomer",
    student: "International student",
    tourist: "Tourist",
    resident: "Resident / immigrant",
    dutch: "Dutch citizen",

    refugeeGreeting:
      "Let's make life in the Netherlands easier.",
    refugeeSubtitle:
      "Your guide to settling into everyday life in the Netherlands.",

    studentGreeting:
      "Let's make student life easier.",
    studentSubtitle:
      "Your guide to studying, working and living in the Netherlands.",

    touristGreeting:
      "Let's make your Netherlands trip amazing.",
    touristSubtitle:
      "Your personal travel guide to exploring the Netherlands.",

    residentGreeting:
      "Everything you need for life in the Netherlands.",
    residentSubtitle:
      "Your personal guide to everyday life in the Netherlands.",

    dutchGreeting:
      "Welcome to your Netherlands Guide.",
    dutchSubtitle:
      "Useful tools and information for everyday life in the Netherlands.",
  },

  nl: {
    personalisedAssistant:
      "Jouw persoonlijke assistent voor Nederland",
    editProfile: "Profiel bewerken",
    personalised: "Gepersonaliseerd",
    yourGuide: "Jouw gids",
    dashboardChanges:
      "Je dashboard wordt aangepast op basis van de informatie die je hebt gegeven.",

    recommendedForYou: "Aanbevolen voor jou",
    mostUsefulTools: "Jouw handigste tools",
    selectedBasedOnProfile:
      "Deze tools zijn geselecteerd op basis van jouw profiel.",

    smartTools: "Slimme tools",
    getHelpInstantly: "Krijg direct hulp",
    useAI:
      "Gebruik AI en praktische tools wanneer je hulp nodig hebt.",

    askAI: "Vraag AI",
    askAIButton: "Vraag Netherlands Guide →",
    askAIDescription:
      "Stel vragen over Nederland en krijg uitleg die past bij jouw situatie.",

    scanLetter: "Brief scannen",
    scanLetterDescription:
      "Maak een foto van een Nederlandse brief en krijg hulp om deze te begrijpen.",
    openScanner: "Documentscanner openen →",

    voiceAssistant: "Spraakassistent",
    voiceDescription:
      "Praat op een natuurlijke manier en krijg hulp met je stem.",
    talkToGuide: "Praat met Netherlands Guide →",

    yourProfile: "Jouw profiel",
    profileDescription:
      "Je gids gebruikt deze gegevens om je ervaring te personaliseren.",

    name: "Naam",
    profile: "Profiel",
    location: "Locatie",
    language: "Taal",
    notSet: "Niet ingesteld",

    family: "Familie",
    familyInNetherlands: "Familie in Nederland",
    noFamilyInNetherlands: "Geen familie in Nederland",

    documentsServices: "Documenten & diensten",
    selected: "geselecteerd",
    noneSelected: "Geen geselecteerd",

    emergency: "Noodgeval?",
    emergencyDescription:
      "Als iemand direct gevaar loopt of er sprake is van een ernstig noodgeval, bel 112.",
    call112: "🚨 Bel 112",

    explore: "Ontdekken",
    planMyTrip: "Plan mijn reis →",
    touristMode: "Toeristenmodus",
    readyToExplore: "Klaar om te ontdekken?",
    tripPlannerDescription:
      "Gebruik de reisplanner om je programma te maken.",

    footer: "Jouw persoonlijke gids voor Nederland",

    refugee: "Vluchteling / nieuwkomer",
    student: "Internationale student",
    tourist: "Toerist",
    resident: "Inwoner / immigrant",
    dutch: "Nederlandse burger",

    refugeeGreeting:
      "Laten we het leven in Nederland makkelijker maken.",
    refugeeSubtitle:
      "Jouw gids om je dagelijks leven in Nederland op te bouwen.",

    studentGreeting:
      "Laten we het studentenleven makkelijker maken.",
    studentSubtitle:
      "Jouw gids voor studeren, werken en wonen in Nederland.",

    touristGreeting:
      "Laten we jouw reis door Nederland geweldig maken.",
    touristSubtitle:
      "Jouw persoonlijke reisgids voor Nederland.",

    residentGreeting:
      "Alles wat je nodig hebt voor het leven in Nederland.",
    residentSubtitle:
      "Jouw persoonlijke gids voor het dagelijks leven in Nederland.",

    dutchGreeting:
      "Welkom bij jouw Netherlands Guide.",
    dutchSubtitle:
      "Handige tools en informatie voor het dagelijks leven in Nederland.",
  },

  uk: {
    personalisedAssistant: "Ваш персональний помічник у Нідерландах",
    editProfile: "Редагувати профіль",
    personalised: "Персоналізовано",
    yourGuide: "Ваш гід",
    dashboardChanges:
      "Вашу інформаційну панель змінено відповідно до наданої вами інформації.",
    recommendedForYou: "Рекомендовано для вас",
    mostUsefulTools: "Найкорисніші інструменти",
    selectedBasedOnProfile:
      "Ці інструменти підібрані відповідно до вашого профілю.",
    smartTools: "Розумні інструменти",
    getHelpInstantly: "Отримайте допомогу миттєво",
    useAI:
      "Використовуйте ШІ та практичні інструменти, коли вам потрібна допомога.",
    askAI: "Запитати ШІ",
    askAIButton: "Запитати Netherlands Guide →",
    askAIDescription:
      "Ставте запитання про Нідерланди та отримуйте пояснення відповідно до вашої ситуації.",
    scanLetter: "Сканувати лист",
    scanLetterDescription:
      "Сфотографуйте нідерландський лист і отримайте допомогу з його розумінням.",
    openScanner: "Відкрити сканер документів →",
    voiceAssistant: "Голосовий помічник",
    voiceDescription:
      "Говоріть природно та отримуйте допомогу голосом.",
    talkToGuide: "Поговорити з Netherlands Guide →",
    yourProfile: "Ваш профіль",
    profileDescription:
      "Ваш гід використовує ці дані для персоналізації вашого досвіду.",
    name: "Ім'я",
    profile: "Профіль",
    location: "Місцезнаходження",
    language: "Мова",
    notSet: "Не встановлено",
    family: "Сім'я",
    familyInNetherlands: "Сім'я в Нідерландах",
    noFamilyInNetherlands: "Немає сім'ї в Нідерландах",
    documentsServices: "Документи та послуги",
    selected: "вибрано",
    noneSelected: "Нічого не вибрано",
    emergency: "Надзвичайна ситуація?",
    emergencyDescription:
      "Якщо хтось перебуває в безпосередній небезпеці або сталася серйозна надзвичайна ситуація, телефонуйте 112.",
    call112: "🚨 Зателефонувати 112",
    explore: "Дослідити",
    planMyTrip: "Спланувати подорож →",
    touristMode: "Режим туриста",
    readyToExplore: "Готові досліджувати?",
    tripPlannerDescription:
      "Використовуйте планувальник подорожей для створення маршруту.",
    footer: "Ваш персональний гід по Нідерландах",
    refugee: "Біженець / новоприбулий",
    student: "Іноземний студент",
    tourist: "Турист",
    resident: "Мешканець / іммігрант",
    dutch: "Громадянин Нідерландів",
    refugeeGreeting: "Зробімо життя в Нідерландах простішим.",
    refugeeSubtitle:
      "Ваш гід для облаштування повсякденного життя в Нідерландах.",
    studentGreeting: "Зробімо студентське життя простішим.",
    studentSubtitle:
      "Ваш гід для навчання, роботи та життя в Нідерландах.",
    touristGreeting:
      "Зробімо вашу подорож Нідерландами незабутньою.",
    touristSubtitle:
      "Ваш персональний туристичний гід по Нідерландах.",
    residentGreeting:
      "Усе необхідне для життя в Нідерландах.",
    residentSubtitle:
      "Ваш персональний гід для повсякденного життя в Нідерландах.",
    dutchGreeting: "Ласкаво просимо до Netherlands Guide.",
    dutchSubtitle:
      "Корисні інструменти та інформація для повсякденного життя в Нідерландах.",
  },

  ur: {
    personalisedAssistant: "نیدرلینڈز کے لیے آپ کا ذاتی معاون",
    editProfile: "پروفائل تبدیل کریں",
    personalised: "آپ کے لیے ذاتی نوعیت کا",
    yourGuide: "آپ کا گائیڈ",
    dashboardChanges:
      "آپ کے ڈیش بورڈ کو آپ کی فراہم کردہ معلومات کے مطابق تبدیل کیا جاتا ہے۔",
    recommendedForYou: "آپ کے لیے تجویز کردہ",
    mostUsefulTools: "آپ کے لیے مفید ترین ٹولز",
    selectedBasedOnProfile:
      "یہ ٹولز آپ کے پروفائل کی بنیاد پر منتخب کیے گئے ہیں۔",
    smartTools: "سمارٹ ٹولز",
    getHelpInstantly: "فوری مدد حاصل کریں",
    useAI:
      "جب بھی ضرورت ہو AI اور عملی ٹولز استعمال کریں۔",
    askAI: "AI سے پوچھیں",
    askAIButton: "Netherlands Guide سے پوچھیں →",
    askAIDescription:
      "نیدرلینڈز کے بارے میں سوالات پوچھیں اور اپنی صورتحال کے مطابق وضاحت حاصل کریں۔",
    scanLetter: "خط اسکین کریں",
    scanLetterDescription:
      "ڈچ خط کی تصویر لیں اور اسے سمجھنے میں مدد حاصل کریں۔",
    openScanner: "دستاویز اسکینر کھولیں →",
    voiceAssistant: "وائس اسسٹنٹ",
    voiceDescription:
      "قدرتی انداز میں بات کریں اور آواز کے ذریعے مدد حاصل کریں۔",
    talkToGuide: "Netherlands Guide سے بات کریں →",
    yourProfile: "آپ کا پروفائل",
    profileDescription:
      "آپ کا گائیڈ ان معلومات کو آپ کے تجربے کو ذاتی بنانے کے لیے استعمال کرتا ہے۔",
    name: "نام",
    profile: "پروفائل",
    location: "مقام",
    language: "زبان",
    notSet: "سیٹ نہیں کیا گیا",
    family: "خاندان",
    familyInNetherlands: "نیدرلینڈز میں خاندان",
    noFamilyInNetherlands: "نیدرلینڈز میں خاندان نہیں",
    documentsServices: "دستاویزات اور خدمات",
    selected: "منتخب",
    noneSelected: "کچھ منتخب نہیں کیا گیا",
    emergency: "ایمرجنسی؟",
    emergencyDescription:
      "اگر کوئی شخص فوری خطرے میں ہے یا کوئی سنگین ایمرجنسی ہے تو 112 پر کال کریں۔",
    call112: "🚨 112 پر کال کریں",
    explore: "دریافت کریں",
    planMyTrip: "میرا سفر پلان کریں →",
    touristMode: "سیاحتی موڈ",
    readyToExplore: "دریافت کے لیے تیار ہیں؟",
    tripPlannerDescription:
      "اپنا سفر بنانے کے لیے ٹرپ پلانر استعمال کریں۔",
    footer: "نیدرلینڈز کے لیے آپ کا ذاتی گائیڈ",
    refugee: "پناہ گزین / نیا آنے والا",
    student: "بین الاقوامی طالب علم",
    tourist: "سیاح",
    resident: "رہائشی / تارک وطن",
    dutch: "ڈچ شہری",
    refugeeGreeting:
      "آئیے نیدرلینڈز میں زندگی کو آسان بنائیں۔",
    refugeeSubtitle:
      "نیدرلینڈز میں روزمرہ زندگی شروع کرنے کے لیے آپ کا گائیڈ۔",
    studentGreeting:
      "آئیے طالب علم کی زندگی کو آسان بنائیں۔",
    studentSubtitle:
      "نیدرلینڈز میں تعلیم، کام اور زندگی کے لیے آپ کا گائیڈ۔",
    touristGreeting:
      "آئیے نیدرلینڈز کا آپ کا سفر شاندار بنائیں۔",
    touristSubtitle:
      "نیدرلینڈز گھومنے کے لیے آپ کا ذاتی ٹریول گائیڈ۔",
    residentGreeting:
      "نیدرلینڈز میں زندگی کے لیے آپ کو درکار سب کچھ۔",
    residentSubtitle:
      "نیدرلینڈز میں روزمرہ زندگی کے لیے آپ کا ذاتی گائیڈ۔",
    dutchGreeting:
      "آپ کے Netherlands Guide میں خوش آمدید۔",
    dutchSubtitle:
      "نیدرلینڈز میں روزمرہ زندگی کے لیے مفید ٹولز اور معلومات۔",
  },

  ar: {
    personalisedAssistant: "مساعدك الشخصي في هولندا",
    editProfile: "تعديل الملف الشخصي",
    personalised: "مخصص لك",
    yourGuide: "دليلك",
    dashboardChanges:
      "تتغير لوحة التحكم الخاصة بك بناءً على المعلومات التي قدمتها.",
    recommendedForYou: "موصى به لك",
    mostUsefulTools: "أهم الأدوات المفيدة لك",
    selectedBasedOnProfile:
      "تم اختيار هذه الأدوات بناءً على ملفك الشخصي.",
    smartTools: "أدوات ذكية",
    getHelpInstantly: "احصل على المساعدة فورًا",
    useAI:
      "استخدم الذكاء الاصطناعي والأدوات العملية عندما تحتاج إلى المساعدة.",
    askAI: "اسأل الذكاء الاصطناعي",
    askAIButton: "اسأل Netherlands Guide →",
    askAIDescription:
      "اطرح أسئلة حول هولندا واحصل على شرح يناسب وضعك.",
    scanLetter: "مسح رسالة",
    scanLetterDescription:
      "التقط صورة لرسالة هولندية واحصل على مساعدة لفهمها.",
    openScanner: "فتح ماسح المستندات →",
    voiceAssistant: "المساعد الصوتي",
    voiceDescription:
      "تحدث بشكل طبيعي واحصل على المساعدة باستخدام صوتك.",
    talkToGuide: "تحدث مع Netherlands Guide →",
    yourProfile: "ملفك الشخصي",
    profileDescription:
      "يستخدم دليلك هذه المعلومات لتخصيص تجربتك.",
    name: "الاسم",
    profile: "الملف الشخصي",
    location: "الموقع",
    language: "اللغة",
    notSet: "غير محدد",
    family: "العائلة",
    familyInNetherlands: "العائلة في هولندا",
    noFamilyInNetherlands: "لا توجد عائلة في هولندا",
    documentsServices: "المستندات والخدمات",
    selected: "محدد",
    noneSelected: "لم يتم تحديد شيء",
    emergency: "حالة طوارئ؟",
    emergencyDescription:
      "إذا كان شخص ما في خطر مباشر أو هناك حالة طوارئ خطيرة، فاتصل بالرقم 112.",
    call112: "🚨 اتصل بـ 112",
    explore: "استكشف",
    planMyTrip: "خطط لرحلتي →",
    touristMode: "وضع السائح",
    readyToExplore: "هل أنت مستعد للاستكشاف؟",
    tripPlannerDescription:
      "استخدم مخطط الرحلة لإنشاء برنامجك.",
    footer: "دليلك الشخصي إلى هولندا",
    refugee: "لاجئ / وافد جديد",
    student: "طالب دولي",
    tourist: "سائح",
    resident: "مقيم / مهاجر",
    dutch: "مواطن هولندي",
    refugeeGreeting: "لنجعل الحياة في هولندا أسهل.",
    refugeeSubtitle:
      "دليلك للاستقرار في الحياة اليومية في هولندا.",
    studentGreeting: "لنجعل حياة الطالب أسهل.",
    studentSubtitle:
      "دليلك للدراسة والعمل والحياة في هولندا.",
    touristGreeting:
      "لنجعل رحلتك في هولندا رائعة.",
    touristSubtitle:
      "دليلك السياحي الشخصي لاستكشاف هولندا.",
    residentGreeting:
      "كل ما تحتاجه للحياة في هولندا.",
    residentSubtitle:
      "دليلك الشخصي للحياة اليومية في هولندا.",
    dutchGreeting:
      "مرحبًا بك في Netherlands Guide.",
    dutchSubtitle:
      "أدوات ومعلومات مفيدة للحياة اليومية في هولندا.",
  },

  tr: {
    personalisedAssistant: "Hollanda için kişisel asistanınız",
    editProfile: "Profili düzenle",
    personalised: "Kişiselleştirilmiş",
    yourGuide: "Rehberiniz",
    dashboardChanges:
      "Kontrol paneliniz verdiğiniz bilgilere göre değişir.",
    recommendedForYou: "Sizin için önerilenler",
    mostUsefulTools: "En kullanışlı araçlarınız",
    selectedBasedOnProfile:
      "Bu araçlar profilinize göre seçildi.",
    smartTools: "Akıllı araçlar",
    getHelpInstantly: "Anında yardım alın",
    useAI:
      "İhtiyacınız olduğunda yapay zekâ ve pratik araçları kullanın.",
    askAI: "Yapay zekâya sor",
    askAIButton: "Netherlands Guide'a sor →",
    askAIDescription:
      "Hollanda hakkında sorular sorun ve durumunuza uygun açıklamalar alın.",
    scanLetter: "Mektup Tara",
    scanLetterDescription:
      "Hollandaca bir mektubun fotoğrafını çekin ve anlamanıza yardımcı olun.",
    openScanner: "Belge tarayıcıyı aç →",
    voiceAssistant: "Sesli Asistan",
    voiceDescription:
      "Doğal bir şekilde konuşun ve sesinizle yardım alın.",
    talkToGuide: "Netherlands Guide ile konuş →",
    yourProfile: "Profiliniz",
    profileDescription:
      "Rehberiniz deneyiminizi kişiselleştirmek için bu bilgileri kullanır.",
    name: "İsim",
    profile: "Profil",
    location: "Konum",
    language: "Dil",
    notSet: "Ayarlanmadı",
    family: "Aile",
    familyInNetherlands: "Hollanda'da aile",
    noFamilyInNetherlands: "Hollanda'da aile yok",
    documentsServices: "Belgeler ve hizmetler",
    selected: "seçildi",
    noneSelected: "Hiçbiri seçilmedi",
    emergency: "Acil durum?",
    emergencyDescription:
      "Birisi acil tehlikedeyse veya ciddi bir acil durum varsa 112'yi arayın.",
    call112: "🚨 112'yi ara",
    explore: "Keşfet",
    planMyTrip: "Gezimi planla →",
    touristMode: "Turist modu",
    readyToExplore: "Keşfetmeye hazır mısınız?",
    tripPlannerDescription:
      "Programınızı oluşturmak için gezi planlayıcıyı kullanın.",
    footer: "Hollanda için kişisel rehberiniz",
    refugee: "Mülteci / yeni gelen",
    student: "Uluslararası öğrenci",
    tourist: "Turist",
    resident: "Yerleşik / göçmen",
    dutch: "Hollanda vatandaşı",
    refugeeGreeting:
      "Hollanda'daki hayatı kolaylaştıralım.",
    refugeeSubtitle:
      "Hollanda'daki günlük hayata yerleşmeniz için rehberiniz.",
    studentGreeting:
      "Öğrenci hayatını kolaylaştıralım.",
    studentSubtitle:
      "Hollanda'da eğitim, çalışma ve yaşam rehberiniz.",
    touristGreeting:
      "Hollanda seyahatinizi harika hale getirelim.",
    touristSubtitle:
      "Hollanda'yı keşfetmek için kişisel seyahat rehberiniz.",
    residentGreeting:
      "Hollanda'da yaşam için ihtiyacınız olan her şey.",
    residentSubtitle:
      "Hollanda'daki günlük yaşam için kişisel rehberiniz.",
    dutchGreeting:
      "Netherlands Guide'a hoş geldiniz.",
    dutchSubtitle:
      "Hollanda'daki günlük yaşam için kullanışlı araçlar ve bilgiler.",
  },

  de: {
    personalisedAssistant: "Dein persönlicher Assistent für die Niederlande",
    editProfile: "Profil bearbeiten",
    personalised: "Personalisiert",
    yourGuide: "Dein Guide",
    dashboardChanges:
      "Dein Dashboard wird anhand deiner Angaben angepasst.",
    recommendedForYou: "Für dich empfohlen",
    mostUsefulTools: "Deine nützlichsten Tools",
    selectedBasedOnProfile:
      "Diese Tools wurden anhand deines Profils ausgewählt.",
    smartTools: "Smarte Tools",
    getHelpInstantly: "Sofort Hilfe bekommen",
    useAI:
      "Nutze KI und praktische Tools, wenn du Hilfe brauchst.",
    askAI: "KI fragen",
    askAIButton: "Netherlands Guide fragen →",
    askAIDescription:
      "Stelle Fragen über die Niederlande und erhalte Erklärungen passend zu deiner Situation.",
    scanLetter: "Brief scannen",
    scanLetterDescription:
      "Fotografiere einen niederländischen Brief und erhalte Hilfe beim Verstehen.",
    openScanner: "Dokumentenscanner öffnen →",
    voiceAssistant: "Sprachassistent",
    voiceDescription:
      "Sprich ganz natürlich und erhalte Hilfe per Sprache.",
    talkToGuide: "Mit Netherlands Guide sprechen →",
    yourProfile: "Dein Profil",
    profileDescription:
      "Dein Guide nutzt diese Angaben, um dein Erlebnis zu personalisieren.",
    name: "Name",
    profile: "Profil",
    location: "Standort",
    language: "Sprache",
    notSet: "Nicht festgelegt",
    family: "Familie",
    familyInNetherlands: "Familie in den Niederlanden",
    noFamilyInNetherlands: "Keine Familie in den Niederlanden",
    documentsServices: "Dokumente & Dienste",
    selected: "ausgewählt",
    noneSelected: "Nichts ausgewählt",
    emergency: "Notfall?",
    emergencyDescription:
      "Wenn jemand unmittelbar in Gefahr ist oder ein schwerer Notfall vorliegt, rufe 112 an.",
    call112: "🚨 112 anrufen",
    explore: "Entdecken",
    planMyTrip: "Meine Reise planen →",
    touristMode: "Touristenmodus",
    readyToExplore: "Bereit zum Entdecken?",
    tripPlannerDescription:
      "Nutze den Reiseplaner, um deine Route zu erstellen.",
    footer: "Dein persönlicher Guide für die Niederlande",
    refugee: "Flüchtling / Neuankömmling",
    student: "Internationaler Student",
    tourist: "Tourist",
    resident: "Einwohner / Einwanderer",
    dutch: "Niederländischer Staatsbürger",
    refugeeGreeting:
      "Machen wir das Leben in den Niederlanden einfacher.",
    refugeeSubtitle:
      "Dein Guide für den Alltag und die Eingewöhnung in den Niederlanden.",
    studentGreeting:
      "Machen wir das Studentenleben einfacher.",
    studentSubtitle:
      "Dein Guide für Studium, Arbeit und Leben in den Niederlanden.",
    touristGreeting:
      "Machen wir deine Reise durch die Niederlande großartig.",
    touristSubtitle:
      "Dein persönlicher Reiseführer für die Niederlande.",
    residentGreeting:
      "Alles, was du für das Leben in den Niederlanden brauchst.",
    residentSubtitle:
      "Dein persönlicher Guide für den Alltag in den Niederlanden.",
    dutchGreeting:
      "Willkommen bei Netherlands Guide.",
    dutchSubtitle:
      "Nützliche Tools und Informationen für den Alltag in den Niederlanden.",
  },

  fr: {
    personalisedAssistant: "Votre assistant personnalisé pour les Pays-Bas",
    editProfile: "Modifier le profil",
    personalised: "Personnalisé",
    yourGuide: "Votre guide",
    dashboardChanges:
      "Votre tableau de bord s'adapte aux informations que vous avez fournies.",
    recommendedForYou: "Recommandé pour vous",
    mostUsefulTools: "Vos outils les plus utiles",
    selectedBasedOnProfile:
      "Ces outils sont sélectionnés selon votre profil.",
    smartTools: "Outils intelligents",
    getHelpInstantly: "Obtenez de l'aide instantanément",
    useAI:
      "Utilisez l'IA et des outils pratiques lorsque vous avez besoin d'aide.",
    askAI: "Demander à l'IA",
    askAIButton: "Demander à Netherlands Guide →",
    askAIDescription:
      "Posez des questions sur les Pays-Bas et obtenez des explications adaptées à votre situation.",
    scanLetter: "Scanner une lettre",
    scanLetterDescription:
      "Prenez une photo d'une lettre néerlandaise et obtenez de l'aide pour la comprendre.",
    openScanner: "Ouvrir le scanner →",
    voiceAssistant: "Assistant vocal",
    voiceDescription:
      "Parlez naturellement et obtenez de l'aide avec votre voix.",
    talkToGuide: "Parler à Netherlands Guide →",
    yourProfile: "Votre profil",
    profileDescription:
      "Votre guide utilise ces informations pour personnaliser votre expérience.",
    name: "Nom",
    profile: "Profil",
    location: "Lieu",
    language: "Langue",
    notSet: "Non défini",
    family: "Famille",
    familyInNetherlands: "Famille aux Pays-Bas",
    noFamilyInNetherlands: "Pas de famille aux Pays-Bas",
    documentsServices: "Documents et services",
    selected: "sélectionné",
    noneSelected: "Aucun sélectionné",
    emergency: "Urgence ?",
    emergencyDescription:
      "Si quelqu'un est en danger immédiat ou en cas d'urgence grave, appelez le 112.",
    call112: "🚨 Appeler le 112",
    explore: "Explorer",
    planMyTrip: "Planifier mon voyage →",
    touristMode: "Mode touriste",
    readyToExplore: "Prêt à explorer ?",
    tripPlannerDescription:
      "Utilisez le planificateur pour créer votre itinéraire.",
    footer: "Votre guide personnalisé des Pays-Bas",
    refugee: "Réfugié / nouvel arrivant",
    student: "Étudiant international",
    tourist: "Touriste",
    resident: "Résident / immigrant",
    dutch: "Citoyen néerlandais",
    refugeeGreeting:
      "Rendons la vie aux Pays-Bas plus facile.",
    refugeeSubtitle:
      "Votre guide pour vous installer dans la vie quotidienne aux Pays-Bas.",
    studentGreeting:
      "Rendons la vie étudiante plus facile.",
    studentSubtitle:
      "Votre guide pour étudier, travailler et vivre aux Pays-Bas.",
    touristGreeting:
      "Rendons votre voyage aux Pays-Bas incroyable.",
    touristSubtitle:
      "Votre guide touristique personnel des Pays-Bas.",
    residentGreeting:
      "Tout ce dont vous avez besoin pour vivre aux Pays-Bas.",
    residentSubtitle:
      "Votre guide personnel pour la vie quotidienne aux Pays-Bas.",
    dutchGreeting:
      "Bienvenue sur Netherlands Guide.",
    dutchSubtitle:
      "Des outils et informations utiles pour la vie quotidienne aux Pays-Bas.",
  },

  es: {
    personalisedAssistant: "Tu asistente personalizado para los Países Bajos",
    editProfile: "Editar perfil",
    personalised: "Personalizado",
    yourGuide: "Tu guía",
    dashboardChanges:
      "Tu panel cambia según la información que nos hayas proporcionado.",
    recommendedForYou: "Recomendado para ti",
    mostUsefulTools: "Tus herramientas más útiles",
    selectedBasedOnProfile:
      "Estas herramientas se seleccionan según tu perfil.",
    smartTools: "Herramientas inteligentes",
    getHelpInstantly: "Obtén ayuda al instante",
    useAI:
      "Usa la IA y herramientas prácticas cuando necesites ayuda.",
    askAI: "Preguntar a la IA",
    askAIButton: "Preguntar a Netherlands Guide →",
    askAIDescription:
      "Haz preguntas sobre los Países Bajos y recibe explicaciones según tu situación.",
    scanLetter: "Escanear una carta",
    scanLetterDescription:
      "Haz una foto de una carta neerlandesa y recibe ayuda para entenderla.",
    openScanner: "Abrir escáner →",
    voiceAssistant: "Asistente de voz",
    voiceDescription:
      "Habla de forma natural y recibe ayuda mediante tu voz.",
    talkToGuide: "Hablar con Netherlands Guide →",
    yourProfile: "Tu perfil",
    profileDescription:
      "Tu guía utiliza estos datos para personalizar tu experiencia.",
    name: "Nombre",
    profile: "Perfil",
    location: "Ubicación",
    language: "Idioma",
    notSet: "No establecido",
    family: "Familia",
    familyInNetherlands: "Familia en los Países Bajos",
    noFamilyInNetherlands: "No hay familia en los Países Bajos",
    documentsServices: "Documentos y servicios",
    selected: "seleccionado",
    noneSelected: "Ninguno seleccionado",
    emergency: "¿Emergencia?",
    emergencyDescription:
      "Si alguien está en peligro inmediato o hay una emergencia grave, llama al 112.",
    call112: "🚨 Llamar al 112",
    explore: "Explorar",
    planMyTrip: "Planificar mi viaje →",
    touristMode: "Modo turista",
    readyToExplore: "¿Listo para explorar?",
    tripPlannerDescription:
      "Usa el planificador de viajes para crear tu itinerario.",
    footer: "Tu guía personalizada de los Países Bajos",
    refugee: "Refugiado / recién llegado",
    student: "Estudiante internacional",
    tourist: "Turista",
    resident: "Residente / inmigrante",
    dutch: "Ciudadano neerlandés",
    refugeeGreeting:
      "Hagamos que la vida en los Países Bajos sea más fácil.",
    refugeeSubtitle:
      "Tu guía para instalarte en la vida cotidiana de los Países Bajos.",
    studentGreeting:
      "Hagamos que la vida estudiantil sea más fácil.",
    studentSubtitle:
      "Tu guía para estudiar, trabajar y vivir en los Países Bajos.",
    touristGreeting:
      "Hagamos que tu viaje por los Países Bajos sea increíble.",
    touristSubtitle:
      "Tu guía de viaje personal para explorar los Países Bajos.",
    residentGreeting:
      "Todo lo que necesitas para vivir en los Países Bajos.",
    residentSubtitle:
      "Tu guía personal para la vida cotidiana en los Países Bajos.",
    dutchGreeting:
      "Bienvenido a Netherlands Guide.",
    dutchSubtitle:
      "Herramientas e información útiles para la vida cotidiana en los Países Bajos.",
  },

  pl: {
    personalisedAssistant: "Twój spersonalizowany asystent w Holandii",
    editProfile: "Edytuj profil",
    personalised: "Spersonalizowane",
    yourGuide: "Twój przewodnik",
    dashboardChanges:
      "Panel zmienia się na podstawie podanych przez Ciebie informacji.",
    recommendedForYou: "Polecane dla Ciebie",
    mostUsefulTools: "Najbardziej przydatne narzędzia",
    selectedBasedOnProfile:
      "Te narzędzia zostały wybrane na podstawie Twojego profilu.",
    smartTools: "Inteligentne narzędzia",
    getHelpInstantly: "Uzyskaj pomoc od razu",
    useAI:
      "Korzystaj z AI i praktycznych narzędzi, gdy potrzebujesz pomocy.",
    askAI: "Zapytaj AI",
    askAIButton: "Zapytaj Netherlands Guide →",
    askAIDescription:
      "Zadawaj pytania dotyczące Holandii i otrzymuj wyjaśnienia dopasowane do Twojej sytuacji.",
    scanLetter: "Skanuj list",
    scanLetterDescription:
      "Zrób zdjęcie holenderskiego listu i uzyskaj pomoc w jego zrozumieniu.",
    openScanner: "Otwórz skaner dokumentów →",
    voiceAssistant: "Asystent głosowy",
    voiceDescription:
      "Mów naturalnie i uzyskaj pomoc za pomocą głosu.",
    talkToGuide: "Porozmawiaj z Netherlands Guide →",
    yourProfile: "Twój profil",
    profileDescription:
      "Twój przewodnik wykorzystuje te informacje, aby spersonalizować Twoje doświadczenie.",
    name: "Imię",
    profile: "Profil",
    location: "Lokalizacja",
    language: "Język",
    notSet: "Nie ustawiono",
    family: "Rodzina",
    familyInNetherlands: "Rodzina w Holandii",
    noFamilyInNetherlands: "Brak rodziny w Holandii",
    documentsServices: "Dokumenty i usługi",
    selected: "wybrano",
    noneSelected: "Nic nie wybrano",
    emergency: "Nagły wypadek?",
    emergencyDescription:
      "Jeśli ktoś jest w bezpośrednim niebezpieczeństwie lub wystąpił poważny wypadek, zadzwoń pod 112.",
    call112: "🚨 Zadzwoń pod 112",
    explore: "Odkrywaj",
    planMyTrip: "Zaplanuj moją podróż →",
    touristMode: "Tryb turystyczny",
    readyToExplore: "Gotowy na odkrywanie?",
    tripPlannerDescription:
      "Użyj planera podróży, aby stworzyć swój plan.",
    footer: "Twój spersonalizowany przewodnik po Holandii",
    refugee: "Uchodźca / nowo przybyły",
    student: "Student międzynarodowy",
    tourist: "Turysta",
    resident: "Mieszkaniec / imigrant",
    dutch: "Obywatel Holandii",
    refugeeGreeting:
      "Sprawmy, aby życie w Holandii było łatwiejsze.",
    refugeeSubtitle:
      "Twój przewodnik po codziennym życiu w Holandii.",
    studentGreeting:
      "Sprawmy, aby życie studenckie było łatwiejsze.",
    studentSubtitle:
      "Twój przewodnik po nauce, pracy i życiu w Holandii.",
    touristGreeting:
      "Sprawmy, aby Twoja podróż po Holandii była niesamowita.",
    touristSubtitle:
      "Twój osobisty przewodnik po Holandii.",
    residentGreeting:
      "Wszystko, czego potrzebujesz do życia w Holandii.",
    residentSubtitle:
      "Twój osobisty przewodnik po codziennym życiu w Holandii.",
    dutchGreeting:
      "Witamy w Netherlands Guide.",
    dutchSubtitle:
      "Przydatne narzędzia i informacje dotyczące codziennego życia w Holandii.",
  },

  ro: {
    personalisedAssistant: "Asistentul tău personal pentru Țările de Jos",
    editProfile: "Editează profilul",
    personalised: "Personalizat",
    yourGuide: "Ghidul tău",
    dashboardChanges:
      "Panoul tău se schimbă pe baza informațiilor pe care le-ai oferit.",
    recommendedForYou: "Recomandat pentru tine",
    mostUsefulTools: "Cele mai utile instrumente",
    selectedBasedOnProfile:
      "Aceste instrumente au fost selectate pe baza profilului tău.",
    smartTools: "Instrumente inteligente",
    getHelpInstantly: "Primește ajutor instantaneu",
    useAI:
      "Folosește AI și instrumente practice atunci când ai nevoie de ajutor.",
    askAI: "Întreabă AI",
    askAIButton: "Întreabă Netherlands Guide →",
    askAIDescription:
      "Pune întrebări despre Țările de Jos și primește explicații potrivite situației tale.",
    scanLetter: "Scanează o scrisoare",
    scanLetterDescription:
      "Fă o fotografie a unei scrisori olandeze și primește ajutor pentru a o înțelege.",
    openScanner: "Deschide scanerul →",
    voiceAssistant: "Asistent vocal",
    voiceDescription:
      "Vorbește natural și primește ajutor folosind vocea.",
    talkToGuide: "Vorbește cu Netherlands Guide →",
    yourProfile: "Profilul tău",
    profileDescription:
      "Ghidul tău folosește aceste informații pentru a personaliza experiența.",
    name: "Nume",
    profile: "Profil",
    location: "Locație",
    language: "Limbă",
    notSet: "Nu este setat",
    family: "Familie",
    familyInNetherlands: "Familie în Țările de Jos",
    noFamilyInNetherlands: "Nu ai familie în Țările de Jos",
    documentsServices: "Documente și servicii",
    selected: "selectat",
    noneSelected: "Nimic selectat",
    emergency: "Urgență?",
    emergencyDescription:
      "Dacă cineva este în pericol imediat sau există o urgență gravă, sună la 112.",
    call112: "🚨 Sună la 112",
    explore: "Explorează",
    planMyTrip: "Planifică-mi călătoria →",
    touristMode: "Mod turist",
    readyToExplore: "Gata de explorat?",
    tripPlannerDescription:
      "Folosește planificatorul pentru a-ți crea itinerariul.",
    footer: "Ghidul tău personal pentru Țările de Jos",
    refugee: "Refugiat / nou-venit",
    student: "Student internațional",
    tourist: "Turist",
    resident: "Rezident / imigrant",
    dutch: "Cetățean olandez",
    refugeeGreeting:
      "Hai să facem viața în Țările de Jos mai ușoară.",
    refugeeSubtitle:
      "Ghidul tău pentru stabilirea în viața de zi cu zi din Țările de Jos.",
    studentGreeting:
      "Hai să facem viața de student mai ușoară.",
    studentSubtitle:
      "Ghidul tău pentru studiu, muncă și viață în Țările de Jos.",
    touristGreeting:
      "Hai să facem călătoria ta în Țările de Jos minunată.",
    touristSubtitle:
      "Ghidul tău personal pentru explorarea Țărilor de Jos.",
    residentGreeting:
      "Tot ce ai nevoie pentru viața în Țările de Jos.",
    residentSubtitle:
      "Ghidul tău personal pentru viața de zi cu zi în Țările de Jos.",
    dutchGreeting:
      "Bine ai venit la Netherlands Guide.",
    dutchSubtitle:
      "Instrumente și informații utile pentru viața de zi cu zi în Țările de Jos.",
  },

  ru: {
    personalisedAssistant: "Ваш персональный помощник в Нидерландах",
    editProfile: "Изменить профиль",
    personalised: "Персонализировано",
    yourGuide: "Ваш гид",
    dashboardChanges:
      "Ваша панель изменяется на основе предоставленной вами информации.",
    recommendedForYou: "Рекомендовано для вас",
    mostUsefulTools: "Ваши самые полезные инструменты",
    selectedBasedOnProfile:
      "Эти инструменты выбраны на основе вашего профиля.",
    smartTools: "Умные инструменты",
    getHelpInstantly: "Получите помощь мгновенно",
    useAI:
      "Используйте ИИ и практические инструменты, когда вам нужна помощь.",
    askAI: "Спросить ИИ",
    askAIButton: "Спросить Netherlands Guide →",
    askAIDescription:
      "Задавайте вопросы о Нидерландах и получайте объяснения с учетом вашей ситуации.",
    scanLetter: "Сканировать письмо",
    scanLetterDescription:
      "Сфотографируйте письмо на нидерландском и получите помощь с его пониманием.",
    openScanner: "Открыть сканер документов →",
    voiceAssistant: "Голосовой помощник",
    voiceDescription:
      "Говорите естественно и получайте помощь с помощью голоса.",
    talkToGuide: "Поговорить с Netherlands Guide →",
    yourProfile: "Ваш профиль",
    profileDescription:
      "Ваш гид использует эти данные для персонализации вашего опыта.",
    name: "Имя",
    profile: "Профиль",
    location: "Местоположение",
    language: "Язык",
    notSet: "Не указано",
    family: "Семья",
    familyInNetherlands: "Семья в Нидерландах",
    noFamilyInNetherlands: "Нет семьи в Нидерландах",
    documentsServices: "Документы и услуги",
    selected: "выбрано",
    noneSelected: "Ничего не выбрано",
    emergency: "Чрезвычайная ситуация?",
    emergencyDescription:
      "Если кто-то находится в непосредственной опасности или произошла серьезная чрезвычайная ситуация, звоните 112.",
    call112: "🚨 Позвонить 112",
    explore: "Исследовать",
    planMyTrip: "Спланировать поездку →",
    touristMode: "Режим туриста",
    readyToExplore: "Готовы исследовать?",
    tripPlannerDescription:
      "Используйте планировщик поездки для создания маршрута.",
    footer: "Ваш персональный гид по Нидерландам",
    refugee: "Беженец / новоприбывший",
    student: "Иностранный студент",
    tourist: "Турист",
    resident: "Житель / иммигрант",
    dutch: "Гражданин Нидерландов",
    refugeeGreeting:
      "Давайте сделаем жизнь в Нидерландах проще.",
    refugeeSubtitle:
      "Ваш гид по обустройству повседневной жизни в Нидерландах.",
    studentGreeting:
      "Давайте сделаем студенческую жизнь проще.",
    studentSubtitle:
      "Ваш гид по учебе, работе и жизни в Нидерландах.",
    touristGreeting:
      "Давайте сделаем вашу поездку по Нидерландам потрясающей.",
    touristSubtitle:
      "Ваш персональный туристический гид по Нидерландам.",
    residentGreeting:
      "Всё необходимое для жизни в Нидерландах.",
    residentSubtitle:
      "Ваш персональный гид по повседневной жизни в Нидерландах.",
    dutchGreeting:
      "Добро пожаловать в Netherlands Guide.",
    dutchSubtitle:
      "Полезные инструменты и информация для повседневной жизни в Нидерландах.",
  },
};

export function getTranslation(
  language: Language,
  key: string
): string {
  return (
    translations[language]?.[key] ??
    translations.en[key] ??
    key
  );
}