import React from 'react'
import {useAuthState} from "../../context/auth";
import classNames from "classnames";
import moment from 'moment'
import {OverlayTrigger, Tooltip} from "react-bootstrap";


export default function Message({message}) {
    //Cogemos nuestro usuario
    const {user} = useAuthState()
    //Con sent y recieved sabremos quien es el que envia y recibe el mensajes
    const sent = message.from === user.username
    const received = !sent

    return (

        <OverlayTrigger placement={ sent ? 'right' : 'left'} overlay=
            {
                <Tooltip>
                    {moment(message.createdAt).format('DD MMMM, YYYY @ h:mm a')}
                </Tooltip>
            }>

            <div className={classNames("my-3 d-flex",{
                'ml-auto': sent,
                'mr-auto': received,
            })}>
                <div className={classNames(
                    'px-4 py-3 rounded-pill ',
                    {
                        //Diferentes colores dependiendo de quien lo envie o reciba
                        'bg-primary': sent,
                        'bg-dark': received,
                    }
                )}>
                    <p className="text-white" key={message.uuid}> {message.content} </p>
                </div>
            </div>

        </OverlayTrigger>

    )
}
