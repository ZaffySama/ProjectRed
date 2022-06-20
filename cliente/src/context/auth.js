import React, {createContext, useReducer, useContext} from "react";
import jwtDecode from "jwt-decode";
//Usamos la metodologia de contexto, dividiendolo en dos.
const AuthStateContext = createContext()
const AuthDispatchContext = createContext()
//recuperamos el token del localStorage en caso de que se cierre la aplicacion
const token = localStorage.getItem('token')
let user = null
if(token) {
    const tokenDecodificado = jwtDecode(token)
    //Necesitamos la expiracion, y en milisegundos
    const expiresAt = new Date(tokenDecodificado.exp * 1000)
    //Comprobamos la hora de expiracion del token contra la hora local.
    if(new Date() > expiresAt){localStorage.removeItem('token')}
    else{ user= tokenDecodificado }
}
else console.log('Token no encontrado')

const authReducer = (state, action) => {
    switch(action.type){
        case 'LOGIN':
            localStorage.setItem('token', action.payload.token)
            return{...state, user:action.payload}
        case 'LOGOUT':
            localStorage.removeItem('token')
            return{...state, user: null}
        default: throw new Error(`Accion no reconozida: ${action.type}`)
    }
}

export const ProveedorAuth = ({children}) => {
    const [state,dispatch] = useReducer(authReducer, {user})
    return(
        <AuthDispatchContext.Provider value= {dispatch}>
            <AuthStateContext.Provider value={state}>
                {children}
            </AuthStateContext.Provider>
        </AuthDispatchContext.Provider>
    )
}

export const useAuthState = () => useContext(AuthStateContext)
export const useAuthDispatch = () => useContext(AuthDispatchContext)
