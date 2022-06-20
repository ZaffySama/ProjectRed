const userResolvers = require("./users")
const mensajesResolvers = require("./mensajes")

//Hacemos un module exports para juntar los dos resolvers. De esta forma, queda un codigo mas limpio y archivos mas pequeños e independientes
module.exports = {

    Mensajes: {
      createdAt: (parent) =>  parent.createdAt.toISOString()
    },
    Query: {
        ...userResolvers.Query,
        ...mensajesResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...mensajesResolvers.Mutation,
    },
    Subscription: {
        ...mensajesResolvers.Subscription,
    }
}
