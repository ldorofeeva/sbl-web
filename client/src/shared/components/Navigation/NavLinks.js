import React, {useContext} from 'react';
import {NavLink} from 'react-router-dom';
import "./NavLinks.css"
import {AuthContext} from "../../context/auth-context";

const NavLinks = props => {
    const auth = useContext(AuthContext);
    return <ul className="nav-links">
        <li>
            <NavLink to="/" exact>BEERS</NavLink>
        </li>
        <li>
            <NavLink to="/batches" exact>BATCHES</NavLink>
        </li>
        {auth.isLoggedIn &&
            <li>
                <NavLink to="/malts" exact>MALTS</NavLink>
            </li>
        }
        {auth.isLoggedIn &&
            <li>
                <NavLink to="/hops" exact>HOPS</NavLink>
            </li>
        }
        {!auth.isLoggedIn &&
            <li>
                <NavLink to="/auth">AUTHENTICATE</NavLink>
            </li>
        }
        {auth.isLoggedIn &&
            <li>
                <button onClick={auth.logout}>LOGOUT</button>
            </li>
        }
    </ul>
};

export default NavLinks;