import React, {useEffect, useState} from 'react';

import UserList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {useHttpClient} from "../../shared/hooks/http-hook";



const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  useEffect(() => {
    const getUsers = async () => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users`);
        console.log(responseData);

        setLoadedUsers(responseData.users);
      } catch(err) {
        console.log(err);

      }
    };
    getUsers();
  }, [sendRequest]);

  return (
      <React.Fragment>
        <ErrorModal error={error} onClear={clearError}/>
        {isLoading && (
            <div className="center">
              <LoadingSpinner asOverlay/>
            </div>)}
        {!isLoading && loadedUsers && <UserList items={loadedUsers}/>}
      </React.Fragment>
  );
};

export default Users;
