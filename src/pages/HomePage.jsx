import CityListPage from "./CityListPage"
import { FcGlobe } from "react-icons/fc";
 

function HomePage() {
  return (
    <div className="home">
      <header className="home-header">
        <h1>CityVerse <FcGlobe/> </h1>
        <p>Explora ciudades, mira fotos y guarda tus favoritas.</p>
        <p className="hint">Selecciona una ciudad para comenzar</p>
      </header>

      <CityListPage  />
    </div>
  );
}

export default HomePage;
