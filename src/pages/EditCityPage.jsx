import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainURL } from "../config/api";
import Loader from "../components/Loader";

function EditCityPage() {
  const { cityId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [averageRating, setAverageRating] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    axios
      .get(`${MainURL}/cities/${cityId}.json`)
      .then((res) => {
        const city = res.data;

        setImage(city.image || "");
        setName(city.name || "");
        setDescription(city.description || "");
        setAverageRating(city.averageRating || "");
        setCountry(city.country || "");

        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [cityId]);

 
  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedCity = {
      image,
      name,
      description,
      averageRating: Number(averageRating),
      country,
    };

    axios
      .patch(`${MainURL}/cities/${cityId}.json`, updatedCity)
      .then(() => {
        navigate(`/cities/${cityId}`);
      })
      .catch((err) => console.log("Error updating city...", err));
  };

  if (loading) return <Loader />;

  return (
    <div className="editCityPage">
      <h2>Edit City</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Image URL
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </label>

        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Country
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
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
          Average rating
          <input
            type="number"
            step="0.1"
            value={averageRating}
            onChange={(e) => setAverageRating(e.target.value)}
          />
        </label>

        <button type="submit">Save changes</button>
      </form>
    </div>
  );
}

export default EditCityPage;
