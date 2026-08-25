"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

type Attraction = {
  slug: string;
  name: string;
  category: string;
  description: string;
  image: string;
};

const cityAttractions: Record<string, Attraction[]> = {
  amsterdam: [
    {
      slug: "rijksmuseum",
      name: "Rijksmuseum",
      category: "Museum",
      description:
        "One of the Netherlands' most famous museums, featuring Dutch art and history.",
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
      name: "Amsterdam Canals",
      category: "Famous place",
      description:
        "Explore Amsterdam's famous historic canal belt and beautiful bridges.",
      image: "/cities/amsterdam/attractions/canals.jpg",
    },
    {
      slug: "dam-square",
      name: "Dam Square",
      category: "Famous place",
      description:
        "A central Amsterdam square surrounded by historic buildings and attractions.",
      image: "/cities/amsterdam/attractions/dam-square.jpg",
    },
    {
      slug: "jordaan",
      name: "Jordaan",
      category: "Neighbourhood",
      description:
        "A beautiful historic neighbourhood filled with canals, cafés and small shops.",
      image: "/cities/amsterdam/attractions/jordaan.jpg",
    },
    {
      slug: "vondelpark",
      name: "Vondelpark",
      category: "Park",
      description:
        "Amsterdam's famous city park, perfect for walking, cycling and relaxing.",
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

  rotterdam: [
    {
      slug: "erasmus-bridge",
      name: "Erasmus Bridge",
      category: "Landmark",
      description:
        "One of Rotterdam's most recognizable landmarks.",
      image: "/cities/rotterdam/attractions/erasmus-bridge.jpg",
    },
    {
      slug: "markthal",
      name: "Markthal",
      category: "Food & architecture",
      description:
        "A spectacular indoor market filled with food, restaurants and architecture.",
      image: "/cities/rotterdam/attractions/markthal.jpg",
    },
    {
      slug: "cube-houses",
      name: "Cube Houses",
      category: "Architecture",
      description:
        "Rotterdam's famous tilted cube-shaped houses.",
      image: "/cities/rotterdam/attractions/cube-houses.jpg",
    },
    {
      slug: "rotterdam-central",
      name: "Rotterdam Central Station",
      category: "Architecture",
      description:
        "A modern architectural landmark and major transport hub.",
      image: "/cities/rotterdam/attractions/rotterdam-central.jpg",
    },
  ],

  utrecht: [
    {
      slug: "dom-tower",
      name: "Dom Tower",
      category: "Landmark",
      description:
        "Utrecht's most famous landmark and the tallest church tower in the Netherlands.",
      image: "/cities/utrecht/attractions/dom-tower.jpg",
    },
    {
      slug: "oude-gracht",
      name: "Oudegracht",
      category: "Canal",
      description:
        "Utrecht's historic canal with cafés, restaurants and terraces at water level.",
      image: "/cities/utrecht/attractions/oude-gracht.jpg",
    },
    {
      slug: "railway-museum",
      name: "Railway Museum",
      category: "Museum",
      description:
        "A museum dedicated to the history of Dutch railways.",
      image: "/cities/utrecht/attractions/railway-museum.jpg",
    },
    {
      slug: "neude",
      name: "Neude",
      category: "City centre",
      description:
        "A lively square in the heart of Utrecht.",
      image: "/cities/utrecht/attractions/neude.jpg",
    },
  ],

  "the-hague": [
    {
      slug: "scheveningen-beach",
      name: "Scheveningen Beach",
      category: "Beach",
      description:
        "The Hague's famous seaside area with beaches, restaurants and activities.",
      image: "/cities/the-hague/attractions/scheveningen-beach.jpg",
    },
    {
      slug: "peace-palace",
      name: "Peace Palace",
      category: "Landmark",
      description:
        "An internationally famous building connected with international law and peace.",
      image: "/cities/the-hague/attractions/peace-palace.jpg",
    },
    {
      slug: "mauritshuis",
      name: "Mauritshuis",
      category: "Museum",
      description:
        "A famous museum containing major works of Dutch art.",
      image: "/cities/the-hague/attractions/mauritshuis.jpg",
    },
    {
      slug: "madurodam",
      name: "Madurodam",
      category: "Attraction",
      description:
        "A miniature park showing famous Dutch buildings and places.",
      image: "/cities/the-hague/attractions/madurodam.jpg",
    },
  ],

  eindhoven: [
    {
      slug: "philips-museum",
      name: "Philips Museum",
      category: "Museum",
      description:
        "Discover the history of Philips and its connection to Eindhoven.",
      image: "/cities/eindhoven/attractions/philips-museum.jpg",
    },
    {
      slug: "strijp-s",
      name: "Strijp-S",
      category: "District",
      description:
        "A former industrial area transformed into a creative and modern district.",
      image: "/cities/eindhoven/attractions/strijp-s.jpg",
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
      slug: "van-abbemuseum",
      name: "Van Abbemuseum",
      category: "Museum",
      description:
        "A major museum for modern and contemporary art.",
      image: "/cities/eindhoven/attractions/van-abbemuseum.jpg",
    },
  ],

  haarlem: [
    {
      slug: "grote-kerk",
      name: "Grote Kerk",
      category: "Landmark",
      description:
        "The impressive historic church dominating Haarlem's Grote Markt.",
      image: "/cities/haarlem/attractions/grote-kerk.jpg",
    },
    {
      slug: "grote-markt",
      name: "Grote Markt",
      category: "City centre",
      description:
        "Haarlem's historic central square.",
      image: "/cities/haarlem/attractions/grote-markt.jpg",
    },
    {
      slug: "frans-hals-museum",
      name: "Frans Hals Museum",
      category: "Museum",
      description:
        "A museum dedicated to Dutch art and the famous painter Frans Hals.",
      image: "/cities/haarlem/attractions/frans-hals-museum.jpg",
    },
    {
      slug: "spaarne-river",
      name: "Spaarne River",
      category: "Nature",
      description:
        "Enjoy Haarlem's beautiful river and historic waterfront.",
      image: "/cities/haarlem/attractions/spaarne-river.jpg",
    },
  ],

  hilversum: [
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
  ],
};

const cityNames: Record<string, string> = {
  amsterdam: "Amsterdam",
  rotterdam: "Rotterdam",
  utrecht: "Utrecht",
  "the-hague": "The Hague",
  eindhoven: "Eindhoven",
  haarlem: "Haarlem",
  hilversum: "Hilversum",
};

export default function CityPage() {
  const params = useParams<{ city: string }>();

  const citySlug = params.city?.toLowerCase();
  const cityName = cityNames[citySlug] || citySlug;
  const attractions = cityAttractions[citySlug] || [];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
          <Link
            href="/explore"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:border-orange-300 hover:bg-orange-50"
          >
            ← Back to Explore
          </Link>

          <Link href="/dashboard" className="font-black">
            🇳🇱 Netherlands Guide
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12">
        <div className="rounded-[2rem] bg-gradient-to-br from-orange-500 to-red-600 p-7 text-white shadow-xl sm:p-10">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-100">
            Explore the Netherlands
          </p>

          <h1 className="mt-3 text-4xl font-black sm:text-6xl">
            {cityName}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-orange-50 sm:text-lg">
            Discover famous places, museums, neighbourhoods and things to do
            in {cityName}.
          </p>
        </div>

        {attractions.length > 0 ? (
          <section className="mt-10">
            <div className="mb-6">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-500">
                Places to explore
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Famous places in {cityName}
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {attractions.map((attraction) => (
                <Link
                  key={attraction.slug}
                  href={`/explore/${citySlug}/${attraction.slug}`}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="h-56 overflow-hidden bg-slate-100">
                    <img
                      src={attraction.image}
                      alt={attraction.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-black uppercase tracking-wider text-orange-500">
                      {attraction.category}
                    </p>

                    <h3 className="mt-2 text-xl font-black">
                      {attraction.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {attraction.description}
                    </p>

                    <p className="mt-4 font-bold text-orange-600">
                      Learn more →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 text-center">
            <h2 className="text-2xl font-black">
              Attractions coming soon
            </h2>

            <p className="mt-2 text-slate-500">
              We're still adding places to {cityName}.
            </p>
          </div>
        )}
      </section>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-400">
        Netherlands Guide · Explore the Netherlands
      </footer>
    </main>
  );
}