import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainURL } from "../config/api";
import Loader from "../components/Loader";
import styles from "./EditCityPage.module.css";
import { FiPlus, FiTrash2 } from "react-icons/fi";

function EditCityPage() {
  const { cityId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [averageRating, setAverageRating] = useState("");
  const [country, setCountry] = useState("");
  const [pointsOfInterest, setPointsOfInterest] = useState([{ name: "", url: "" }]);

  // Fetch city data
  useEffect(() => {
    axios
      .get(`${MainURL}/cities/${cityId}.json`)
      .then((res) => {
        const city = res.data;

        if (!city) {
          setLoading(false);
          return;
        }

        setImage(city.image || "");
        setName(city.name || "");
        setDescription(city.description || "");
        setAverageRating(city.averageRating ?? city.averagerating ?? "");
        setCountry(city.country || "");
        setPointsOfInterest(
          city.pointsOfInterest?.length > 0
            ? city.pointsOfInterest
            : [{ name: "", url: "" }]
        );

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [cityId]);

  // Add new POI
  const addPOI = () => {
    setPointsOfInterest([...pointsOfInterest, { name: "", url: "" }]);
  };

  // Remove POI by index
  const removePOI = (index) => {
    setPointsOfInterest(pointsOfInterest.filter((_, i) => i !== index));
  };

  // Update POI
  const updatePOI = (index, field, value) => {
    const newPOIs = [...pointsOfInterest];
    newPOIs[index][field] = value;
    setPointsOfInterest(newPOIs);
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedCity = {
      image,
      name,
      description,
      averageRating: averageRating === "" ? "" : Number(averageRating),
      country,
      pointsOfInterest: pointsOfInterest
        .filter((poi) => poi.name.trim() !== "")
        .map((poi) => ({ name: poi.name.trim(), url: poi.url.trim() })),
    };

    axios
      .patch(`${MainURL}/cities/${cityId}.json`, updatedCity)
      .then(() => navigate(`/countries/${country}/cities/${cityId}`))
      .catch((err) => console.log("Error updating city...", err));
  };

  if (loading) return <Loader />;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Editar ciudad</h1>
        <p className={styles.subtitle}>
          Actualiza la información de la ciudad y guarda los cambios.
        </p>
      </header>

      <section className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.field}>
            Image URL
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </label>

          <label className={styles.field}>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className={styles.field}>
            Country
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </label>

          <label className={styles.field}>
            Average rating
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={averageRating}
              onChange={(e) => setAverageRating(e.target.value)}
            />
          </label>

          <label className={`${styles.field} ${styles.full}`}>
            Description
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>

          {/* Points of Interest */}
          <div className={`${styles.field} ${styles.full}`}>
            <span className={styles.label}>Points of Interest</span>
            {pointsOfInterest.map((poi, index) => (
              <div key={index} className={styles.poiRow}>
                <input
                  type="text"
                  placeholder="POI Name"
                  value={poi.name}
                  onChange={(e) => updatePOI(index, "name", e.target.value)}
                  className={styles.input}
                  required
                />
                <input
                  type="url"
                  placeholder="POI Image URL"
                  value={poi.url}
                  onChange={(e) => updatePOI(index, "url", e.target.value)}
                  className={styles.input}
                />
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removePOI(index)}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn secondary"
              onClick={addPOI}
              style={{ marginTop: "8px" }}
            >
              <FiPlus style={{ marginRight: 4 }} /> Add Point of Interest
            </button>
          </div>

          <div className={styles.actions}>
            <button className="btn primary" type="submit">
              Guardar
            </button>
            <button
              className="btn ghost"
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default EditCityPage;