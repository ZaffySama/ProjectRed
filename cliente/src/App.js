import React, {useState} from "react"
import {Container} from "react-bootstrap"
import {BrowserRouter, Switch} from "react-router-dom";
import './App.scss';
import Inicio from "./paginas/Inicio/Inicio";
import Registro from "./paginas/Registro";
import Login from "./paginas/Login";
import ApolloProvider from "./ApolloProvider";
import {ProveedorAuth} from './context/auth'
import {ProveedorMensajes} from './context/mensajes'
import RutaDinamica from "./util/RutaDinamica";


function App() {
    return (
        <ApolloProvider>
            <ProveedorAuth>
                <ProveedorMensajes>
                    <BrowserRouter>
                        <Container className="pt-5">
                            <Switch>
                                <RutaDinamica exact path="/" component={Inicio} authenticated/>
                                <RutaDinamica path="/registro" component={Registro} invitado/>
                                <RutaDinamica path="/login" component={Login} invitado/>
                            </Switch>
                        </Container>
                    </BrowserRouter>
                </ProveedorMensajes>
            </ProveedorAuth>
        </ApolloProvider>
    );
}

export default App;
