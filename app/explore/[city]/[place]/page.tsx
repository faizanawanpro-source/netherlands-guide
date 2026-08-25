import PlacePageClient from "./PlacePageClient";

const cities = [
  "amsterdam",
  "rotterdam",
  "the-hague",
  "utrecht",
  "eindhoven",
  "groningen",
  "tilburg",
  "almere",
  "breda",
  "nijmegen",
  "apeldoorn",
  "haarlem",
  "arnhem",
  "amersfoort",
  "hilversum",
  "leiden",
  "delft",
  "enschede",
  "zwolle",
];

const places = [
  "rijksmuseum",
  "van-gogh-museum",
  "anne-frank-house",
  "dam-square",
  "vondelpark",
  "red-light-district",
  "jordaan",
  "a-dam-lookout",
  "euromast",
  "markthal",
  "cube-houses",
  "kinderdijk",
  "dom-tower",
  "central-museum",
];

export function generateStaticParams() {
  return cities.flatMap((city) =>
    places.map((place) => ({
      city,
      place,
    }))
  );
}

export default function PlacePage() {
  return <PlacePageClient />;
}
