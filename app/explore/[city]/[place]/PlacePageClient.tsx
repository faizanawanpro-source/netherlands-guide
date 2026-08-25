"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

type PlaceInfo = {
  name: string;
  category: string;
  description: string;
  image: string;
  location: string;
  price: string;
  hours: string;
  transport: string;
  website: string;
};

const places: Record<string, Record<string, PlaceInfo>> = {
  amsterdam: {
    rijksmuseum: {
      name: "Rijksmuseum",
      category: "Museum",
      description:
        "The Rijksmuseum is one of the Netherlands' most famous museums. Discover Dutch art, history and masterpieces from artists such as Rembrandt and Vermeer.",
      image: "/cities/amsterdam/attractions/rijksmuseum.jpg",
      location: "Museumstraat 1, Amsterdam",
      price: "Paid entry",
      hours: "Usually open daily",
      transport: "Tram, bus or bicycle from Amsterdam city centre",
      website: "https://www.rijksmuseum.nl",
    },

    "van-gogh-museum": {
      name: "Van Gogh Museum",
      category: "Museum",
      description:
        "Explore the world's largest collection of works by Vincent van Gogh and learn about his life, art and development as an artist.",
      image: "/cities/amsterdam/attractions/van-gogh-museum.jpg",
      location: "Museumplein, Amsterdam",
      price: "Paid entry",
      hours: "Opening times vary",
      transport: "Tram or bus to Museumplein",
      website: "https://www.vangoghmuseum.nl",
    },

    "anne-frank-house": {
      name: "Anne Frank House",
      category: "Museum",
      description:
        "Visit the historic house where Anne Frank and her family hid during World War II. The museum tells Anne's story and preserves the hiding place.",
      image: "/cities/amsterdam/attractions/anne-frank-house.jpg",
      location: "Prinsengracht 263-267, Amsterdam",
      price: "Paid entry",
      hours: "Opening times vary",
      transport: "Walk, tram or bus from Amsterdam Central",
      website: "https://www.annefrank.org",
    },

    canals: {
      name: "Canal Cruise",
      category: "Boats & Canals",
      description:
        "See Amsterdam from the water and experience the historic canal belt from a completely different perspective.",
      image: "/cities/amsterdam/attractions/canals.jpg",
      location: "Various departure points in Amsterdam",
      price: "Usually paid",
      hours: "Depends on cruise company",
      transport: "Amsterdam Central and city-centre departure points",
      website: "https://www.iamsterdam.com",
    },

    "dam-square": {
      name: "Dam Square",
      category: "Famous Place",
      description:
        "Dam Square is one of Amsterdam's most famous central locations, surrounded by historic buildings, shops, restaurants and attractions.",
      image: "/cities/amsterdam/attractions/dam-square.jpg",
      location: "Dam, Amsterdam",
      price: "Free",
      hours: "Open public square",
      transport: "Walk from Amsterdam Central",
      website: "https://www.iamsterdam.com",
    },

    jordaan: {
      name: "Jordaan",
      category: "City & Streets",
      description:
        "Explore one of Amsterdam's most atmospheric neighbourhoods, filled with narrow streets, cafés, independent shops and historic buildings.",
      image: "/cities/amsterdam/attractions/jordaan.jpg",
      location: "Jordaan, Amsterdam",
      price: "Free to explore",
      hours: "Open neighbourhood",
      transport: "Walk, bicycle or tram",
      website: "https://www.iamsterdam.com",
    },

    vondelpark: {
      name: "Vondelpark",
      category: "Nature",
      description:
        "Relax, walk, cycle or enjoy the outdoors in Amsterdam's famous Vondelpark.",
      image: "/cities/amsterdam/attractions/vondelpark.jpg",
      location: "Vondelpark, Amsterdam",
      price: "Free",
      hours: "Open public park",
      transport: "Tram, bicycle or walking",
      website: "https://www.iamsterdam.com",
    },

    "a-dam-lookout": {
      name: "A'DAM Lookout",
      category: "Viewpoint",
      description:
        "Enjoy spectacular panoramic views over Amsterdam from the top of the A'DAM tower.",
      image: "/cities/amsterdam/attractions/a-dam-lookout.jpg",
      location: "Overhoeksplein 5, Amsterdam",
      price: "Paid entry",
      hours: "Opening times vary",
      transport: "Free ferry from Amsterdam Central",
      website: "https://www.adamlookout.com",
    },
  },

  rotterdam: {
    markthal: {
      name: "Markthal",
      category: "Food",
      description:
        "Rotterdam's famous Markthal combines spectacular architecture with food stalls, restaurants and local products.",
      image: "/cities/rotterdam/attractions/markthal.jpg",
      location: "Dominee Jan Scharpstraat, Rotterdam",
      price: "Free entry",
      hours: "Opening times vary",
      transport: "Rotterdam Blaak station",
      website: "https://www.markthal.nl",
    },

    "erasmus-bridge": {
      name: "Erasmus Bridge",
      category: "Famous Place",
      description:
        "The Erasmus Bridge is one of Rotterdam's most recognisable landmarks and connects the northern and southern parts of the city.",
      image: "/cities/rotterdam/attractions/erasmus-bridge.jpg",
      location: "Erasmusbrug, Rotterdam",
      price: "Free",
      hours: "Open",
      transport: "Metro, tram, bicycle or walking",
      website: "https://www.rotterdam.info",
    },

    "cube-houses": {
      name: "Cube Houses",
      category: "Architecture",
      description:
        "See Rotterdam's famous yellow Cube Houses, designed by architect Piet Blom.",
      image: "/cities/rotterdam/attractions/cube-houses.jpg",
      location: "Overblaak, Rotterdam",
      price: "Area is free",
      hours: "Open",
      transport: "Rotterdam Blaak station",
      website: "https://www.rotterdam.info",
    },

    euromast: {
      name: "Euromast",
      category: "City Views",
      description:
        "Enjoy panoramic views across Rotterdam from one of the city's most famous towers.",
      image: "/cities/rotterdam/attractions/euromast.jpg",
      location: "Parkhaven 20, Rotterdam",
      price: "Paid entry",
      hours: "Opening times vary",
      transport: "Tram, metro or bicycle",
      website: "https://euromast.nl",
    },

    "rotterdam-harbour": {
      name: "Rotterdam Harbour",
      category: "Boats & Waterfront",
      description:
        "Explore Rotterdam's connection to one of the world's largest ports and discover the city's maritime character.",
      image: "/cities/rotterdam/attractions/old-harbour.jpg",
      location: "Rotterdam waterfront",
      price: "Varies",
      hours: "Open areas",
      transport: "Metro, tram, bicycle or walking",
      website: "https://www.rotterdam.info",
    },

    katendrecht: {
      name: "Katendrecht",
      category: "Food & Nightlife",
      description:
        "Discover a lively Rotterdam neighbourhood with restaurants, cafés, waterfront views and entertainment.",
      image: "/cities/rotterdam/attractions/kop-van-zuid.jpg",
      location: "Katendrecht, Rotterdam",
      price: "Varies",
      hours: "Depends on venue",
      transport: "Metro, tram, water taxi or bicycle",
      website: "https://www.rotterdam.info",
    },
  },

  utrecht: {
    "dom-tower": {
      name: "Dom Tower",
      category: "Famous Place",
      description:
        "The Dom Tower is Utrecht's most famous landmark and dominates the city's historic centre.",
      image: "/cities/utrecht/attractions/dom-tower.jpg",
      location: "Domplein, Utrecht",
      price: "Paid for tower visit",
      hours: "Opening times vary",
      transport: "Walk from Utrecht Central",
      website: "https://www.domtoren.nl",
    },

    "oude-gracht": {
      name: "Oudegracht",
      category: "Canals & Boats",
      description:
        "Walk beside Utrecht's famous canal and discover its unique lower-level cafés and terraces.",
      image: "/cities/utrecht/attractions/oude-gracht.jpg",
      location: "Oudegracht, Utrecht",
      price: "Free",
      hours: "Open",
      transport: "Walking or bicycle",
      website: "https://www.discover-utrecht.com",
    },

    "de-haar-castle": {
      name: "De Haar Castle",
      category: "Day Trip",
      description:
        "Visit one of the Netherlands' most impressive castles, surrounded by beautiful gardens and countryside.",
      image: "/cities/utrecht/attractions/de-haar-castle.jpg",
      location: "Kasteellaan 1, Haarzuilens",
      price: "Paid entry",
      hours: "Opening times vary",
      transport: "Bus or bicycle from Utrecht area",
      website: "https://www.kasteeldehaar.nl",
    },

    griftpark: {
      name: "Griftpark",
      category: "Nature",
      description:
        "A popular green park where you can walk, relax, exercise and spend time outdoors.",
      image: "/cities/utrecht/attractions/griftpark.jpg",
      location: "Utrecht",
      price: "Free",
      hours: "Open",
      transport: "Bicycle, bus or walking",
      website: "https://www.discover-utrecht.com",
    },
  },

  "the-hague": {
    "scheveningen-beach": {
      name: "Scheveningen Beach",
      category: "Beach",
      description:
        "Enjoy the Dutch coast at Scheveningen with its beach, restaurants, promenade and famous pier.",
      image: "/cities/the-hague/attractions/scheveningen-beach.jpg",
      location: "Scheveningen, The Hague",
      price: "Free beach access",
      hours: "Open",
      transport: "Tram, bus, bicycle or car",
      website: "https://www.denhaag.com",
    },

    mauritshuis: {
      name: "Mauritshuis",
      category: "Museum",
      description:
        "A world-famous museum featuring masterpieces from Dutch and Flemish painting.",
      image: "/cities/the-hague/attractions/mauritshuis.jpg",
      location: "Plein 29, The Hague",
      price: "Paid entry",
      hours: "Opening times vary",
      transport: "Tram, bus or walking",
      website: "https://www.mauritshuis.nl",
    },

    "peace-palace": {
      name: "Peace Palace",
      category: "Famous Place",
      description:
        "The Peace Palace is an internationally recognised building associated with international law and peace.",
      image: "/cities/the-hague/attractions/peace-palace.jpg",
      location: "Carnegieplein 2, The Hague",
      price: "Varies",
      hours: "Tours vary",
      transport: "Tram or bus",
      website: "https://www.vredespaleis.nl",
    },

    madurodam: {
      name: "Madurodam",
      category: "Things to Do",
      description:
        "Explore a miniature version of the Netherlands featuring famous buildings, cities and landmarks.",
      image: "/cities/the-hague/attractions/madurodam.jpg",
      location: "George Maduroplein 1, The Hague",
      price: "Paid entry",
      hours: "Opening times vary",
      transport: "Tram, bus or bicycle",
      website: "https://www.madurodam.nl",
    },
  },

  eindhoven: {
    "strijp-s": {
      name: "Strijp-S",
      category: "Things to Do",
      description:
        "A former industrial Philips area transformed into one of Eindhoven's most creative districts.",
      image: "/cities/eindhoven/attractions/strijp-s.jpg.webp",
      location: "Strijp-S, Eindhoven",
      price: "Free area",
      hours: "Open area",
      transport: "Eindhoven Strijp-S station",
      website: "https://www.thisiseindhoven.com",
    },

    "van-abbemuseum": {
      name: "Van Abbemuseum",
      category: "Museum",
      description:
        "Discover modern and contemporary art at Eindhoven's famous Van Abbemuseum.",
      image: "/cities/eindhoven/attractions/van-abbemuseum.jpg",
      location: "Bilderdijklaan 10, Eindhoven",
      price: "Paid entry",
      hours: "Opening times vary",
      transport: "Bus or bicycle",
      website: "https://vanabbemuseum.nl",
    },

    "philips-museum": {
      name: "Philips Museum",
      category: "Museum",
      description:
        "Discover the history of Philips and how a small Eindhoven company became a global technology company.",
      image: "/cities/eindhoven/attractions/philips-museum.jpg",
      location: "Emmasingel 31, Eindhoven",
      price: "Paid entry",
      hours: "Opening times vary",
      transport: "Walk from Eindhoven Central",
      website: "https://www.philips-museum.com",
    },

    "genneper-parken": {
      name: "Genneper Parken",
      category: "Nature",
      description:
        "A large green area offering walking routes, sports, nature and recreational activities.",
      image: "/cities/eindhoven/attractions/genneper-parken.jpg",
      location: "Eindhoven",
      price: "Free",
      hours: "Open",
      transport: "Bicycle, bus or walking",
      website: "https://www.thisiseindhoven.com",
    },
  },

  hilversum: {
    mediapark: {
      name: "Media Park",
      category: "Entertainment",
      description:
        "Media Park is the centre of Dutch television and media production and an important part of Hilversum's identity.",
      image: "/cities/hilversum/attractions/mediapark.jpg",
      location: "Sumatralaan, Hilversum",
      price: "Varies",
      hours: "Depends on activity",
      transport: "Hilversum Media Park station",
      website: "https://www.mediapark.nl",
    },

    "raadhuis-hilversum": {
      name: "Hilversum City Hall",
      category: "Architecture",
      description:
        "The famous Dudok-designed city hall is one of Hilversum's most important architectural landmarks.",
      image: "/cities/hilversum/attractions/raadhuis-hilversum.jpg",
      location: "Dudokpark 1, Hilversum",
      price: "Free exterior",
      hours: "Exterior open",
      transport: "Walking, bicycle or bus",
      website: "https://www.hilversum.nl",
    },

    "dudok-architecture": {
      name: "Dudok Architecture",
      category: "Architecture",
      description:
        "Discover the distinctive architecture of Willem Marinus Dudok throughout Hilversum.",
      image: "/cities/hilversum/attractions/dudok-architecture.jpg",
      location: "Various locations in Hilversum",
      price: "Free",
      hours: "Open",
      transport: "Walking or bicycle",
      website: "https://www.hilversum.nl",
    },

    "loosdrecht-lakes": {
      name: "Loosdrecht Lakes",
      category: "Nature",
      description:
        "Enjoy beautiful lakes and waterways near Hilversum, perfect for boating, walking and relaxing.",
      image: "/cities/hilversum/attractions/loosdrecht-lakes.jpg",
      location: "Loosdrecht",
      price: "Varies",
      hours: "Open",
      transport: "Car, bicycle or bus",
      website: "https://www.visitgooivecht.nl",
    },
  },
};

