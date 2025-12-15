import { Link } from "react-router-dom";

function CitiesList({ cities }) {
  return (
    <section className="cities">
      {cities.map((city) => (
        <Link key={city.id} to={`/cities/${city.slug}`} className="city-card">
          <h3>{city.name}</h3>
          <p>{city.description}</p>
          <span className="cta">Ver detalles →</span>
        </Link>
      ))}
    </section>
  );
}

export default CitiesList;
