"use client";

import { useState } from "react";
import Link from "next/link";

type Place = {
  slug: string;
  name: string;
  category: string;
  description: string;
  image?: string;
};

type City = {
  id: string;
  name: string;
  province: string;
  description: string;
  places: Place[];
};

const cities: City[] = [
  {
    id: "amsterdam",
    name: "Amsterdam",
    province: "North Holland",
    description:
      "Explore canals, museums, historic streets, parks, food and some of the Netherlands' most famous landmarks.",
    places: [
      {
        slug: "rijksmuseum",
        name: "Rijksmuseum",
        category: "Museum",
        description:
          "One of the Netherlands' most famous museums, home to major Dutch artworks and history.",
        image: "/cities/amsterdam/attractions/rijksmuseum.jpg",
      },
      {
        slug: "van-gogh-museum",
        name: "Van Gogh Museum",
        category: "Museum",
        description:
          "Discover the world's largest collection of works by Vincent van Gogh.",
        image: "/cities/amsterdam/attractions/van-gogh-museum.jpg",
      },
      {
        slug: "anne-frank-house",
        name: "Anne Frank House",
        category: "Museum",
        description:
          "A historic museum dedicated to Anne Frank and her story.",
        image: "/cities/amsterdam/attractions/anne-frank-house.jpg",
      },
      {
        slug: "canals",
        name: "Canal Cruise",
        category: "Boats & Canals",
        description:
          "See Amsterdam from the water and explore the city's historic canal belt.",
        image: "/cities/amsterdam/attractions/canals.jpg",
      },
      {
        slug: "dam-square",
        name: "Dam Square",
        category: "Famous Place",
        description:
          "One of the most central and recognizable places in Amsterdam.",
        image: "/cities/amsterdam/attractions/dam-square.jpg",
      },
      {
        slug: "jordaan",
        name: "Jordaan",
        category: "City & Streets",
        description:
          "Walk through one of Amsterdam's best-known neighbourhoods with cafés, shops and historic streets.",
        image: "/cities/amsterdam/attractions/jordaan.jpg",
      },
      {
        slug: "vondelpark",
        name: "Vondelpark",
        category: "Nature",
        description:
          "A popular city park for walking, relaxing, cycling and enjoying the outdoors.",
        image: "/cities/amsterdam/attractions/vondelpark.jpg",
      },
      {
        slug: "a-dam-lookout",
        name: "A'DAM Lookout",
        category: "Viewpoint",
        description:
          "Enjoy panoramic views over Amsterdam from the famous A'DAM tower.",
        image: "/cities/amsterdam/attractions/a-dam-lookout.jpg",
      },
    ],
  },

  {
    id: "rotterdam",
    name: "Rotterdam",
    province: "South Holland",
    description:
      "Discover modern architecture, the port, waterfront views, food halls and one of Europe's most dynamic cities.",
    places: [
      {
        slug: "markthal",
        name: "Markthal",
        category: "Food",
        description:
          "A famous indoor market and architectural landmark filled with food stalls and restaurants.",
        image: "/cities/rotterdam/attractions/markthal.jpg",
      },
      {
        slug: "erasmus-bridge",
        name: "Erasmus Bridge",
        category: "Famous Place",
        description:
          "One of Rotterdam's most recognizable landmarks crossing the Nieuwe Maas.",
        image: "/cities/rotterdam/attractions/erasmus-bridge.jpg",
      },
      {
        slug: "cube-houses",
        name: "Cube Houses",
        category: "Architecture",
        description:
          "Unique yellow cube-shaped houses designed by architect Piet Blom.",
        image: "/cities/rotterdam/attractions/cube-houses.jpg",
      },
      {
        slug: "euromast",
        name: "Euromast",
        category: "City Views",
        description:
          "Enjoy panoramic views over Rotterdam from one of the city's best-known towers.",
        image: "/cities/rotterdam/attractions/euromast.jpg",
      },
      {
        slug: "kop-van-zuid",
        name: "Kop van Zuid",
        category: "Waterfront",
        description:
          "A modern waterfront district known for architecture, restaurants and skyline views.",
        image: "/cities/rotterdam/attractions/kop-van-zuid.jpg",
      },
      {
        slug: "old-harbour",
        name: "Old Harbour",
        category: "Boats & Waterfront",
        description:
          "One of Rotterdam's historic harbour areas surrounded by restaurants and terraces.",
        image: "/cities/rotterdam/attractions/old-harbour.jpg",
      },
      {
        slug: "rotterdam-central",
        name: "Rotterdam Central Station",
        category: "Famous Place",
        description:
          "The impressive central railway station and one of Rotterdam's major landmarks.",
        image: "/cities/rotterdam/attractions/rotterdam-central.jpg",
      },
      {
        slug: "ss-rotterdam",
        name: "SS Rotterdam",
        category: "Things to Do",
        description:
          "A historic ocean liner permanently located in Rotterdam.",
        image: "/cities/rotterdam/attractions/ss-rotterdam.jpg",
      },
    ],
  },

  {
    id: "utrecht",
    name: "Utrecht",
    province: "Utrecht",
    description:
      "Experience historic canals, cafés, cycling, medieval architecture and the famous Dom Tower.",
    places: [
      {
        slug: "dom-tower",
        name: "Dom Tower",
        category: "Famous Place",
        description:
          "The iconic tower in the centre of Utrecht and one of the city's main landmarks.",
        image: "/cities/utrecht/attractions/dom-tower.jpg",
      },
      {
        slug: "oude-gracht",
        name: "Oudegracht",
        category: "Canals & Boats",
        description:
          "The famous canal running through Utrecht with unique lower-level cafés and terraces.",
        image: "/cities/utrecht/attractions/oude-gracht.jpg",
      },
      {
        slug: "de-haar-castle",
        name: "De Haar Castle",
        category: "Day Trip",
        description:
          "A spectacular castle near Utrecht surrounded by gardens and countryside.",
        image: "/cities/utrecht/attractions/de-haar-castle.jpg",
      },
      {
        slug: "griftpark",
        name: "Griftpark",
        category: "Nature",
        description:
          "A popular green space for relaxing, walking and spending time outdoors.",
        image: "/cities/utrecht/attractions/griftpark.jpg",
      },
      {
        slug: "neude",
        name: "Neude",
        category: "Food & Cafés",
        description:
          "A lively square in the centre of Utrecht surrounded by cafés and restaurants.",
        image: "/cities/utrecht/attractions/neude.jpg",
      },
      {
        slug: "railway-museum",
        name: "Railway Museum",
        category: "Museum",
        description:
          "Explore Dutch railway history through trains, exhibitions and interactive displays.",
        image: "/cities/utrecht/attractions/railway-museum.jpg",
      },
      {
        slug: "rijn",
        name: "Rijn Area",
        category: "Nature",
        description:
          "Explore the waterways and scenery around Utrecht.",
        image: "/cities/utrecht/attractions/rijn.jpg",
      },
      {
        slug: "dom-under",
        name: "DOMunder",
        category: "Things to Do",
        description:
          "Discover the archaeological history beneath Dom Square.",
        image: "/cities/utrecht/attractions/dom-under.jpg",
      },
    ],
  },

  {
    id: "the-hague",
    name: "The Hague",
    province: "South Holland",
    description:
      "Combine city life with beaches, museums, royal history and international institutions.",
    places: [
      {
        slug: "scheveningen-beach",
        name: "Scheveningen Beach",
        category: "Beach",
        description:
          "One of the Netherlands' best-known beaches with restaurants, activities and sea views.",
        image: "/cities/the-hague/attractions/scheveningen-beach.jpg",
      },
      {
        slug: "mauritshuis",
        name: "Mauritshuis",
        category: "Museum",
        description:
          "A famous museum housing masterpieces from Dutch and Flemish painting.",
        image: "/cities/the-hague/attractions/mauritshuis.jpg",
      },
      {
        slug: "binnenhof",
        name: "Binnenhof",
        category: "Historic Place",
        description:
          "A historic political complex in the heart of The Hague.",
        image: "/cities/the-hague/attractions/binnenhof.jpg",
      },
      {
        slug: "peace-palace",
        name: "Peace Palace",
        category: "Famous Place",
        description:
          "An internationally recognized building associated with international law and peace.",
        image: "/cities/the-hague/attractions/peace-palace.jpg",
      },
      {
        slug: "madurodam",
        name: "Madurodam",
        category: "Things to Do",
        description:
          "Explore a miniature version of famous Dutch buildings and landmarks.",
        image: "/cities/the-hague/attractions/madurodam.jpg",
      },
      {
        slug: "escher-museum",
        name: "Escher Museum",
        category: "Museum",
        description:
          "Discover the fascinating optical art of M.C. Escher.",
        image: "/cities/the-hague/attractions/escher-museum.jpg",
      },
      {
        slug: "lange-voorhout",
        name: "Lange Voorhout",
        category: "City & Streets",
        description:
          "A beautiful historic avenue in the centre of The Hague.",
        image: "/cities/the-hague/attractions/lange-voorhout.jpg",
      },
      {
        slug: "scheveningen-pier",
        name: "Scheveningen Pier",
        category: "Things to Do",
        description:
          "A famous seaside pier overlooking the North Sea.",
        image: "/cities/the-hague/attractions/pier.jpg",
      },
    ],
  },

  {
    id: "eindhoven",
    name: "Eindhoven",
    province: "North Brabant",
    description:
      "Discover Dutch design, technology, modern architecture, food and creative culture.",
    places: [
      {
        slug: "strijp-s",
        name: "Strijp-S",
        category: "Things to Do",
        description:
          "A former industrial area transformed into a creative district with shops, restaurants and events.",
        image: "/cities/eindhoven/attractions/strijp-s.jpg.webp",
      },
      {
        slug: "van-abbemuseum",
        name: "Van Abbemuseum",
        category: "Museum",
        description:
          "A modern and contemporary art museum in the centre of Eindhoven.",
        image: "/cities/eindhoven/attractions/van-abbemuseum.jpg",
      },
      {
        slug: "philips-museum",
        name: "Philips Museum",
        category: "Museum",
        description:
          "Learn how Philips grew from Eindhoven into a global technology company.",
        image: "/cities/eindhoven/attractions/philips-museum.jpg",
      },
      {
        slug: "genneper-parken",
        name: "Genneper Parken",
        category: "Nature",
        description:
          "A large green area with walking routes, sports and recreational activities.",
        image: "/cities/eindhoven/attractions/genneper-parken.jpg",
      },
      {
        slug: "downtown-eindhoven",
        name: "Downtown Eindhoven",
        category: "City & Shopping",
        description:
          "Explore shops, cafés, restaurants and nightlife in the city centre.",
        image: "/cities/eindhoven/attractions/downtown-eindhoven.jpg",
      },
      {
        slug: "evoluon",
        name: "Evoluon",
        category: "Architecture",
        description:
          "One of Eindhoven's most recognizable futuristic buildings.",
        image: "/cities/eindhoven/attractions/evoluon.jpg",
      },
      {
        slug: "psv-stadium",
        name: "PSV Stadium",
        category: "Sports",
        description:
          "Visit the home stadium of PSV Eindhoven.",
        image: "/cities/eindhoven/attractions/psv-stadium.jpg",
      },
      {
        slug: "sint-catharinakerk",
        name: "St. Catherine's Church",
        category: "Historic Place",
        description:
          "A historic church in the heart of Eindhoven.",
        image: "/cities/eindhoven/attractions/sint-catharinakerk.jpg",
      },
    ],
  },

  {
    id: "hilversum",
    name: "Hilversum",
    province: "North Holland",
    description:
      "Discover Dutch media, Dudok architecture, nature and the beautiful Loosdrecht Lakes nearby.",
    places: [
      {
        slug: "mediapark",
        name: "Media Park",
        category: "Entertainment",
        description:
          "The centre of Dutch television and media production.",
        image: "/cities/hilversum/attractions/mediapark.jpg",
      },
      {
        slug: "raadhuis-hilversum",
        name: "Hilversum City Hall",
        category: "Architecture",
        description:
          "The famous Dudok-designed city hall of Hilversum.",
        image: "/cities/hilversum/attractions/raadhuis-hilversum.jpg",
      },
      {
        slug: "dudok-architecture",
        name: "Dudok Architecture",
        category: "Architecture",
        description:
          "Discover the distinctive architecture of Willem Marinus Dudok.",
        image: "/cities/hilversum/attractions/dudok-architecture.jpg",
      },
      {
        slug: "loosdrecht-lakes",
        name: "Loosdrecht Lakes",
        category: "Nature",
        description:
          "Beautiful lakes and waterways near Hilversum, perfect for boating and relaxing.",
        image: "/cities/hilversum/attractions/loosdrecht-lakes.jpg",
      },
      {
        slug: "corversbos",
        name: "Corversbos",
        category: "Nature",
        description:
          "A beautiful wooded nature area near Hilversum.",
        image: "/cities/hilversum/attractions/corversbos.jpg",
      },
      {
        slug: "dudokpark",
        name: "Dudokpark",
        category: "Nature",
        description:
          "A green park area connected to Hilversum's Dudok heritage.",
        image: "/cities/hilversum/attractions/dudokpark.jpg",
      },
      {
        slug: "hilversum-city",
        name: "Hilversum City Centre",
        category: "City & Shopping",
        description:
          "Explore the centre of Hilversum with shops, cafés and local attractions.",
        image: "/cities/hilversum/attractions/hilversum-city.jpg",
      },
      {
        slug: "hilvertshof",
        name: "Hilvertshof",
        category: "Shopping",
        description:
          "A shopping centre in the heart of Hilversum.",
        image: "/cities/hilversum/attractions/hilvertshof.jpg",
      },
    ],
  },

  {
    id: "haarlem",
    name: "Haarlem",
    province: "North Holland",
    description:
      "Explore historic streets, museums, beautiful squares, canals and one of the most charming cities in North Holland.",
    places: [
      {
        slug: "frans-hals-museum",
        name: "Frans Hals Museum",
        category: "Museum",
        description:
          "Discover Dutch Golden Age paintings and works by Frans Hals.",
        image: "/cities/haarlem/attractions/frans-hals-museum.jpg",
      },
      {
        slug: "grote-kerk",
        name: "Grote Kerk",
        category: "Historic Place",
        description:
          "The impressive historic church overlooking Haarlem's Grote Markt.",
        image: "/cities/haarlem/attractions/grote-kerk.jpg",
      },
      {
        slug: "grote-markt",
        name: "Grote Markt",
        category: "Famous Place",
        description:
          "The historic central square of Haarlem surrounded by beautiful buildings and cafés.",
        image: "/cities/haarlem/attractions/grote-markt.jpg",
      },
      {
        slug: "haarlem-city",
        name: "Haarlem City Centre",
        category: "City & Streets",
        description:
          "Walk through Haarlem's historic centre filled with shops, cafés and beautiful streets.",
        image: "/cities/haarlem/attractions/haarlem-city.jpg",
      },
      {
        slug: "haarlemmerhout",
        name: "Haarlemmerhout",
        category: "Nature",
        description:
          "A large historic park and green space near the centre of Haarlem.",
        image: "/cities/haarlem/attractions/haarlemmerhout.jpg",
      },
      {
        slug: "spaarne-river",
        name: "Spaarne River",
        category: "Boats & Canals",
        description:
          "Enjoy views along Haarlem's famous river and historic waterfront.",
        image: "/cities/haarlem/attractions/spaarne-river.jpg",
      },
      {
        slug: "taylor-museum",
        name: "Teylers Museum",
        category: "Museum",
        description:
          "The oldest museum in the Netherlands, featuring science, art and natural history.",
        image: "/cities/haarlem/attractions/taylor-museum.jpg",
      },
      {
        slug: "windmill-adrian",
        name: "Molen de Adriaan",
        category: "Famous Place",
        description:
          "A famous historic windmill beside the Spaarne River.",
        image: "/cities/haarlem/attractions/windmill-adrian.jpg",
      },
    ],
  },

  {
    id: "maastricht",
    name: "Maastricht",
    province: "Limburg",
    description:
      "Enjoy historic streets, cafés, architecture, food and a relaxed atmosphere close to Belgium and Germany.",
    places: [
      {
        slug: "vrijthof",
        name: "Vrijthof",
        category: "Famous Place",
        description:
          "Maastricht's famous central square surrounded by cafés, restaurants and historic buildings.",
      },
      {
        slug: "maastricht-underground",
        name: "Maastricht Underground",
        category: "Things to Do",
        description:
          "Discover tunnels, caves and underground history around Maastricht.",
      },
      {
        slug: "basilica-saint-servatius",
        name: "Basilica of Saint Servatius",
        category: "Historic Place",
        description:
          "A historic church overlooking the Vrijthof.",
      },
      {
        slug: "bonnefanten",
        name: "Bonnefanten",
        category: "Museum",
        description:
          "A major art museum featuring historic, modern and contemporary works.",
      },
      {
        slug: "st-pietersberg",
        name: "St. Pietersberg",
        category: "Nature",
        description:
          "A popular area for walking, views and exploring the landscape around Maastricht.",
      },
      {
        slug: "wyck",
        name: "Wyck",
        category: "Food & Shopping",
        description:
          "A lively district across the river with cafés, restaurants, boutiques and local shops.",
      },
    ],
  },
];

