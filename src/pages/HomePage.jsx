import CitiesList from "../components/CitiesList";
import { mockCities } from "../data/mockCities";


function HomePage() {
  return (
    <div className="home">
      <header className="home-header">
        <h1>CityVerse 🌍</h1>
        <p>Explora ciudades, mira fotos y guarda tus favoritas.</p>
        <p className="hint">Selecciona una ciudad para comenzar</p>
      </header>

      <CitiesList cities={mockCities} />
    </div>
  );
}

export default HomePage;
