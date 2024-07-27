// So the we could use JSX
import React, {useState, useContext} from 'react';

import "./PlaceItem.css"

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import {AuthContext} from "../../shared/context/auth-context";
import {useHttpClient} from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const PlaceItem = props => {
    const auth = useContext(AuthContext);

    const [showMap, setShowMap] = useState(false)
    const openMapHandler = () =>{
        setShowMap(true);
    };
    const closeMapHandler = () => {
        setShowMap(false);
    };

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
                `${process.env.REACT_APP_BACKEND_URL}/places/${props._id}`,
                'DELETE',
                null,
                {
                    Authorization: 'Bearer ' + auth.token
                }
            );
            console.log(responseData);
            props.onDelete(props._id);
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
                show={showMap}
                onCancel={closeMapHandler}
                header={props.address}
                contentCalss="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
            >
                <div className="map-container">
                    <Map center={props.coordinates} zoom={16}/>
                </div>
            </Modal>
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
                    <div className="place-item__image">
                        <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title}/>
                    </div>
                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className="place-item__actions">
                        <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                        {auth.isLoggedIn && <Button to={`/places/${props.id}`}>EDIT</Button>}
                        {auth.isLoggedIn && <Button danger onClick={openConfirmHandler}>DELETE</Button>}
                    </div>
                    {/*</Link>*/}
                </Card>

            </li>
        </React.Fragment>
    )
};

export default PlaceItem;