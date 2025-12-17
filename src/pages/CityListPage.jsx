import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainURL } from "../config/api";
import Loader from "../components/Loader";

function CityListPage() {
  const { country } = useParams();

  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${MainURL}/cities.json`)
      .then((res) => {
        const citiesObj = res.data || {};
        const filteredCities = Object.entries(citiesObj)
          .filter(([_, city]) => city.country === country)
          .map(([id, city]) => ({ id, ...city }));
        setCities(filteredCities);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [country]);

  if (loading) return <Loader />;

  return (
    <div className="cityListPage">
      <h1>Cities in {country}</h1>

      <Link to={`/countries/${country}/cities/add`} className="btn primary">
        Add City
      </Link>

      <div className="cityGrid">
        {cities.map((city) => (
          <div key={city.id} className="cityCard">
            <img src={city.image} alt={city.name} />
            <h3>{city.name}</h3>
            <p>{city.description}</p>
            <Link
              to={`/countries/${country}/cities/${city.id}`}
              className="btn ghost"
            >
              View
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CityListPage;
