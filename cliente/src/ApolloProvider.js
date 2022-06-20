import React from "react";
import {ApolloClient, InMemoryCache, ApolloProvider as Provider, createHttpLink, split} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';


//Codigo Networking Autentificacion - Docs Apollo
import { setContext } from '@apollo/client/link/context';

let httpLink = createHttpLink({
    uri: 'http://localhost:4000',
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

//Codigo WebSockeyLink

httpLink = authLink.concat(httpLink)

const wsLink = new WebSocketLink({
    uri: `ws://localhost:4000/graphql`,
    options: {
        reconnect: true,
        connectionParams: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    }
});

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

//Codigo Cliente apollo
const client = new ApolloClient({
    //Cogemos la uri del httpLink
    link: splitLink,
    cache: new InMemoryCache()
});

export default function ApolloProvider(props){
    return <Provider client={client} {...props} />
}
