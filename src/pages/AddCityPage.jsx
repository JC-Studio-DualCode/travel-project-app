import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainURL } from "../config/api";

function AddCityPage() {
  const { country } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [averageRating, setAverageRating] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCity = {
      name,
      description,
      image,
      averageRating: Number(averageRating),
      country, // bloqueado
    };

    axios
      .post(`${MainURL}/cities.json`, newCity)
      .then(() => navigate(`/countries/${country}/cities`))
      .catch((err) => console.log("Error adding city", err));
  };

  return (
    <div className="addCityPage">
      <h1>Add City in {country}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Country
          <input type="text" value={country} disabled />
        </label>

        <label>
          City Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Image URL
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label>
          Average Rating
          <input
            type="number"
            step="0.1"
            value={averageRating}
            onChange={(e) => setAverageRating(e.target.value)}
          />
        </label>

        <button type="submit" className="btn primary">
          Add City
        </button>
      </form>
    </div>
  );
}

export default AddCityPage;