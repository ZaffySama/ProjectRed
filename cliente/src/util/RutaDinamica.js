import React from "react";
import { Route, Redirect} from 'react-router-dom'
import { useAuthState} from "../context/auth";


export default function RutaDinamica(props){
    const {user} = useAuthState()

    // Si el usuario esta intentando meterse a un area de usuario autentificado pero no es un usuario autentificado, redirect al login
    if(props.authenticated && !user) {return <Redirect to="/login" />}
    //Si el usuario esta intentando meterse a un area de invitado siendo un usuario autentificado, redirect al home
    else if(props.invitado && user) {return <Redirect to="/"  />}
    else {return <Route component={props.component} {...props} />}




}


