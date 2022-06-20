const {UserInputError, AuthenticationError, ForbiddenError, withFilter} = require('apollo-server')
const {User, Mensajes, Reaction} = require('../../models')
const {Op} = require('sequelize')


module.exports = {

    Query: {
        getMessages: async (parent, {from}, {user}) => {
            try {
                if (!user) throw new AuthenticationError('No Identificado')
                const sender = await User.findOne({where: {username: from}})
                if (!sender) throw new UserInputError("Usuario no encontrado")
                const usernames = [user.username, sender.username]
                const mensajes = await Mensajes.findAll(
                    {
                        where:
                            {
                                from: {[Op.in]: usernames},
                                to: {[Op.in]: usernames}
                            },
                        order: [['createdAt', 'DESC']]
                    })
                return mensajes
            } catch (err) {
                console.log(err)
                throw err
            }
        }
    },

    //Creamos la mutacion en el resolver como  una funcion async que cogera los detalles del usuario y lo creara
    Mutation: {

        createMessage: async (parent, {to, content}, {user, pubsub}) => {
            try {
                if (!user) throw new AuthenticationError('No Identificado')
                const recividor = await User.findOne({where: {username: to}})
                if (!recividor) {
                    throw new UserInputError("Usuario no encontrado")
                } else if (recividor.username === user.username) {
                    throw new UserInputError("¿Por que querrias enviarte mensajes a ti mismo?")
                }
                if (content.trim() === "") {
                    throw new UserInputError("Sin mensajes")
                }

                const mensaje = await Mensajes.create({
                    from: user.username,
                    to,
                    content
                })

                pubsub.publish('NEW_MESSAGE', {newMensaje: mensaje})

                return mensaje
            } catch (err) {
                console.log(err)
                throw err
            }
        },
    },

    // Resolver subscripcion con GraphQL para recibir los mensajes y proteger los mensajes de otros usuarios
    Subscription: {
        newMensaje: {
            subscribe: withFilter((x, y, {pubsub, user}) => {
                if (!user) throw new AuthenticationError('No Identificado')
                return pubsub.asyncIterator(['NEW_MESSAGE'])
            }, ({newMensaje}, y, {user}) => {
                if (newMensaje.from === user.username || newMensaje.to === user.username) {
                    return true
                } else return false
            })
        }
    }
};
