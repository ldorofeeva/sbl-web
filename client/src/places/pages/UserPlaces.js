import React , {useState, useEffect} from 'react';
import PlaceList from "../components/PlaceList";
// For dynamic segments
import {useParams} from 'react-router-dom';
import {useHttpClient} from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";


const UserPlaces = () => {
  const uId = useParams().uId;

  const [loadedPlaces, setLoadedPlaces] = useState();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  useEffect(() => {
    const getPlaces = async () => {
      try {
        const responseData = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/places/user/${uId}`
        );
        console.log(responseData);

        setLoadedPlaces(responseData.place);
      } catch(err) {
        console.log(err);

      }
    };
    getPlaces();
  }, [sendRequest, uId]);

  const placeDeletedHandler = deletedPlaceId => {
    setLoadedPlaces(prevLoadedPlaces => {
          console.log("Prev Loaded Places");
          console.log(prevLoadedPlaces);
          return prevLoadedPlaces.filter(place => place._id !== deletedPlaceId)
        }
    );
    console.log(loadedPlaces)
  };

  return (
      <React.Fragment>
        <ErrorModal error={error} onClear={clearError}/>
        {isLoading && (
            <div className="center">
              <LoadingSpinner asOverlay/>
            </div>)}
        {loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler}/>}
      </React.Fragment>
  );
};

export default UserPlaces;