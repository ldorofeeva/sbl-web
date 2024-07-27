import React, {Suspense, useState, useCallback, useEffect} from 'react';

import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';

//import Users from "./users/pages/Users";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces";
import NewPlace from "./places/pages/NewPlace";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./users/pages/Auth";
import {AuthContext} from "./shared/context/auth-context";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";

// Alternative to not load all at once, but only upon requirement/when rendering
// Part 1 of 2
const Users = React.lazy(() => import("./users/pages/Users"));

let logoutTimer;

function App() {
    // Executed top to bottom, redirect redirects after rendering unless wrapped with switch
    const [userId, setUserId] = useState(false);
    const [token, setToken] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState(null);

    const login = useCallback((uid, token, expirationDate) => {
        setToken(token);
        setUserId(uid);

        const tokenExpDate = expirationDate || new Date(new Date().getTime() + 1000*60*60);
        console.log(tokenExpDate);
        setTokenExpirationDate(tokenExpDate);
        console.log(JSON.stringify({
                userId: uid,
                token: token,
                expiration: tokenExpDate.toISOString()
            }));
        localStorage.setItem(
            'userData',
            JSON.stringify({
                userId: uid,
                token: token,
                expiration: tokenExpDate.toISOString()
            }));
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setTokenExpirationDate(null);
    }, []);

    useEffect(() => {
        if (token && tokenExpirationDate) {
            logoutTimer = setTimeout(logout, tokenExpirationDate.getTime() - new Date().getTime());
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpirationDate]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
            console.log(storedData);
            login(storedData.userId, storedData.token, new Date(storedData.expiration))
        }
    }, [login]);

    let routes;

    if (token) {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <Users/>
                </Route>
                <Route path="/:uId/places" exact>
                    <UserPlaces/>
                </Route>
                <Route path="/places/new" exact>
                    <NewPlace/>
                </Route>
                <Route path="/places/:placeId" exact>
                    <UpdatePlace/>
                </Route>
                <Redirect to={"/"}/>
            </Switch>
        );
    } else {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <Users/>
                </Route>
                <Route path="/auth" exact>
                    <Auth/>
                </Route>
                <Route path="/:uId/places" exact>
                    <UserPlaces/>
                </Route>
                <Redirect to={"/auth"}/>
            </Switch>
        );
    }
    return (
        <AuthContext.Provider value={{
            isLoggedIn: !!token,
            token: token,
            userId: userId,
            login:login,
            logout:logout}}
        >
            <Router>
                <MainNavigation/>
                <main>
                    {/* Alternative to not load all at once, but only upon requirement/when rendering*/}
                    {/* Part 2 of 2*/}
                    <Suspense fallback={<LoadingSpinner/>}>
                        {routes}
                    </Suspense>
                </main>
            </Router>
        </AuthContext.Provider>);
}

export default App;
