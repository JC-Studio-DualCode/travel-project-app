import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CityDetailsPage from "./pages/CityDetailsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cities/:citySlug" element={<CityDetailsPage />} />
    </Routes>
  );
}

export default App;
