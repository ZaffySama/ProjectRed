import React, {useState} from 'react'
import {Button, Col, Form, Row} from "react-bootstrap";
import { gql, useMutation } from '@apollo/client';
import {Link} from "react-router-dom";

const REGISTER_USER = gql`
    mutation register($username: String! $email: String! $password: String! $confirmarPassword: String!) {
        register(username: $username email: $email password: $password confirmarPassword: $confirmarPassword) {
            username email createdAt
        }
    }
`;

export default function Registro(props){
    const [variables, setVariables] = useState({username: '',email: '',password: '',confirmarPassword: ''})
    const [errors, setErrors] = useState({})

    const [registerUser, { loading }] = useMutation(REGISTER_USER, {
        update(x,z) { props.history.push('/login') },
        onError(err) { setErrors(err.graphQLErrors[0].extensions.errors) }
    })

    const enviarRegistro = e => {
        e.preventDefault()
        registerUser({variables})

    }
    return(
            <Row className="bg-white py-5 justify-content-center">
                <Col sm={8} md={6} lg={4}>
                    <h1 className="text-center">Registrarse</h1>
                    <Form onSubmit={enviarRegistro}>

                        <Form.Group >
                            <Form.Label className={errors.username && 'text-danger'}>{errors.username ?? 'Usuario'}</Form.Label>
                            <Form.Control type="usuario" className={errors.username && 'is-invalid'} value={variables.username} onChange={(e) => setVariables( {...variables, username: e.target.value})} placeholder="Introduce un nombre de usuario" />
                        </Form.Group>

                        <Form.Group >
                            <Form.Label className={errors.email && 'text-danger'}>{errors.email ?? 'Email'}</Form.Label>
                            <Form.Control type="email" className={errors.email && 'is-invalid'} value={variables.email} onChange={(e) => setVariables( {...variables, email: e.target.value})} placeholder="Introduce un email" />
                        </Form.Group>

                        <Form.Group >
                            <Form.Label className={errors.password && 'text-danger'}>{errors.password ?? 'Contraseña'}</Form.Label>
                            <Form.Control type="password" className={errors.password && 'is-invalid'} value={variables.password} onChange={(e) => setVariables( {...variables, password: e.target.value})} placeholder="Introduce una contraseña" />
                        </Form.Group>

                        <Form.Group >
                            <Form.Label className={errors.confirmarPassword && 'text-danger'}>{errors.confirmarPassword ?? 'Confirmar contraeña'}</Form.Label>
                            <Form.Control type="password" className={errors.confirmarPassword && 'is-invalid'} value={variables.confirmarPassword} onChange={(e) => setVariables( {...variables, confirmarPassword: e.target.value})} placeholder="Repite la contraseña" />
                        </Form.Group>

                        <div className="text-center">
                            <Button variant="primary" type="submit" disabled={loading} >
                                {loading ? 'Registrando usuario' : 'Registrarse'}
                            </Button>
                        </div>

                        <div className="text-center">
                            <small >¿Ya tienes una cuenta? <Link to="/login">Inicia Sesion</Link></small>
                        </div>

                    </Form>
                </Col>
            </Row>
    )
}
