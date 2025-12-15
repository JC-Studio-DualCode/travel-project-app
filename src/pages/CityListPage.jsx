import axios from "axios";
import { useEffect, useState } from "react";
import { MainURL } from "../config/api";
import { Link } from "react-router-dom";

function ProjectListPage() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${MainURL}/cities.json`)
      .then((response) => {
        if (response.data) {
          const citiesArray = Object.keys(response.data).map((id) => ({
            id,
            ...response.data[id],
          }));
          setCities(citiesArray);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error getting Cities from Firebase", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading cities...</p>;

  return (
    <div>
      <h1>City List</h1>

      <div className="city-list">
        {cities.map((city) => (
          <div className="card" key={city.id}>
            <img src={city.image} alt={city.name} />
            <h3>{city.name}</h3>
            <p>{city.description}</p>
            <p>⭐ {city.averagerating}</p>
            <p>{city.country}</p>

            <Link to={`/cities/${city.id}`}>
              <button>More details</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectListPage;