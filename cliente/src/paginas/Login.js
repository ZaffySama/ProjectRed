import React, {useState} from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { gql, useLazyQuery } from '@apollo/client'
import { Link } from 'react-router-dom'

import { useAuthDispatch } from '../context/auth'

const LOGIN_USER = gql`
    query login($username: String!  $password: String! ) {
        login(username: $username  password: $password ) {
            username email createdAt token
        }
    }
`;



export default function Registro(props){
    const [variables, setVariables] = useState({username: '',password: ''})
    const [errors, setErrors] = useState({})
    const dispatch = useAuthDispatch()

    // Segun la documentacion de apollo server, tenemos que usar useLazyQuery en vez de useQuery ya que esta ultima se ejecuta cuando la pagina se carga, y nosotros necesitamos que se cargue solo una vez le dems los detalles del login
    const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
        onError(err) { setErrors(err.graphQLErrors[0].extensions.errors) },
        onCompleted(data)
        {

            dispatch({type: 'LOGIN', payload: data.login})
            window.location.href = "/"
        },
    })

    const enviarLogin = e => {
        e.preventDefault()
        loginUser({variables})

    }
    return(
        <Row className="bg-white py-5 justify-content-center">
            <Col sm={8} md={6} lg={4}>
                <h1 className="text-center">Inicio de sesion</h1>
                <Form onSubmit={enviarLogin}>

                    <Form.Group >
                        <Form.Label className={errors.username && 'text-danger'}>{errors.username ?? 'Usuario'}</Form.Label>
                        <Form.Control type="usuario" className={errors.username && 'is-invalid'} value={variables.username} onChange={(e) => setVariables( {...variables, username: e.target.value})} placeholder="Introduce un nombre de usuario" />
                    </Form.Group>

                    <Form.Group >
                        <Form.Label className={errors.password && 'text-danger'}>{errors.password ?? 'Contraseña'}</Form.Label>
                        <Form.Control type="password" className={errors.password && 'is-invalid'} value={variables.password} onChange={(e) => setVariables( {...variables, password: e.target.value})} placeholder="Introduce una contraseña" />
                    </Form.Group>

                    <div className="text-center">
                        <Button variant="primary" type="submit" disabled={loading} >
                            {loading ? 'Iniciando' : 'Iniciar sesion'}
                        </Button>
                    </div>
                    <br/>
                    <div className="text-center">
                        <small >¿Aun no tienes una cuenta? <Link to="/registro">Registrate</Link></small>
                    </div>


                </Form>
            </Col>
        </Row>
    )
}
