import React, {useEffect, useState, useContext} from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../shared/util/validators";
import "./PlaceForm.css"
import {useForm} from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card";
import {useHttpClient} from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {AuthContext} from "../../shared/context/auth-context";


const UpdatePlace = () => {
    const placeId = useParams().placeId;

    const auth = useContext(AuthContext);
    const history = useHistory();


    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            }
        },
        true
    );

    //const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);
    const [identifiedPlace, setIdentifiedPlace] = useState();

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    useEffect(() => {
        const getPlaces = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
                    "GET",
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    }
                );
                console.log(responseData);

                setIdentifiedPlace(responseData.place);
                setFormData(
                    {
                        title: {
                            value: responseData.place.title,
                            isValid: true
                        },
                        description: {
                            value: responseData.place.description,
                            isValid: true
                        }
                    },
                    true
                );
            } catch(err) {
                console.log(err);
            }
        };
        getPlaces();
    }, [sendRequest, placeId, setFormData]);

    const placeSubmitHandler = async event => {
        event.preventDefault();
        try {
            const responseData = await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
                'PATCH',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                }),
                {
                    Authorization: 'Bearer ' + auth.token,
                    'Content-Type': 'application/json'
                }
            );

            console.log(responseData);
            history.push(`/${auth.userId}/places`);
        } catch(err) {
            console.log(err);
        }
    };

    if (!identifiedPlace && !error) {
        return (
            <div className="center">
                <Card>
                    <h2>Could not find place!</h2>
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
            {!isLoading && identifiedPlace && (
                <form className="place-form" onSubmit={placeSubmitHandler}>
                    <Input
                        id="title"
                        element="input"
                        type="text"
                        label="Title"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a valid title."
                        onInput={inputHandler}

                        initialValue={identifiedPlace.title}
                        initialValid={true}
                    />
                    <Input
                        id="description"
                        element="textarea"
                        label="Description"
                        validators={[VALIDATOR_MINLENGTH(5)]}
                        errorText="Please enter a valid description (min. 5 characters)."
                        onInput={inputHandler}

                        initialValue={identifiedPlace.description}
                        initialValid={true}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        UPDATE PLACE
                    </Button>
                </form>)
            };
        </React.Fragment>
    );
};

export default UpdatePlace;
