import React from "react"
import {gql, useQuery} from "@apollo/client";
import {Col, Image} from "react-bootstrap";
import {useMensajesDispatch, useMensajesState} from "../../context/mensajes"
import classNames from 'classnames'

const GET_USERS = gql`
    query getUsers{getUsers {username createdAt email imageUrl
        latestMessage
        {
            uuid content from to createdAt
        }
    }}

`

export default function Users() {
    const dispatch = useMensajesDispatch()
    const { users } = useMensajesState()
    const selectedUser = users?.find((u) => u.selected === true)?.username


    const {loading} = useQuery(GET_USERS, {
        onCompleted: (data) => dispatch({type: 'SET_USERS', payload: data.getUsers}),
        onError: (err) => console.log(err)

    })
    let usersMarcador
    if (!users || loading) {
        usersMarcador = <p>Cargando...</p>
    } else if (users.length === 0) {
        usersMarcador = <p>No hay mas usuarios</p>
    } else if (users.length > 0) {
        usersMarcador = users.map((user) => {
            const selected = selectedUser === user.username
            return (
                <div role="button" className={classNames("user-div d-flex justify-content-center justify-content-md-start p-3",{'bg-light': selected})} key={user.username}
                     onClick={() => dispatch({type: 'SET_SELECTED_USER' , payload: user.username })}>
                    <Image src={user.imageUrl || "https://picsum.photos/200"} className="imagen-usuario"/>
                    <div className="d-none d-md-block ml-2">
                        <p className="text-primary">{user.username}</p>
                        <p className="font-weight-light">{user.latestMessage ? user.latestMessage.content : '¡Estas conectado!'}</p>
                    </div>
                </div>)
        })
    }

    return (<Col xs={2} md={4} className='p-0 bg-info'>
        {usersMarcador}
    </Col>)
}
