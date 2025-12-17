import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MainURL } from "../config/api";
import Loader from "../components/Loader";

function CountryListPage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${MainURL}/cities.json`)
      .then((res) => {
        const citiesObj = res.data || {};
        const uniqueCountries = [
          ...new Set(Object.values(citiesObj).map((city) => city.country)),
        ];
        setCountries(uniqueCountries);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="countryListPage">
      <h1>Countries</h1>
      <div className="countryGrid">
        {countries.map((country) => (
          <Link
            key={country}
            to={`/countries/${country}/cities`}
            className="countryCard"
          >
            <h3>{country}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CountryListPage;