const categories = [
  "All",
  "Famous Place",
  "Museum",
  "Boats & Canals",
  "Nature",
  "Food & Cafés",
  "Food",
  "Shopping",
  "Things to Do",
  "Beach",
  "Day Trip",
  "Architecture",
  "City & Streets",
  "City & Shopping",
  "Viewpoint",
  "City Views",
  "Waterfront",
  "Boats & Waterfront",
  "Historic Place",
  "Entertainment",
  "Sports",
];

export default function ExplorePage() {
  const [selectedCity, setSelectedCity] = useState("amsterdam");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const city =
    cities.find((item) => item.id === selectedCity) || cities[0];

  const filteredPlaces =
    selectedCategory === "All"
      ? city.places
      : city.places.filter(
          (place) => place.category === selectedCategory
        );

  function changeCity(cityId: string) {
    setSelectedCity(cityId);
    setSelectedCategory("All");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* NAVBAR */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
          >
            ← Back to Home
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

      {/* HERO */}
      <section className="bg-gradient-to-br from-orange-500 via-orange-500 to-red-600 text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-100">
              Discover the Netherlands
            </p>

            <h1 className="mt-3 text-4xl font-black leading-tight sm:text-6xl">
              Explore the Netherlands
            </h1>

            <p className="mt-5 text-base leading-7 text-orange-50 sm:text-lg">
              Discover famous places, museums, canals, beaches, food,
              nature and things to do across the Netherlands.
            </p>
          </div>
        </div>
      </section>

      {/* CITY SELECTOR */}
      <section className="mx-auto max-w-7xl px-5 pt-8 sm:px-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-500">
            Choose your destination
          </p>

          <h2 className="mt-2 text-2xl font-black sm:text-3xl">
            Where do you want to go?
          </h2>

          <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
            {cities.map((item) => {
              const active = item.id === selectedCity;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => changeCity(item.id)}
                  className={`shrink-0 rounded-2xl px-5 py-3 text-sm font-black transition ${
                    active
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-orange-700"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* CITY */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
        <div className="rounded-[2rem] bg-slate-900 p-7 text-white shadow-xl sm:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-400">
            Your destination
          </p>

          <h2 className="mt-2 text-4xl font-black sm:text-5xl">
            {city.name}
          </h2>

          <p className="mt-2 text-sm font-bold text-slate-400">
            {city.province}
          </p>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
            {city.description}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/transport"
              className="rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-900 transition hover:bg-orange-50"
            >
              🚆 Transport
            </Link>

            <button
              type="button"
              className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-400"
            >
              🗺️ Plan a trip
            </button>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="flex gap-2 overflow-x-auto pb-3">
          {categories.map((category) => {
            const active = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                  active
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 shadow-sm hover:bg-orange-50 hover:text-orange-700"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </section>

      {/* PLACES */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
        <div className="mb-6">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-500">
            Discover {city.name}
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Places & experiences
          </h2>

          <p className="mt-2 text-slate-500">
            Explore things you can see and do in {city.name}.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPlaces.map((place) => (
            <article
              key={place.slug}
              className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              {/* IMAGE */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                {place.image ? (
                  <img
                    src={place.image}
                    alt={place.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                    <div className="text-center">
                      <div className="text-5xl">📍</div>

                      <p className="mt-2 text-xs font-bold text-slate-400">
                        Image coming soon
                      </p>
                    </div>
                  </div>
                )}

                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-slate-700 shadow-sm">
                  {place.category}
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-5">
                <h3 className="text-lg font-black">
                  {place.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {place.description}
                </p>

                <Link
                  href={`/explore/${city.id}/${place.slug}`}
                  className="mt-5 inline-block text-sm font-black text-orange-600 transition hover:text-orange-700"
                >
                  Explore →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filteredPlaces.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="font-bold text-slate-700">
              No places found in this category yet.
            </p>

            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className="mt-3 font-bold text-orange-600"
            >
              Show everything
            </button>
          </div>
        )}
      </section>

      {/* AI TRIP PLANNER */}
      <section className="mx-auto max-w-7xl px-5 pb-10 sm:px-6">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 to-purple-700 p-7 text-white shadow-xl sm:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-indigo-200">
              Coming next
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Let AI build your trip
            </h2>

            <p className="mt-4 text-sm leading-7 text-indigo-100 sm:text-base">
              Tell Netherlands Guide where you are going, how many
              days you have, your budget and what you like. The AI
              will create a personalised itinerary for you.
            </p>

            <button
              type="button"
              className="mt-6 rounded-xl bg-white px-6 py-3 font-black text-indigo-700 transition hover:bg-indigo-50"
            >
              🤖 AI Trip Planner — Coming Soon
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-400">
        Netherlands Guide 🇳🇱 · Explore more, experience more
      </footer>
    </main>
  );
}