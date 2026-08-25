"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const MunicipalityMap = dynamic(
  () => import("@/components/MunicipalityMap"),
  {
    ssr: false,
  }
);

type Municipality = {
  name: string;
  province: string;
  population: string;
  description: string;
  website: string;
  services: string[];
  waste: string;
  transport: string;
};

const municipalities: Municipality[] = [
  {
    name: "Hilversum",
    province: "Noord-Holland",
    population: "Around 95,000 residents",
    description:
      "Hilversum is a municipality in the Gooi region of Noord-Holland. It is known as the media city of the Netherlands and has residential neighbourhoods, shops, schools, healthcare services and green areas.",
    website: "https://www.hilversum.nl",
    services: [
      "Municipality appointments",
      "Registration",
      "Civil documents",
      "Parking",
      "Waste collection",
      "Local taxes",
      "Permits",
      "Public space reports",
    ],
    waste:
      "Waste collection can depend on your address. Different waste streams may include residual waste, organic waste, paper, glass and textile.",
    transport:
      "Hilversum has several train stations and local and regional bus connections. Cycling is also an important way of travelling around the municipality.",
  },
  {
    name: "Amsterdam",
    province: "Noord-Holland",
    population: "Around 930,000 residents",
    description:
      "Amsterdam is the capital of the Netherlands and one of the country's largest municipalities. It has extensive public transport, cycling infrastructure, healthcare, housing and municipal services.",
    website: "https://www.amsterdam.nl",
    services: [
      "Registration",
      "Municipal services",
      "Parking",
      "Waste",
      "Permits",
      "Local taxes",
      "Civil documents",
      "Housing information",
    ],
    waste:
      "Amsterdam has different collection systems depending on the neighbourhood and type of waste.",
    transport:
      "Amsterdam has trains, metro, trams, buses, ferries and extensive cycling infrastructure.",
  },
  {
    name: "Utrecht",
    province: "Utrecht",
    population: "Around 375,000 residents",
    description:
      "Utrecht is a major Dutch city with excellent public transport, cycling infrastructure, universities, healthcare and municipal services.",
    website: "https://www.utrecht.nl",
    services: [
      "Registration",
      "Civil documents",
      "Parking",
      "Waste",
      "Permits",
      "Local taxes",
      "Housing information",
    ],
    waste:
      "Waste collection depends on the neighbourhood and type of waste.",
    transport:
      "Utrecht is one of the Netherlands' main transport hubs, with trains, buses, cycling routes and other public transport.",
  },
  {
    name: "Rotterdam",
    province: "Zuid-Holland",
    population: "Around 675,000 residents",
    description:
      "Rotterdam is a major international city known for its port, modern architecture, public transport and diverse population.",
    website: "https://www.rotterdam.nl",
    services: [
      "Registration",
      "Civil documents",
      "Parking",
      "Waste",
      "Permits",
      "Local taxes",
      "Housing information",
    ],
    waste:
      "Waste collection varies by neighbourhood and waste type.",
    transport:
      "Rotterdam has trains, metro, trams, buses, ferries and cycling infrastructure.",
  },
  {
    name: "The Hague",
    province: "Zuid-Holland",
    population: "Around 565,000 residents",
    description:
      "The Hague is the seat of the Dutch government and is known for international organisations, beaches, public services and a large international community.",
    website: "https://www.denhaag.nl",
    services: [
      "Registration",
      "Civil documents",
      "Parking",
      "Waste",
      "Permits",
      "Local taxes",
      "Housing information",
    ],
    waste:
      "Waste collection depends on the address and type of waste.",
    transport:
      "The Hague has trains, trams, buses and extensive cycling infrastructure.",
  },
];

export default function MunicipalityPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* BACK */}
        <Link
          href="/dashboard"
          className="mb-6 inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>

        {/* INTRO */}
        <section className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Netherlands Guide
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Municipality Guide
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Find useful information about Dutch municipalities, local
            services, transport, waste collection and official municipal
            websites.
          </p>
        </section>

        {/* MAP */}
        <section className="mb-10">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <MunicipalityMap municipality="Hilversum" />
          </div>
        </section>

        {/* MUNICIPALITIES */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {municipalities.map((municipality) => (
            <article
              key={municipality.name}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              {/* NAME */}
              <div className="mb-4">
                <h2 className="text-2xl font-bold">
                  {municipality.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {municipality.province}
                </p>
              </div>

              {/* POPULATION */}
              <p className="mb-4 text-sm font-medium text-blue-600">
                {municipality.population}
              </p>

              {/* DESCRIPTION */}
              <p className="mb-5 text-sm leading-6 text-slate-600">
                {municipality.description}
              </p>

              {/* SERVICES */}
              <div className="mb-5">
                <h3 className="mb-2 font-semibold">
                  Local services
                </h3>

                <ul className="space-y-1 text-sm text-slate-600">
                  {municipality.services.map((service) => (
                    <li key={service}>
                      • {service}
                    </li>
                  ))}
                </ul>
              </div>

              {/* USEFUL INFORMATION */}
              <div className="mb-5">
                <h3 className="mb-2 font-semibold">
                  Useful information
                </h3>

                <p className="mb-3 text-sm text-slate-600">
                  <strong>Waste:</strong>{" "}
                  {municipality.waste}
                </p>

                <p className="text-sm text-slate-600">
                  <strong>Transport:</strong>{" "}
                  {municipality.transport}
                </p>
              </div>

              {/* OFFICIAL WEBSITE */}
              <a
                href={municipality.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Official website →
              </a>
            </article>
          ))}
        </section>

      </div>
    </main>
  );
}