// So the we could use JSX
import React, {useState, useContext} from 'react';

import "../../shared/components/UIElements/Item.css"
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import {AuthContext} from "../../shared/context/auth-context";
import {useHttpClient} from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const BatchItem = props => {
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
                `${process.env.REACT_APP_BACKEND_URL}/batches/${props.id}`,
                'DELETE',
                null,
                {
                    Authorization: 'Bearer ' + auth.token
                }
            );
            console.log(responseData);
            props.onDelete(props.id);
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
                contentCalss="item__modal-content"
                footerClass="item__modal-actions"
                footer={
                    <React.Fragment>
                        <Button inverse onClick={closeConfirmHandler}>CANCEL</Button>
                        <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
                    </React.Fragment>
                }
            >
                <p>Do you want to delete?</p>
            </Modal>
            <li className="item">
                <Card className="item__content">
                    <div className="item__info">
                        <h2>{props.id}</h2>
                        <h3>{props.date}</h3>
                        <p>Size: {props.size} liters</p>
                    </div>
                    <div className="item__actions">
                        <Button nice to={`/batches/${props.id}/details`}>DETAILS</Button>
                        {auth.isLoggedIn && <Button to={`/batches/${props.id}`}>EDIT</Button>}
                        {auth.isLoggedIn && <Button danger onClick={openConfirmHandler}>DELETE</Button>}
                    </div>
                </Card>

            </li>
        </React.Fragment>
    )
};

export default BatchItem;