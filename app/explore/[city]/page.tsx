import CityPageClient from "./CityPageClient";

export function generateStaticParams() {
  return [
    { city: "Amsterdam" },
    { city: "Rotterdam" },
    { city: "The Hague" },
    { city: "Utrecht" },
    { city: "Eindhoven" },
    { city: "Groningen" },
    { city: "Tilburg" },
    { city: "Almere" },
    { city: "Breda" },
    { city: "Nijmegen" },
    { city: "Apeldoorn" },
    { city: "Haarlem" },
    { city: "Arnhem" },
    { city: "Amersfoort" },
    { city: "Hilversum" },
    { city: "Leiden" },
    { city: "Delft" },
    { city: "Enschede" },
    { city: "Zwolle" },
  ];
}

export default function CityPage() {
  return <CityPageClient />;
}
