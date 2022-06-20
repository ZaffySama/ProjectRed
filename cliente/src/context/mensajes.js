import React, {createContext, useReducer, useContext} from "react";

//Usamos la metodologia de contexto, dividiendolo en dos.
const MensajesStateContext = createContext()
const MensajesDispatchContext = createContext()


const mensajesReducer = (state, action) => {
    let usersCopy, userIndex
    const {username,message, messages} = action.payload
    switch(action.type){
        case 'SET_USERS':
            return {
                ...state,
                users: action.payload,
            }


        case 'SET_USER_MESSAGES':


            usersCopy = [...state.users]
            userIndex = usersCopy.findIndex( u => u.username === username)
            usersCopy[userIndex] = {...usersCopy[userIndex] , messages}
            return {
                ...state,
                users: usersCopy
            }
            //Para recibir el mensaje de GraphQL

        case 'SET_SELECTED_USER':

            usersCopy = state.users.map((user) => ({
                ...user,
                selected: user.username === action.payload,
            }))

            return {
                ...state,
                users: usersCopy,
            }

        case 'ADD_MESSAGE':
            usersCopy = [...state.users]
            userIndex = usersCopy.findIndex((u) => u.username === username)
            let newUser = {
                ...usersCopy[userIndex],
                messages: usersCopy[userIndex].messages ? [message, ...usersCopy[userIndex].messages] : null,
                latestMessage: message,
            }
            usersCopy[userIndex] = newUser

            return {
                ...state,
                users: usersCopy,
            }

        default: throw new Error(`Accion no reconozida: ${action.type}`)
    }
}

export const ProveedorMensajes = ({children}) => {
    const [state,dispatch] = useReducer(mensajesReducer, { users: null})
    return(
        <MensajesDispatchContext.Provider value= {dispatch}>
            <MensajesStateContext.Provider value={state}>
                {children}
            </MensajesStateContext.Provider>
        </MensajesDispatchContext.Provider>
    )
}

export const useMensajesState = () => useContext(MensajesStateContext)
export const useMensajesDispatch = () => useContext(MensajesDispatchContext)
