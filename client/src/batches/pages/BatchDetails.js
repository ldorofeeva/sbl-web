import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import "../../shared/components/UIElements/Form.css"
import Card from "../../shared/components/UIElements/Card";
import {useHttpClient} from "../../shared/hooks/http-hook";
import {camelCaseToWords} from "../../shared/util/string-operators"
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Button from "../../shared/components/FormElements/Button";

const BatchDetails = () => {
    const batchId = useParams().batchId;

    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const [identifiedBatch, setIdentifiedBatch] = useState();

    useEffect(() => {
        const getBatch = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/batches/${batchId}`,
                    "GET",
                    null
                );
                console.log(responseData);
                console.log(responseData.name)
                setIdentifiedBatch(responseData);
            } catch (err) {
                console.log(err);
            }
        };
        getBatch();
    }, [sendRequest, batchId]);

    if (!identifiedBatch && !error) {
        return (
            <div className="center">
                <Card>
                    <h2>Could not find batch {batchId}!</h2>
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
                            <h2>{identifiedBatch.beerName} # {identifiedBatch.number}</h2>
                            <h3>Size: {identifiedBatch.size} liters</h3>
                            <h3>Date: {identifiedBatch.date}</h3>
                            <ul>
                                {
                                    Object.entries(identifiedBatch).map(([k, v]) => {
                                        return (
                                            <React.Fragment>
                                                {!['beerName', 'number', 'size', 'date', 'id'].includes(k) &&
                                                    <p align={'left'}>{camelCaseToWords(k)} : {v.toString()}</p>
                                                }
                                            </React.Fragment>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                        <div className="item__actions">
                            <Button to={`/batches`}>BACK</Button>
                        </div>
                    </Card>
                </div>
            }
        </React.Fragment>
    );
};

export default BatchDetails;
