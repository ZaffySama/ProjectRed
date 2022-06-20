import React, {Fragment, useEffect} from 'react'
import {Button, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useAuthDispatch, useAuthState} from "../../context/auth";
import {useMensajesDispatch} from "../../context/mensajes";
import {gql, useSubscription} from "@apollo/client";
import Users from "./Users";
import Mensajes from "./Mensajes";

const NEW_MESSAGE = gql`
    subscription newMensaje{
        newMensaje{
            uuid from to content createdAt
        }
    }
`


export default function Inicio({history}) {
    const authDispatch = useAuthDispatch()
    const messageDispatch = useMensajesDispatch()
    const {user} = useAuthState()

    //Hook para recibir los mensajes por websocket
    const {data: messageData, error: messageError} = useSubscription(NEW_MESSAGE)
    useEffect(() => {
        if (messageError) console.log(messageError)
        if (messageData) {
            const message = messageData.newMensaje
            const otherUser = user.username === message.to ? message.from : message.to

            messageDispatch(
                {
                    type: 'ADD_MESSAGE', payload:
                        {
                            username: otherUser,
                            message,
                        }
                })
        }

    }, [messageError, messageData])

    const logout = () => {
        authDispatch({type: 'LOGOUT'})
        window.location.href = '/login'
    }
    return (
        <Fragment>
            <Row className="bg-white justify-content-around">
                <Link to="/login">
                    <Button variant="link">
                        Login
                    </Button>
                </Link>

                <Link to="/registro">
                    <Button variant="link">
                        Registro
                    </Button>
                </Link>

                <Button variant="link" onClick={logout}>
                    Cerrar Sesion
                </Button>
            </Row>
            <Row className="bg-white">
                <Users/>
                <Mensajes/>
            </Row>

        </Fragment>


    )
}
