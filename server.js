const { ApolloServer } = require('apollo-server');

const {sequelize} = require('./models')

//Nuestro Middleware
const contextMiddleware = require('./util/contextMiddleware')

// Schema GraphQL
const typeDefs = require('./graphql/typeDefs')

// Mapa de funciones que retorna los datos del schema GraphQL
const resolvers = require('./graphql/resolvers')

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: contextMiddleware,

});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);


    sequelize.authenticate()
        .then(() => console.log("Base de datos actualizada"))
        .catch((err) =>  console.log(err))
});
