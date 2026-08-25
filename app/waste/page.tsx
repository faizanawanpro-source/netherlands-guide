"use client";

import Link from "next/link";

const wasteTypes = [
  {
    title: "General Waste",
    subtitle: "Restafval",
    color: "bg-slate-50 border-slate-200",
    description:
      "Waste that cannot be separated into another recycling category usually goes into the general waste bin.",
    examples: [
      "Dirty tissues",
      "Used nappies",
      "Dirty packaging",
      "Small items that cannot be recycled",
      "Other non-recyclable household waste",
    ],
    photo: "/waste/restafval.jpg",
  },
  {
    title: "Organic Waste",
    subtitle: "GFT",
    color: "bg-green-50 border-green-200",
    description:
      "GFT stands for Groente-, Fruit- en Tuinafval. It is used for organic kitchen and garden waste.",
    examples: [
      "Fruit and vegetable leftovers",
      "Food scraps",
      "Coffee grounds",
      "Tea bags",
      "Garden waste",
      "Small branches and leaves",
    ],
    photo: "/waste/gft.jpg",
  },
  {
    title: "Paper & Cardboard",
    subtitle: "Papier en karton",
    color: "bg-blue-50 border-blue-200",
    description:
      "Clean and dry paper and cardboard can usually be recycled separately.",
    examples: [
      "Newspapers",
      "Magazines",
      "Cardboard boxes",
      "Paper packaging",
      "Letters",
      "Clean paper bags",
    ],
    photo: "/waste/papier.jpg",
  },
  {
    title: "Glass",
    subtitle: "Glas",
    color: "bg-cyan-50 border-cyan-200",
    description:
      "Glass bottles and jars can often be taken to a glasbak.",
    examples: [
      "Glass food jars",
      "Glass bottles",
      "Empty glass packaging",
      "Jam jars",
      "Sauce jars",
    ],
    photo: "/waste/glas.jpg",
  },
  {
    title: "Plastic & Packaging",
    subtitle: "Plastic verpakkingen",
    color: "bg-orange-50 border-orange-200",
    description:
      "Plastic packaging and other packaging waste may be collected separately depending on your municipality.",
    examples: [
      "Plastic bottles",
      "Plastic containers",
      "Plastic food packaging",
      "Plastic trays",
      "Empty packaging",
    ],
    photo: "/waste/plastic.jpg",
  },
  {
    title: "Textiles",
    subtitle: "Textiel",
    color: "bg-purple-50 border-purple-200",
    description:
      "Old clothes and textiles can often be placed in special textile collection containers.",
    examples: [
      "Old clothes",
      "Shoes",
      "Jackets",
      "Towels",
      "Bedsheets",
      "Other reusable textiles",
    ],
    photo: "/waste/textiel.jpg",
  },
  {
    title: "Batteries",
    subtitle: "Batterijen",
    color: "bg-yellow-50 border-yellow-200",
    description:
      "Do not put batteries in normal household waste. Take them to a battery collection point.",
    examples: [
      "AA batteries",
      "AAA batteries",
      "Rechargeable batteries",
      "Small household batteries",
      "Batteries from small electronics",
    ],
    photo: "/waste/batterijen.jpg",
  },
  {
    title: "Electrical Items",
    subtitle: "Elektrische apparaten",
    color: "bg-indigo-50 border-indigo-200",
    description:
      "Electrical and electronic equipment should not normally go into ordinary household waste.",
    examples: [
      "Old phones",
      "Chargers",
      "Small electronics",
      "Electrical appliances",
      "Computers",
      "Cables",
    ],
    photo: "/waste/electronics.jpg",
  },
  {
    title: "Chemical / Hazardous Waste",
    subtitle: "KCA",
    color: "bg-red-50 border-red-200",
    description:
      "Some household chemicals and hazardous products require special disposal.",
    examples: [
      "Paint",
      "Certain cleaning chemicals",
      "Chemical products",
      "Some types of batteries",
      "Other hazardous household products",
    ],
    photo: "/waste/kca.jpg",
  },
];

