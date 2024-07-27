import React, {useEffect, useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH, VALIDATOR_MAXLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import './NewPlace.css';
import '../../shared/components/FormElements/Button.css'
import '../../shared/components/FormElements/Input.css'
import {useHttpClient} from "../../shared/hooks/http-hook";
import {AuthContext} from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import {withTheme} from '@rjsf/core';
import {Theme as Bootstrap4Theme} from '@rjsf/bootstrap-4';

// import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
// import {RJSFSchema} from 'rjsf/utils';

const Form = withTheme(Bootstrap4Theme);


const NewPlace = () => {
    const auth = useContext(AuthContext);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const history = useHistory();
    const [formData, setFormData] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [beers, setBeers] = useState(["Bubba Beer", "Hali Gali"])

    const schema = {
        type: 'object',
        additionalProperties: {
            "type": "string"
        },
        properties: {
            title: {
                type: 'string',
                title: 'Title'
            },
            description: {
                type: 'string',
                title: 'Description'
            },
            beer: {
                type: 'string',
                title: 'Beer',
                enum: beers

            },
        },
    };

    const uiSchema = {
        "ui:options": {
            "title": "Add a new beer",
            "classNames": "place-form form-group form-control",
            // "submitButtonOptions": {
            //     "props": {
            //         "disabled": false,
            //         "className": "btn btn-info"
            //     },
            //     "norender": false,
            //     "submitText": "Submit"
            // }
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
        'description': {
            'ui:options': {
                widget: 'textarea',
                rows: 10,
            }
        },
        // 'beer': {
        //     "ui:widget": "radio",
        // }
    }

    // useEffect(() => {
    //     const getBeers = async () => {
    //         try {
    //             const responseData = await sendRequest(
    //                 `${process.env.REACT_APP_BACKEND_URL}/users/`,
    //                 "GET",
    //                 null,
    //                 {
    //                     Authorization: 'Bearer ' + auth.token
    //                 }
    //             );
    //             console.log(responseData);
    //
    //             setBeers([
    //                 responseData.map(result => result.name)
    //             ])
    //
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     };
    //     getBeers();
    // }, [sendRequest, setBeers]);

    const placeSubmitHandler = async event => {
        console.log(formData)
        try {
            const responseData = await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/places`,
                'POST',
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
            history.push(`/${auth.userId}/places`);
        } catch(err) {
            console.log(err);
        }
        //console.log(formState.inputs); // send this to the backend!
    };

    return (
        <Form
                    schema={schema}
                    uiSchema={uiSchema}
                    formData={formData}
                    onChange={(e) => setFormData(e.formData)}
                    onSubmit={placeSubmitHandler}
                    validator={validator}
                />

    );
};

export default NewPlace;
