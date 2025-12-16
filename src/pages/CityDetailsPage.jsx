import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { MainURL } from "../config/api";


function CityDetailsPage() {
  const { cityId } = useParams();

  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${MainURL}/cities/${cityId}.json`)
      .then((response) => {
        setCity(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching city data:", error);
        setLoading(false);
      });
  }, [cityId]);

  if (loading) {
    return <p style={{ padding: "2rem" }}>Cargando...</p>;
  }

  if (!city) {
    return (
      <div style={{ padding: "2rem" }}>
        <Link to="/">← Volver</Link>
        <h1>Ciudad no encontrada</h1>
      </div>
    );
  }

  const images = city.images || [];

  return (
    <div className="details">
      <Link to="/" className="back">← Volver</Link>

      <h1>{city.name}</h1>
      <p className="details-desc">{city.description}</p>

      <div className="gallery">
        {images.map((url, i) => (
          <img key={i} src={url} alt={`${city.name} ${i + 1}`} />
        ))}
        <img src={city.mainImage} alt={city.name} />
      </div>
    </div>
  );
}

export default CityDetailsPage;
