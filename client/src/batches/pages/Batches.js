import React, {useContext, useState, useEffect} from 'react';
import BatchList from "../components/BatchList";

import Button from "../../shared/components/FormElements/Button";

import {AuthContext} from "../../shared/context/auth-context";
import {useHttpClient} from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";


const Batches = () => {
    const auth = useContext(AuthContext);

    const [loadedBatches, setLoadedBatches] = useState([]);

    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    useEffect(() => {
        const getBatches = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/batches`
                );
                console.log(responseData);

                setLoadedBatches(responseData);
            } catch (err) {
                console.log(err);

            }
        };
        getBatches();
    }, [sendRequest, setLoadedBatches]);

    const batchDeletedHandler = deletedBatchId => {
        setLoadedBatches(prevLoadedBatches => {
                console.log("Prev Loaded Batches");
                console.log(prevLoadedBatches);
                return prevLoadedBatches.filter(batch => batch.id !== deletedBatchId)
            }
        );
        console.log(loadedBatches)
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            {isLoading && (
                <div className="center">
                    <LoadingSpinner asOverlay/>
                </div>)}
            {loadedBatches &&
                <BatchList items={loadedBatches} onDelete={batchDeletedHandler}/>
            }
            {auth.isLoggedIn &&
            <div className="center">
                <Button nice to={`/batches/new`}>NEW</Button>
            </div>
            }
        </React.Fragment>
);
};

export default Batches;