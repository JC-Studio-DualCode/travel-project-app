import { useParams, Link } from "react-router-dom";

const mockCities = [
  { id: 1, name: "Pekín", slug: "pekin", description: "Muralla, templos y caos bonito." },
  { id: 2, name: "Shanghái", slug: "shanghai", description: "Skyline, comida y neón." },
  { id: 3, name: "Tokio", slug: "tokio", description: "Tradición + futuro en 4K." },
  { id: 4, name: "Madrid", slug: "madrid", description: "Tapeo, planes y callejeo." }
];

function CityDetailsPage() {
  const { citySlug } = useParams();

  const city = mockCities.find((c) => c.slug === citySlug);

  if (!city) return <p>Ciudad no encontrada</p>;

  return (
    <div>
      <Link to="/">← Volver</Link>
      <h1>{city.name}</h1>
      <p>{city.description}</p>
    </div>
  );
}

export default CityDetailsPage;
