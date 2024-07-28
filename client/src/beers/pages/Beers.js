import React, {useState, useEffect} from 'react';
import BeerList from "../components/BeerList";
// For dynamic segments
import {useParams} from 'react-router-dom';
import {useHttpClient} from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";


const Beers = () => {
    // const uId = useParams().uId;

    const [loadedBeers, setLoadedBeers] = useState([]);

    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    useEffect(() => {
        const getBeers = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/beers`
                );
                console.log(responseData);

                setLoadedBeers(responseData);
            } catch (err) {
                console.log(err);

            }
        };
        getBeers();
    }, [sendRequest, setLoadedBeers]);

    const beerDeletedHandler = deletedBeerName => {
        setLoadedBeers(prevLoadedBeers => {
                console.log("Prev Loaded Beers");
                console.log(prevLoadedBeers);
                return prevLoadedBeers.filter(beer => beer.name !== deletedBeerName)
            }
        );
        console.log(loadedBeers)
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            {isLoading && (
                <div className="center">
                    <LoadingSpinner asOverlay/>
                </div>)}
            {loadedBeers &&
             <BeerList items={loadedBeers} onDelete={beerDeletedHandler}/>
            }
        </React.Fragment>
    );
};

export default Beers;