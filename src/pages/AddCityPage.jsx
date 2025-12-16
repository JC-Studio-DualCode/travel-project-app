import axios from "axios";
import { useState } from "react";
import { MainURL } from "../config/api";
import { useNavigate } from "react-router-dom";


function AddCityPage(props) {

  const [image, setImage] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [averagerating, setAveragerating] = useState("")
  const [country, setCountry] = useState("")

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    const newCity = {
      image: image,
      name: name,
      description: description,
      averagerating: averagerating,
      country: country,
    }

        axios.post(`${MainURL}/cities.json`, newCity)
            .then(() => {
              navigate("/")
                 
                setImage("")
                setName("")
                setDescription("")
                setAveragerating("")
                setCountry("")
            })
            .catch(e => console.log("Error creating a new City...", e));
    }

    return (
        <div className="Addcity">
            <h3>Add New City</h3>

            <form onSubmit={handleSubmit}>
                <label>
                    Image:
                    <input
                        type="url"
                        name="image"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    />
                </label>
                  <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>

                <label>
                    Description:
                    <textarea
                        type="text"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
                 <label>
                   Average Rating:
                    <input
                        type="number"
                        name="rating"
                        value={averagerating}
                        onChange={(e) => setAveragerating(e.target.value)}
                    />
                </label>
                 <label>
                    Country:
                    <input
                        type="text"
                        name="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </label>

                <button type="submit">Add City</button>

            </form>
        </div>
    )
import styles from "./AddCityPage.module.css";

function AddCityPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Añadir ciudad</h1>
        <p className={styles.subtitle}>
          Completa el formulario para añadir una nueva ciudad
        </p>
      </header>

      <section className={styles.card}>
        <p className={styles.placeholder}>
          Aquí irá el formulario para añadir la ciudad.
        </p>
      </section>
    </div>
  );
}

export default AddCityPage;
