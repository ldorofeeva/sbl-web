import React, {useEffect, useState, useContext} from 'react';
import { useParams, useHistory } from 'react-router-dom';

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

const UpdateBeer = () => {
    const beerId = useParams().beerId;

    const auth = useContext(AuthContext);
    const history = useHistory();

    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const {hops, malts} = useGetter();

    const [formData, setFormData] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const schema = {
        type: 'object',
        additionalProperties: {
            "type": "string"
        },
        properties: {
            name: {
                type: 'string',
                title: 'Name'
            },
            hops: {
                type: 'string',
                title: 'Hop',
                enum: hops
            },
            malts: {
                type: 'string',
                title: 'Base Malt',
                enum: malts

            },
        },
    };

    const uiSchema = {
        "ui:options": {
            "title": "Add a new beer",
            "classNames": "form form-group form-control",
        },
        'ui:globalOptions': {copyable: true},
        'ui:style': {
            'html': {
                'font-family': "'Open Sans', sans-serif"
            }
        },
        'title': {
            "classNames": "input"
        },
    }
    const [identifiedBeer, setIdentifiedBeer] = useState();

    useEffect(() => {
        const getBeers = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/beers/${beerId}`,
                    "GET",
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    }
                );
                console.log(responseData);
                console.log(responseData.name)
                setIdentifiedBeer(responseData.name);
                setFormData(responseData);
            } catch(err) {
                console.log(err);
            }
        };
        getBeers();
    }, [sendRequest, beerId, setFormData]);

    const beerSubmitHandler = async event => {
        console.log(formData)
        try {
            const responseData = await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/beers/${beerId}`,
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
            history.push(`/beers`);
        } catch (err) {
            console.log(err);
        }
        //console.log(formState.inputs); // send this to the backend!
    };


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
            {!submitted && !isLoading && !error &&
                <Form
                    schema={schema}
                    uiSchema={uiSchema}
                    formData={formData}
                    onChange={(e) => setFormData(e.formData)}
                    onSubmit={beerSubmitHandler}
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
        // {isLoading && (
        //     <div className="center">
        //       <LoadingSpinner asOverlay/>
        //     </div>)}
        //     {!isLoading && identifiedBeer && (
        //         <form className="place-form" onSubmit={placeSubmitHandler}>
        //             <Input
        //                 id="name"
        //                 element="input"
        //                 type="text"
        //                 label="Title"
        //                 validators={[VALIDATOR_REQUIRE()]}
        //                 errorText="Please enter a valid title."
        //                 onInput={inputHandler}
        //
        //                 initialValue={identifiedBeer.name}
        //                 initialValid={true}
        //             />
        //             {/*<Input*/}
        //             {/*    id="description"*/}
        //             {/*    element="textarea"*/}
        //             {/*    label="Description"*/}
        //             {/*    validators={[VALIDATOR_MINLENGTH(5)]}*/}
        //             {/*    errorText="Please enter a valid description (min. 5 characters)."*/}
        //             {/*    onInput={inputHandler}*/}
        //
        //             {/*    initialValue={identifiedBeer.description}*/}
        //             {/*    initialValid={true}*/}
        //             {/*/>*/}
        //             <Button type="submit" disabled={!formState.isValid}>
        //                 UPDATE BEER
        //             </Button>
        //         </form>)
        //     };
        // </React.Fragment>
    );
};

export default UpdateBeer;
