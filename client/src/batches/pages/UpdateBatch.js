import React, {useEffect, useState, useContext} from 'react';
import { useParams, useHistory } from 'react-router-dom';

import uiSchema from "../../shared/components/UIElements/UISchemas"
import "../../shared/components/UIElements/Form.css"
import Card from "../../shared/components/UIElements/Card";
import {useHttpClient} from "../../shared/hooks/http-hook";
import {useGetter} from "../../shared/hooks/getters-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {AuthContext} from "../../shared/context/auth-context";

import {withTheme} from '@rjsf/core';
import {Theme as Bootstrap4Theme} from '@rjsf/bootstrap-4';
import validator from '@rjsf/validator-ajv8';

const Form = withTheme(Bootstrap4Theme);

const UpdateBatch = () => {
    const batchId = useParams().batchId;

    const auth = useContext(AuthContext);
    const history = useHistory();

    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const {batchSchema} = useGetter();

    const [formData, setFormData] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const [identifiedBatch, setIdentifiedBatch] = useState();

    const {properties} = batchSchema
    const {beerName, number, ...batchUpdateProperties} = properties
    batchSchema.properties = batchUpdateProperties

    useEffect(() => {
        const getBatches = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/batches/${batchId}`,
                    "GET",
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    }
                );
                console.log(responseData);
                console.log(responseData.id)
                setIdentifiedBatch(responseData.id);
                const {id, beerName, number, ...batchDetails} = responseData
                setFormData(batchDetails);
            } catch(err) {
                console.log(err);
            }
        };
        getBatches();
    }, [sendRequest, batchId, setFormData]);

    const batchSubmitHandler = async event => {
        console.log(formData)
        try {
            const responseData = await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/batches/${batchId}`,
                'PATCH',
                JSON.stringify(formData),
                {
                    Authorization: 'Bearer ' + auth.token,
                    'Content-Type': 'application/json',
                }
            );
            if (responseData !== undefined) {
                setSubmitted(true)
            }
            console.log(responseData);
            history.push(`/batches`);
        } catch (err) {
            console.log(err);
        }
    };


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
            {!submitted && !isLoading && !error &&
                <Form
                    schema={batchSchema}
                    uiSchema={uiSchema("Edit batch")}
                    formData={formData}
                    onChange={(e) => setFormData(e.formData)}
                    onSubmit={batchSubmitHandler}
                    validator={validator}
                />}
            {submitted && !isLoading &&
                <div className="center">
                    <Card>
                        <h2>Success!</h2>
                    </Card>
                </div>
            }
        </React.Fragment>
    );
};

export default UpdateBatch;