export default function PlacePage() {
  const params = useParams();

  const cityId = String(params.city);
  const placeSlug = String(params.place);

  const place = places[cityId]?.[placeSlug];

  const [saved, setSaved] = useState(false);

  if (!place) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="text-center">
          <div className="text-6xl">📍</div>

          <h1 className="mt-4 text-3xl font-black">
            Place not found
          </h1>

          <p className="mt-2 text-slate-500">
            We could not find this attraction.
          </p>

          <Link
            href="/explore"
            className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-black text-white"
          >
            ← Back to Explore
          </Link>
        </div>
      </main>
    );
  }

  const cityName =
    cityId === "the-hague"
      ? "The Hague"
      : cityId.charAt(0).toUpperCase() + cityId.slice(1);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* NAVBAR */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link
            href={`/explore`}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
          >
            ← Back to Explore
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-2xl">
              🇳🇱
            </div>

            <div className="hidden sm:block">
              <p className="font-black">Netherlands Guide</p>
              <p className="text-xs text-slate-500">
                Explore the Netherlands
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* HERO IMAGE */}
      <section className="relative h-[380px] overflow-hidden bg-slate-900 sm:h-[500px]">
        <img
          src={place.image}
          alt={place.name}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto max-w-7xl px-5 pb-10 sm:px-6">
            <span className="rounded-full bg-orange-500 px-4 py-2 text-xs font-black text-white">
              {place.category}
            </span>

            <h1 className="mt-4 text-4xl font-black text-white sm:text-6xl">
              {place.name}
            </h1>

            <p className="mt-2 text-white/80">
              📍 {cityName}
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          {/* MAIN */}
          <div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
              <h2 className="text-3xl font-black">
                About {place.name}
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-600">
                {place.description}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                    📍 Location
                  </p>

                  <p className="mt-2 font-bold">
                    {place.location}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                    💶 Price
                  </p>

                  <p className="mt-2 font-bold">
                    {place.price}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                    🕐 Opening
                  </p>

                  <p className="mt-2 font-bold">
                    {place.hours}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                    🚆 Transport
                  </p>

                  <p className="mt-2 font-bold">
                    {place.transport}
                  </p>
                </div>
              </div>
            </div>

            {/* AI BOX */}
            <div className="mt-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 to-purple-700 p-7 text-white shadow-xl">
              <p className="text-sm font-black uppercase tracking-wider text-indigo-200">
                🤖 AI Assistant
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Want to know more?
              </h2>

              <p className="mt-3 text-sm leading-7 text-indigo-100">
                Soon you will be able to ask Netherlands Guide questions
                about this place, transport, tickets, nearby restaurants
                and things to do.
              </p>

              <button
                type="button"
                className="mt-5 rounded-xl bg-white px-5 py-3 font-black text-indigo-700"
              >
                Ask AI — Coming Soon
              </button>
            </div>
          </div>

          {/* SIDEBAR */}
          <aside>
            <div className="sticky top-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">
                Plan your visit
              </h2>

              <button
                type="button"
                onClick={() => setSaved(!saved)}
                className={`mt-5 w-full rounded-xl px-5 py-3 font-black transition ${
                  saved
                    ? "bg-red-100 text-red-600"
                    : "bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                {saved ? "❤️ Saved" : "♡ Save place"}
              </button>

              <a
                href={place.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block w-full rounded-xl bg-orange-500 px-5 py-3 text-center font-black text-white transition hover:bg-orange-600"
              >
                Official website ↗
              </a>

              <Link
                href="/transport"
                className="mt-3 block w-full rounded-xl border border-slate-200 px-5 py-3 text-center font-black text-slate-700 transition hover:bg-orange-50"
              >
                🚆 Transport
              </Link>

              <Link
                href={`/explore`}
                className="mt-3 block w-full rounded-xl border border-slate-200 px-5 py-3 text-center font-black text-slate-700 transition hover:bg-slate-50"
              >
                🗺️ Explore more
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-400">
        Netherlands Guide 🇳🇱 · Explore more, experience more
      </footer>
    </main>
  );
}