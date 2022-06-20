import React, {Fragment, useEffect, useState} from "react"
import {gql, useLazyQuery, useMutation} from "@apollo/client";
import {Col, Form} from 'react-bootstrap'
import {useMensajesDispatch, useMensajesState} from "../../context/mensajes"
import Message from "./Message";

const SEND_MESSAGE = gql`
mutation createMessage($to: String!, $content: String!){
    createMessage(to: $to, content: $content){
        uuid from to content createdAt
    }
}
`
const GET_MESSAGE = gql`
    query getMessages($from: String!) {getMessages(from: $from) {
        uuid from to content createdAt
    }}
`

export default function Mensajes() {

    const {users} = useMensajesState()
    const dispatch = useMensajesDispatch()
    const [content, setContent] = useState('');
    const selectedUser = users?.find((u) => u.selected === true)
    const messages = selectedUser?.messages

    const [getMessages, {loading: messagesLoading, data: messagesData},] = useLazyQuery(GET_MESSAGE)
    const [createMessage] = useMutation(SEND_MESSAGE, {
        onError: (err) => console.log(err),
    })

    useEffect(() => {
        if (selectedUser && !selectedUser.messages) {
            getMessages({ variables: { from: selectedUser.username } })
        }
    }, [selectedUser])

    useEffect(() => {
        if (messagesData) {
            dispatch(
                {
                    type: 'SET_USER_MESSAGES',
                    payload: {
                        username: selectedUser.username,
                        messages: messagesData.getMessages
                    }
                })
        }
    }, [messagesData])

    const submitMessage = (e) => {
        e.preventDefault()
        if (content.trim() === '' || !selectedUser) return
        setContent('')
        // Mutacion para mandar los mensajes.
        createMessage({ variables: { to: selectedUser.username, content } })
    }

    let selectedChatMarkup
    if (!messages && !messagesLoading) {
        selectedChatMarkup =
            <p className="informacion">
                ¡Abre un chat!
            </p>
    } else if (messagesLoading) {
        selectedChatMarkup =
            <p className="informacion">
                Cargando..
            </p>
    } else if (messages.length > 0) {
        selectedChatMarkup = messages.map((message, index) => (
            <Fragment>
                <Message key={message.uuid} message={message}/>
                {index === messages.length - 1 && (
                    <div className="invisible">
                        <hr className="m-0"/>
                    </div>
                )}
            </Fragment>
        ))
    } else if (messages.length === 0) {
        selectedChatMarkup =
            <p className="informacion">
                Atrevete y manda el primer mensaje
            </p>
    }

    return (
        <Col xs={10} md={8} >
            <div className="caja-mensajes d-flex flex-column-reverse">
                {selectedChatMarkup}
            </div>
            <div>
                <Form onSubmit={submitMessage} >
                    <Form.Group className="d-flex align-items-center">
                        <Form.Control
                            type="text"
                            className="input-mensaje p-4 rounded-pill bg-primary border-10"
                            placeholder="Escribe tu mensaje"
                            value={content}
                            onChange={e => setContent(e.target.value)}/>
                        <i className="fab fa-galactic-senate fa-3x text-primary ml-4" onClick={submitMessage} role="button"/>
                    </Form.Group>
                </Form>
            </div>

        </Col>
    )
}
