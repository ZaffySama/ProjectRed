const { gql } = require('apollo-server');

module.exports = gql`
    
    type User {
        username: String!
        email: String
        createdAt: String!
        token: String
        imageUrl: String
        latestMessage: Mensajes
        
    }
    
    type Mensajes {
        uuid: String!
        content: String!
        from: String!
        to: String!
        createdAt: String!
    }
    
    type Query {
        getUsers: [User]!
        login(username: String! password: String!) : User!
        getMessages(from:String!): [Mensajes]!

    }
    
    #Creamos una mutacion para que el usuario se pueda regisrar en la aplicacion mediante la API 
    type Mutation{
        register(
            username: String!
            email: String!
            password: String!
            confirmarPassword: String!
        ) : User!
        createMessage(to:String! content:String!): Mensajes!
       
    }
    
    type Subscription{
        newMensaje: Mensajes!
    }
`;


