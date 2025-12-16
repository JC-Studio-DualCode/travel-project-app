import Navbar from "./components/Navbar"
import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import CityDetailsPage from "./pages/CityDetailsPage"
import CityListPage from "./pages/CityListPage"
import AddCityPage from "./pages/AddCityPage"
import AboutPage from "./pages/AboutPage"
import NotFoundPage from "./pages/NotFoundPage"
import EditCityPage from "./pages/EditCityPage"


function App() {
  return (
    <>
      <h1>CityVerse</h1>

      <Navbar  />
       
    <Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/cities" element={<CityListPage />} />
  <Route path="/cities/:cityId" element={<CityDetailsPage />} />
  <Route path="/cities/:cityId/edit" element={<EditCityPage />} />
  <Route path="/addnewcity" element={<AddCityPage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="*" element={<NotFoundPage />} />
</Routes>



    </>
  )
}

export default App;
