import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MainURL } from "../config/api";
import Loader from "../components/Loader";



function CityDetailsPage() {
  const [city, setCity] = useState(null);
  const { cityId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${MainURL}/cities/${cityId}.json`)
      .then((res) => setCity(res.data))
      .catch((err) => console.log(err));
  }, [cityId]);

  const deleteCity = () => {
    axios
      .delete(`${MainURL}/cities/${cityId}.json`)
      .then(() => navigate("/cities"))
      .catch((err) => console.log(err));
  };

  if (!city) return <Loader />;

  return (
    <div className="cityDetailsPage">
      <img src={city.image} alt={city.name} />
      <h1>{city.name}</h1>
      <h3>{city.country}</h3>

      <p>{city.description}</p>

      <p>⭐ {city.averageRating}</p>

     
      <h4>Points of interest</h4>
      <ul>
        {city.pointsOfInterest?.map((poi, index) => (
          <li key={index}>{poi}</li>
        ))}
      </ul>

      
      <h4>Reviews</h4>
      {city.reviews?.map((review, index) => (
        <div key={index}>
          <strong>{review.user}</strong> ⭐ {review.rating}
          <p>{review.comment}</p>
        </div>
      ))}

      <Link to={`/cities/${cityId}/edit`}>
        <button>Edit</button>
      </Link>

      <button onClick={deleteCity}>Delete</button>

      <Link to="/cities">
        <button>Back to cities</button>
      </Link>
    </div>
  );
}

export default CityDetailsPage;