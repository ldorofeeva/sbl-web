import React, {useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';

import '../../shared/components/UIElements/Form.css';
import '../../shared/components/FormElements/Button.css'
import '../../shared/components/FormElements/Input.css'
import {useHttpClient} from "../../shared/hooks/http-hook";
import {AuthContext} from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import uiSchema from "../../shared/components/UIElements/UISchemas"

import {withTheme} from '@rjsf/core';
import {Theme as Bootstrap4Theme} from '@rjsf/bootstrap-4';
import validator from '@rjsf/validator-ajv8';
import Card from "../../shared/components/UIElements/Card";

const Form = withTheme(Bootstrap4Theme);


const NewItem = props => {
    const simpleSchema = {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                title: 'Name'
            }
        }
    }

    const auth = useContext(AuthContext);

    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const history = useHistory();
    const [formData, setFormData] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const itemSubmitHandler = async event => {
        console.log(formData)
        try {
            const responseData = await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/${props.endpoint}`,
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
            history.push(`/${props.endpoint}`);
        } catch (err) {
            console.log(err);
        }
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
                    schema={simpleSchema}
                    uiSchema={uiSchema(`Add new item to ${props.endpoint}`)}
                    formData={formData}
                    onChange={(e) => setFormData(e.formData)}
                    onSubmit={itemSubmitHandler}
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

export default NewItem;