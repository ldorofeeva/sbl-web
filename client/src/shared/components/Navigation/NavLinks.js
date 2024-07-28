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
        {/*{auth.isLoggedIn &&*/}
        {/*<li>*/}
        {/*    <NavLink to={`/beers`}>MY PLACES</NavLink>*/}
        {/*</li>*/}
        {/*}*/}
        {auth.isLoggedIn &&
        <li>
            <NavLink to="/beers/new">ADD BEER</NavLink>
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