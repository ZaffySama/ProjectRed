const {UserInputError, AuthenticationError} = require('apollo-server')
const { Mensajes, User } = require('../../models')
const {secreto} = require('../../config/env.json')
const {Op} = require("sequelize")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");



module.exports = {
    Query: {
        getUsers: async (_,__, {user}) =>
        {
            try
            {
                if(!user) throw new AuthenticationError('No Identificado')

                let users = await User.findAll({
                    attributes: ['username' , 'imageUrl' , 'createdAt'],
                    where: {username: {[Op.ne] : user.username}},
                })

                const allUserMessages = await Mensajes.findAll({
                    where: {
                        [Op.or]: [{from: user.username} , {to: user.username}]
                    },
                    order: [['createdAt' , 'DESC']]
                })

                users = users.map(OUser => {
                    const latestMessage = allUserMessages.find(
                        m => m.from === OUser.username || m.to === OUser.username
                    )
                    OUser.latestMessage = latestMessage
                    return OUser
                })

                return users
            }
            catch(err)
            {
                console.log(err)
                throw err
            }
        },

        login: async (parent,args) =>
        {
            const{ username, password } = args
            let errors = {}
            try
            {
                const user = await User.findOne({where: {username}})

                if(username.trim() === '') errors.username = "El campo usuario no puede estar vacio"
                if(password === '') errors.password = "El campo contraseña no puede estar vacio"
                if (Object.keys(errors).length > 0)
                {
                    throw new UserInputError("Rellene todos los campos", { errors })
                }

                if(!user)
                {
                    errors.username = "Usuario no encontrado"
                    throw new UserInputError("Usuario no encontrado", { errors })
                }

                const corrPassword = await bcrypt.compare(password, user.password)
                if(!corrPassword)
                {
                    errors.password = "La contraseña es incorrecta"
                    throw new UserInputError("Contraseña incorrecta", { errors })
                }

                const token = jwt.sign({username}, secreto, { expiresIn: '3h' });
                return{ ...user.toJSON(), createdAt: user.createdAt.toISOString(),token}
            }
            catch (err)
            {
                console.log(err)
                throw err
            }
        }

    },
    //Creamos la mutacion en el resolver como  una funcion async que cogera los detalles del usuario y lo creara
    Mutation: {
        register: async (parent, args) => {
            let { username, email, password, confirmarPassword } = args
            let errors = {}

            try {
                //Validar datos
                if (username.trim() === '') errors.username = "El campo usuario no puede estar vacio"
                if (email.trim() === '') errors.email = "El campo email no puede estar vacio"
                if (password.trim() === '') errors.password = "El campo contraseña no puede estar vacio"
                if (confirmarPassword.trim() === '') errors.confirmarPassword = "El campo repetir contraseña no puede estar vacio"

                //Hacemos un check para comprobar que las dos contraseñas coinciden
                if (password !== confirmarPassword) errors.confirmarPassword = 'Las contraseñas no son iguales'

                //Chequeamos si se ha lanzado algun error
                if (Object.keys(errors).length > 0) {throw errors}

                //Encriptamos la contraseña como metodo de seguridad. De esta forma, si la base de datos se viera comprometida, solo obtendrian un hash
                password = await bcrypt.hash(password, 10)

                //Crear el usuario
                const user = await User.create({username, email, password})

                //Devolver el usuario
                return user

            }


            catch (err) {
                console.log(err)

                //Usamos esto para tirar el error predeterminado que hemos añadido al campo email en user.js
                if (err.name === 'SequelizeValidationError')
                {
                    err.errors.forEach((e) => (errors[e.path] = e.message))
                }

                //Usamos la funcion del campo unico de Sequelize y manejamos el error
                else if (err.name === 'SequelizeUniqueConstraintError')
                {
                    err.errors.forEach(({path}) => (errors[path] = `${path} ya esta en uso`))
                }

                //Manegamos el error del errors que maneja los errors del username, email, password y confirmarPass
                throw new UserInputError('Bad input', { errors })

            }

        },
    },

};
