import { NavLink } from "react-router-dom"


function Navbar() {
    return (
        <>
            
            
            <nav className="navbar">
                <NavLink to="/">
                    <button>Home</button>
                </NavLink>

                <NavLink to="/about">
                    <button>About</button>
                </NavLink>

                <NavLink to="/cities/add">
                    <button>Add New City</button>
                </NavLink>
            </nav>
        </>
    )
}

export default Navbar
