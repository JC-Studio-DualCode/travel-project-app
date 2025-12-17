import Navbar from "./components/Navbar"
import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import CityDetailsPage from "./pages/CityDetailsPage"
import CityListPage from "./pages/CityListPage"
import AddCityPage from "./pages/AddCityPage"
import AboutPage from "./pages/AboutPage"
import NotFoundPage from "./pages/NotFoundPage"
import EditCityPage from "./pages/EditCityPage"
import CountryListPage from "./pages/CountryListPage"

function App() {
  return (
    <>
      <Navbar />

   <Routes>
  <Route path="/" element={<HomePage />} />

  <Route path="/countries" element={<CountryListPage />} />
  <Route path="/countries/:country/cities" element={<CityListPage />} />

  <Route
    path="/countries/:country/cities/add"
    element={<AddCityPage />}
  />
  <Route
    path="/countries/:country/cities/:cityId/edit"
    element={<EditCityPage />}
  />
  <Route
    path="/countries/:country/cities/:cityId"
    element={<CityDetailsPage />}
  />

  <Route path="/about" element={<AboutPage />} />
  <Route path="*" element={<NotFoundPage />} />
</Routes>

    </>
  )
}

export default App;
