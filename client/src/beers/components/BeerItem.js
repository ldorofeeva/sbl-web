// So the we could use JSX
import React, {useState, useContext} from 'react';

import "./BeerItem.css"

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import {AuthContext} from "../../shared/context/auth-context";
import {useHttpClient} from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const BeerItem = props => {
    const auth = useContext(AuthContext);

    const [showConfirm, setShowConfirm] = useState(false)

    const openConfirmHandler = () =>{
        setShowConfirm(true);
    };
    const closeConfirmHandler = () => {
        setShowConfirm(false);
    };

    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const confirmDeleteHandler = async () => {
        try {
            setShowConfirm(false);
            const responseData = await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/beers/${props.name}`,
                'DELETE',
                null,
                {
                    Authorization: 'Bearer ' + auth.token
                }
            );
            console.log(responseData);
            props.onDelete(props.name);
        } catch(err) {
            console.log(err);
        }
    };
    return (
        // Fragment is a way to return more that one root html/JSX element
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            {isLoading && (
                <div className="center">
                    <LoadingSpinner asOverlay/>
                </div>)}

            <Modal
                show={showConfirm}
                onCancel={closeConfirmHandler}
                header={"Are you sure?"}
                contentCalss="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={
                    <React.Fragment>
                        <Button inverse onClick={closeConfirmHandler}>CANCEL</Button>
                        <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
                    </React.Fragment>
                }
            >
                <p>Do you want to delete?</p>
            </Modal>
            <li className="place-item">
                <Card className="place-item__content">
                    {/*<Link to={`/${props.id}`}>*/}
                    <div className="place-item__info">
                        <h2>{props.name}</h2>
                        <h3>{props.hops}</h3>
                        <p>{props.malts}</p>
                    </div>
                    <div className="place-item__actions">
                        <Button nice to={`/beers/${props.name}/details`}>DETAILS</Button>
                        {auth.isLoggedIn && <Button to={`/beers/${props.name}`}>EDIT</Button>}
                        {auth.isLoggedIn && <Button danger onClick={openConfirmHandler}>DELETE</Button>}
                    </div>
                    {/*</Link>*/}
                </Card>

            </li>
        </React.Fragment>
    )
};

export default BeerItem;