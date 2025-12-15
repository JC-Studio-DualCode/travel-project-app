import { useParams, Link } from "react-router-dom";
import { mockCities } from "../data/mockCities";


function CityDetailsPage() {
  const { citySlug } = useParams();

  const city = mockCities.find((c) => c.slug === citySlug);

  if (!city) {
    return (
      <div style={{ padding: "2rem" }}>
        <Link to="/">← Volver</Link>
        <h1>Ciudad no encontrada</h1>
      </div>
    );
  }

  return (
    <div className="details">
      <Link to="/" className="back">← Volver</Link>

      <h1>{city.name}</h1>
      <p className="details-desc">{city.description}</p>

      <div className="gallery">
        {city.images.map((url, i) => (
          <img key={i} src={url} alt={`${city.name} ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

export default CityDetailsPage;