const importantPlaces = [
  {
    title: "Statiegeld",
    description:
      "Statiegeld means you pay a deposit when buying certain drinks. When you return eligible packaging, you can get the deposit back.",
    examples: [
      "Plastic bottles with statiegeld",
      "Cans with statiegeld",
      "Larger deposit bottles",
    ],
    photo: "/waste/statiegeld.jpg",
  },
  {
    title: "Glasbak",
    description:
      "A glasbak is a special container for glass packaging.",
    examples: [
      "Glass bottles",
      "Glass jars",
      "Empty glass food packaging",
    ],
    photo: "/waste/glasbak.jpg",
  },
  {
    title: "Textielcontainer",
    description:
      "A textile container is used for unwanted clothes, shoes and other textiles.",
    examples: [
      "Clothes",
      "Shoes",
      "Towels",
      "Bedding",
    ],
    photo: "/waste/textielcontainer.jpg",
  },
  {
    title: "Milieustraat",
    description:
      "A milieustraat is a municipal recycling centre where residents can bring different types of household waste.",
    examples: [
      "Large household waste",
      "Electrical equipment",
      "Wood",
      "Metal",
      "Garden waste",
      "Other special waste",
    ],
    photo: "/waste/milieustraat.jpg",
  },
];

const beginnerRules = [
  "Do not put batteries in normal household waste.",
  "Do not put electrical devices in normal household waste.",
  "Keep recyclable materials as clean as possible.",
  "Check your municipality's collection rules.",
  "Use a glasbak for suitable glass packaging.",
  "Use textile containers for suitable old textiles.",
  "Return eligible statiegeld bottles and cans.",
  "Use a milieustraat for special or large household waste.",
  "Never leave rubbish next to a full bin unless your municipality specifically allows it.",
  "When unsure, check your municipality's waste guide before throwing something away.",
];

