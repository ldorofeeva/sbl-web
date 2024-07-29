import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import "../../shared/components/UIElements/Form.css"
import Card from "../../shared/components/UIElements/Card";
import {useHttpClient} from "../../shared/hooks/http-hook";
import {camelCaseToWords} from "../../shared/util/string-operators"
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Button from "../../shared/components/FormElements/Button";

const BeerDetails = () => {
    const beerId = useParams().beerId;

    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const [identifiedBeer, setIdentifiedBeer] = useState();

    useEffect(() => {
        const getBeer = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/beers/${beerId}`,
                    "GET",
                    null
                );
                console.log(responseData);
                console.log(responseData.name)
                setIdentifiedBeer(responseData);
            } catch (err) {
                console.log(err);
            }
        };
        getBeer();
    }, [sendRequest, beerId]);

    if (!identifiedBeer && !error) {
        return (
            <div className="center">
                <Card>
                    <h2>Could not find beer {beerId}!</h2>
                </Card>
            </div>
        );
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            {isLoading && (
                <div className="center">
                    <LoadingSpinner asOverlay/>
                </div>)}
            {!isLoading && !error &&
                <div className="list">
                    <Card className="item__content">
                        <div className="item__info">
                            <h2>{identifiedBeer.name}</h2>
                            <h3># Batches: {identifiedBeer.batches.length}</h3>
                            <ul>
                                {
                                    Object.entries(identifiedBeer).map(([k, v]) => {
                                        return (
                                            <React.Fragment>
                                                {k !== 'name' && k !== 'batches' &&
                                                    <p align={'left'}>{camelCaseToWords(k)} : {v.toString()}</p>
                                                }
                                            </React.Fragment>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                        <div className="item__actions">
                            <Button to={`/beers`}>BACK</Button>
                        </div>
                    </Card>
                </div>
            }
        </React.Fragment>
    );
};

export default BeerDetails;
