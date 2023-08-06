import React, { useContext } from 'react';
import {AuthContext} from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function Auth({children}) {

    const {user, userLoading} = useContext(AuthContext)
    if(userLoading) return <h1>loading</h1>
    if(!user) return <Navigate to={'login'}></Navigate>
    return <>{children}</>

  
}

export default Auth