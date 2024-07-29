import React, {useContext, useState, useEffect} from 'react';
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import {AuthContext} from "../../shared/context/auth-context";
import {useHttpClient} from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

import {camelCaseToWords} from "../../shared/util/string-operators"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";


const Items = props => {
    const auth = useContext(AuthContext);

    const [loadedItems, setLoadedItems] = useState([]);

    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    useEffect(() => {
        const getItems = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/${props.endpoint}`
                );
                console.log(responseData);

                setLoadedItems(responseData);
            } catch (err) {
                console.log(err);

            }
        };
        getItems();
    }, [sendRequest, setLoadedItems]);

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            {isLoading && (
                <div className="center">
                    <LoadingSpinner asOverlay/>
                </div>)}
            {loadedItems &&
                <div className="list">
                    <Card className="item__content">
                        <ul className="list">
                            {loadedItems.map(item => {
                                return (
                                    <li>
                                        <p>{camelCaseToWords(item.name)}</p>
                                    </li>
                                )
                            })}
                        </ul>
                    </Card>
                </div>
            }
            {auth.isLoggedIn &&
            <div className="center">
                <Button nice to={`/${props.endpoint}/new`}>NEW</Button>
            </div>
            }
        </React.Fragment>
);
};

export default Items;