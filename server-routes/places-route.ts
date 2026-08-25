import { NextResponse } from "next/server";

const municipalities: Record<
  string,
  { lat: number; lng: number }
> = {
  Hilversum: {
    lat: 52.2292,
    lng: 5.1767,
  },
  Amsterdam: {
    lat: 52.3676,
    lng: 4.9041,
  },
  Utrecht: {
    lat: 52.0907,
    lng: 5.1214,
  },
  Rotterdam: {
    lat: 51.9244,
    lng: 4.4777,
  },
  "The Hague": {
    lat: 52.0705,
    lng: 4.3007,
  },
};

const categories = [
  {
    type: "Municipality",
    icon: "🏛️",
    googleType: "city_hall",
  },
  {
    type: "Healthcare",
    icon: "🏥",
    googleType: "hospital",
  },
  {
    type: "Transport",
    icon: "🚆",
    googleType: "train_station",
  },
  {
    type: "Police",
    icon: "👮",
    googleType: "police",
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const municipalityName =
      searchParams.get("municipality");

    console.log(
      "REQUESTED MUNICIPALITY:",
      municipalityName
    );

    if (!municipalityName) {
      return NextResponse.json(
        { error: "Municipality is required" },
        { status: 400 }
      );
    }

    const municipality =
      municipalities[municipalityName];

    if (!municipality) {
      return NextResponse.json(
        {
          error: `Unknown municipality: ${municipalityName}`,
        },
        { status: 404 }
      );
    }

    const apiKey =
      process.env.GOOGLE_MAPS_API_KEY;

    console.log(
      "GOOGLE KEY EXISTS:",
      Boolean(apiKey)
    );

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "GOOGLE_MAPS_API_KEY is missing from .env.local",
        },
        { status: 500 }
      );
    }

    const allPlaces = [];

    for (const category of categories) {
      console.log(
        "SEARCHING:",
        category.type
      );

      const response = await fetch(
        "https://places.googleapis.com/v1/places:searchNearby",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,

            "X-Goog-FieldMask":
              "places.displayName,places.location,places.formattedAddress,places.googleMapsUri",
          },

          body: JSON.stringify({
            includedTypes: [
              category.googleType,
            ],

            maxResultCount: 5,

            locationRestriction: {
              circle: {
                center: {
                  latitude:
                    municipality.lat,
                  longitude:
                    municipality.lng,
                },

                radius: 5000,
              },
            },

            rankPreference: "DISTANCE",

            languageCode: "en",

            regionCode: "NL",
          }),
        }
      );

      const data = await response.json();

      console.log(
        "GOOGLE RESPONSE:",
        category.type,
        JSON.stringify(data)
      );

      if (!response.ok) {
        console.error(
          "GOOGLE ERROR:",
          category.type,
          data
        );

        continue;
      }

      for (const place of data.places || []) {
        if (!place.location) {
          continue;
        }

        allPlaces.push({
          name:
            place.displayName?.text ||
            "Unknown place",

          type: category.type,

          icon: category.icon,

          position: [
            place.location.latitude,
            place.location.longitude,
          ],

          description:
            place.formattedAddress ||
            `${category.type} in ${municipalityName}`,

          googleMapsUri:
            place.googleMapsUri || null,
        });
      }
    }

    console.log(
      "TOTAL PLACES:",
      allPlaces.length
    );

    return NextResponse.json({
      municipality: municipalityName,
      places: allPlaces,
    });
  } catch (error) {
    console.error(
      "PLACES ROUTE CRASH:",
      error
    );

    return NextResponse.json(
      {
        error:
          "The places API crashed.",
      },
      { status: 500 }
    );
  }
}