export default function WastePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-4 sm:px-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-orange-50 hover:text-orange-700"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">

        {/* HERO */}

        <section className="overflow-hidden rounded-[2rem] bg-white shadow-xl">

          <div className="bg-gradient-to-br from-green-600 to-emerald-500 p-7 text-white sm:p-10">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-100">
              Everyday life in the Netherlands
            </p>

            <h1 className="mt-3 text-3xl font-black sm:text-5xl">
              Waste & Recycling
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-green-50 sm:text-lg">
              Learn where to put your waste, how recycling works,
              what statiegeld means, and where you can take special
              waste in the Netherlands.
            </p>

          </div>

        </section>

        {/* IMPORTANT */}

        <section className="mt-6 rounded-[2rem] border-2 border-green-200 bg-green-50 p-6">

          <div className="flex gap-4">

            <div className="text-4xl">
              !
            </div>

            <div>

              <h2 className="text-xl font-black text-green-900">
                Important: rules can differ by municipality
              </h2>

              <p className="mt-2 text-sm leading-6 text-green-800">
                Dutch municipalities can have different collection
                systems and collection days. Always check your
                municipality&apos;s waste information for the exact rules
                where you live.
              </p>

            </div>

          </div>

        </section>

        {/* WASTE TYPES */}

        <section className="mt-10">

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-600">
            Know your bins
          </p>

          <h2 className="mt-2 text-3xl font-black">
            What goes where?
          </h2>

          <p className="mt-2 text-slate-500">
            Learn the most common waste categories in the Netherlands.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {wasteTypes.map((waste) => (

              <article
                key={waste.title}
                className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${waste.color}`}
              >

                <img
                  src={waste.photo}
                  alt={waste.title}
                  className="h-48 w-full object-cover"
                />

                <div className="p-5">

                  <h3 className="text-xl font-black">
                    {waste.title}
                  </h3>

                  <p className="mt-1 text-sm font-bold text-green-700">
                    {waste.subtitle}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {waste.description}
                  </p>

                  <div className="mt-5">

                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Examples
                    </p>

                    <div className="mt-3 space-y-2">

                      {waste.examples.map((example) => (

                        <div
                          key={example}
                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
                        >
                          <span className="mr-2 text-green-600">✓</span>
                          {example}
                        </div>

                      ))}

                    </div>

                  </div>

                </div>

              </article>

            ))}

          </div>

        </section>

        {/* STATIEGELD */}

        <section className="mt-10 overflow-hidden rounded-[2rem] border-2 border-yellow-200 bg-yellow-50">

          <img
            src="/waste/statiegeld.jpg"
            alt="Statiegeld bottles and cans"
            className="h-64 w-full object-cover sm:h-72"
          />

          <div className="p-7 sm:p-9">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-yellow-700">
              Very important
            </p>

            <h2 className="mt-2 text-3xl font-black text-yellow-950">
              Statiegeld
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-yellow-900">
              Statiegeld means you pay a deposit when buying certain
              drinks. When you return eligible bottles or cans at a
              collection point, you can get the deposit back.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-2xl font-black text-yellow-600">
                  01
                </p>

                <p className="mt-2 font-bold">
                  Check the packaging
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Look for the deposit symbol.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-2xl font-black text-yellow-600">
                  02
                </p>

                <p className="mt-2 font-bold">
                  Find a return machine
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Often available in supermarkets.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-2xl font-black text-yellow-600">
                  03
                </p>

                <p className="mt-2 font-bold">
                  Get your deposit back
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Follow the machine&apos;s instructions.
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* IMPORTANT PLACES */}

        <section className="mt-10">

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-600">
            Places you should know
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Where can I take my waste?
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            {importantPlaces.map((place) => (

              <article
                key={place.title}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >

                <img
                  src={place.photo}
                  alt={place.title}
                  className="h-52 w-full object-cover"
                />

                <div className="p-6">

                  <h3 className="text-2xl font-black">
                    {place.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {place.description}
                  </p>

                  <div className="mt-5 space-y-2">

                    {place.examples.map((example) => (

                      <div
                        key={example}
                        className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700"
                      >
                        <span className="mr-2 text-green-600">✓</span>
                        {example}
                      </div>

                    ))}

                  </div>

                </div>

              </article>

            ))}

          </div>

        </section>

        {/* WASTE COLLECTION APPS */}

        <section className="mt-10 rounded-[2rem] border border-purple-200 bg-purple-50 p-7 sm:p-9">

          <div className="flex gap-4">

            <div className="text-4xl font-black text-purple-600">
              APP
            </div>

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.18em] text-purple-600">
                Helpful technology
              </p>

              <h2 className="mt-2 text-3xl font-black text-purple-950">
                Waste collection apps
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-purple-900">
                Many Dutch municipalities provide a waste app or
                online waste calendar. These tools can tell you
                which waste is collected, on which day, and sometimes
                where the nearest collection point is.
              </p>

            </div>

          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <p className="text-3xl font-black text-purple-600">
                01
              </p>

              <h3 className="mt-3 font-black">
                Check collection days
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Find out when you should put your bin or waste outside.
              </p>

            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <p className="text-3xl font-black text-purple-600">
                02
              </p>

              <h3 className="mt-3 font-black">
                Search for an item
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Some waste apps let you search for an item and see
                which category it belongs to.
              </p>

            </div>

          </div>

        </section>

        {/* BEGINNER RULES */}

        <section className="mt-10 rounded-[2rem] bg-slate-900 p-7 text-white sm:p-9">

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-400">
            Beginner rules
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Simple things to remember
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">

            {beginnerRules.map((rule, index) => (

              <div
                key={rule}
                className="flex gap-3 rounded-xl bg-white/10 p-4"
              >

                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-500 text-sm font-black text-white">
                  {index + 1}
                </span>

                <p className="text-sm leading-6 text-slate-200">
                  {rule}
                </p>

              </div>

            ))}

          </div>

        </section>

        {/* AI */}

        <section className="mt-10">

          <Link
            href="/chat"
            className="group block rounded-[2rem] border border-indigo-200 bg-indigo-50 p-7 transition hover:-translate-y-1 hover:shadow-lg"
          >

            <div className="flex items-center justify-between gap-5">

              <div>

                <div className="text-sm font-black uppercase tracking-wider text-indigo-600">
                  AI Assistant
                </div>

                <h2 className="mt-3 text-2xl font-black text-indigo-950">
                  Not sure where something goes?
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-800">
                  Ask the Netherlands Guide AI what to do with a
                  specific item or situation.
                </p>

              </div>

              <span className="text-3xl text-indigo-300 transition group-hover:translate-x-1">
                →
              </span>

            </div>

          </Link>

        </section>

        {/* BACK HOME */}

        <div className="mt-10">

          <Link
            href="/dashboard"
            className="inline-flex rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
          >
            ← Back to Home
          </Link>

        </div>

        <footer className="py-10 text-center text-sm text-slate-400">
          Netherlands Guide · Making waste & recycling easier
        </footer>

      </div>

    </main>
  );
}