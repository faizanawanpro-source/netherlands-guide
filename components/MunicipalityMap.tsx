"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";

type Place = {
  name: string;
  type: string;
  icon: string;
  position: [number, number];
  description: string;
};

type MunicipalityData = {
  center: [number, number];
};

const municipalityData: Record<string, MunicipalityData> = {
  Hilversum: {
    center: [52.2292, 5.1767],
  },

  Amsterdam: {
    center: [52.3676, 4.9041],
  },

  Utrecht: {
    center: [52.0907, 5.1214],
  },

  Rotterdam: {
    center: [51.9244, 4.4777],
  },

  "The Hague": {
    center: [52.0705, 4.3007],
  },
};

const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapCenter({
  center,
}: {
  center: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, 13, {
      duration: 1.2,
    });
  }, [center, map]);

  return null;
}

function googleMapsUrl(position: [number, number]) {
  return `https://www.google.com/maps/search/?api=1&query=${position[0]},${position[1]}`;
}

const googleButtonStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: "16px",
  padding: "11px 16px",
  borderRadius: "10px",
  backgroundColor: "#1d4ed8",
  color: "#ffffff",
  textAlign: "center",
  fontSize: "14px",
  fontWeight: 800,
  lineHeight: "20px",
  textDecoration: "none",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 3px 8px rgba(0, 0, 0, 0.18)",
};

export default function MunicipalityMap({
  municipality,
}: {
  municipality: string;
}) {
  const [filter, setFilter] = useState("All");

  const [places, setPlaces] = useState<Place[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  const data =
    municipalityData[municipality] ||
    municipalityData.Hilversum;

  /*
   * LOAD PLACES
   */

  useEffect(() => {
    let cancelled = false;

    async function loadPlaces() {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch(
          `/api/places?municipality=${encodeURIComponent(
            municipality
          )}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const result = await response.json();

        if (!cancelled) {
          setPlaces(
            Array.isArray(result.places)
              ? result.places
              : []
          );
        }
      } catch (err) {
        console.error("Places API error:", err);

        if (!cancelled) {
          setPlaces([]);
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPlaces();

    return () => {
      cancelled = true;
    };
  }, [municipality]);

  /*
   * RESET FILTER
   */

  useEffect(() => {
    setFilter("All");
  }, [municipality]);

  /*
   * FILTER PLACES
   */

  const filteredPlaces = useMemo(() => {
    if (filter === "All") {
      return places;
    }

    return places.filter(
      (place) => place.type === filter
    );
  }, [places, filter]);

  /*
   * FILTER BUTTONS
   */

  const filters = [
    {
      name: "All",
      icon: "📍",
    },
    {
      name: "Municipality",
      icon: "🏛️",
    },
    {
      name: "Healthcare",
      icon: "🏥",
    },
    {
      name: "Transport",
      icon: "🚆",
    },
    {
      name: "Police",
      icon: "👮",
    },
    {
      name: "Recycling",
      icon: "♻️",
    },
  ];

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">

      {/* HEADER */}

      <div className="border-b border-slate-200 bg-white p-5 sm:p-6">

        <p className="text-sm font-bold uppercase tracking-[0.18em] text-purple-600">
          Explore your area
        </p>

        <h2 className="mt-2 text-2xl font-black">
          {municipality} on the map
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Find useful places and important local services
          around {municipality}.
        </p>

        {/* FILTERS */}

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">

          {filters.map((item) => {
            const active = filter === item.name;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => setFilter(item.name)}
                className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                  active
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-purple-50 hover:text-purple-700"
                }`}
              >
                {item.icon} {item.name}
              </button>
            );
          })}

        </div>

      </div>

      {/* MAP */}

      <div className="relative h-[450px] w-full">

        <MapContainer
          center={data.center}
          zoom={13}
          scrollWheelZoom={true}
          className="h-full w-full"
        >

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapCenter center={data.center} />

          {/* MUNICIPALITY CENTER */}

          <Marker
            position={data.center}
            icon={markerIcon}
          >
            <Popup>

              <div className="min-w-[220px]">

                <div className="text-2xl">
                  📍
                </div>

                <h3 className="mt-2 font-bold">
                  {municipality}
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  Your selected municipality
                </p>

                <a
                  href={googleMapsUrl(data.center)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={googleButtonStyle}
                >
                  🗺️ Open in Google Maps
                </a>

              </div>

            </Popup>
          </Marker>

          {/* LOCAL PLACES */}

          {filteredPlaces.map((place) => (

            <Marker
              key={`${place.name}-${place.position.join("-")}`}
              position={place.position}
              icon={markerIcon}
            >

              <Popup>

                <div className="min-w-[230px]">

                  <div className="text-2xl">
                    {place.icon}
                  </div>

                  <h3 className="mt-2 font-bold">
                    {place.name}
                  </h3>

                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-purple-600">
                    {place.type}
                  </p>

                  <p className="mt-2 text-sm leading-5 text-slate-600">
                    {place.description}
                  </p>

                  <a
                    href={googleMapsUrl(place.position)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={googleButtonStyle}
                  >
                    🗺️ Open in Google Maps
                  </a>

                </div>

              </Popup>

            </Marker>

          ))}

        </MapContainer>

        {/* API ERROR MESSAGE */}

        {error && (
          <div className="absolute left-4 top-4 z-[1000] rounded-xl border border-yellow-200 bg-white/95 px-4 py-3 text-sm shadow-lg backdrop-blur">

            <p className="font-bold text-yellow-700">
              ⚠️ Local places could not be loaded
            </p>

            <p className="mt-1 text-xs text-slate-500">
              The map is still available.
            </p>

          </div>
        )}

        {/* LOADING MESSAGE */}

        {loading && (
          <div className="absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2 rounded-xl bg-white/95 px-4 py-2 text-xs font-bold text-slate-600 shadow-lg backdrop-blur">
            🗺️ Loading local places...
          </div>
        )}

      </div>

      {/* BOTTOM */}

      <div className="border-t border-slate-200 bg-slate-50 p-5">

        <div className="flex items-center justify-between">

          <p className="text-sm font-bold text-slate-700">
            Showing
          </p>

          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-black text-purple-700">
            {filteredPlaces.length} places
          </span>

        </div>

        <div className="mt-3 flex flex-wrap gap-2">

          {filters.slice(1).map((item) => (

            <button
              key={item.name}
              type="button"
              onClick={() => setFilter(item.name)}
              className={`rounded-lg px-3 py-2 text-xs font-bold shadow-sm transition ${
                filter === item.name
                  ? "bg-purple-600 text-white"
                  : "bg-white text-slate-600 hover:bg-purple-50"
              }`}
            >
              {item.icon} {item.name}
            </button>

          ))}

        </div>

      </div>

    </div>
  );
}