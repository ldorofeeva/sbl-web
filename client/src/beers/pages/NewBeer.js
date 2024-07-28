import React, {useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';


import '../../shared/components/UIElements/Form.css';
import '../../shared/components/FormElements/Button.css'
import '../../shared/components/FormElements/Input.css'
import {useHttpClient} from "../../shared/hooks/http-hook";
import {useGetter} from "../../shared/hooks/getters-hook";
import {AuthContext} from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import {withTheme} from '@rjsf/core';
import {Theme as Bootstrap4Theme} from '@rjsf/bootstrap-4';
import validator from '@rjsf/validator-ajv8';
import Card from "../../shared/components/UIElements/Card";

const Form = withTheme(Bootstrap4Theme);


const NewBeer = () => {
    const auth = useContext(AuthContext);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const {hops, malts} = useGetter();
    const history = useHistory();
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


    const beerSubmitHandler = async event => {
        console.log(formData)
        try {
            const responseData = await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/beers`,
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
            history.push(`/beers`);
        } catch(err) {
            console.log(err);
        }
        //console.log(formState.inputs); // send this to the backend!
    };

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
    );
};

export default NewBeer;
