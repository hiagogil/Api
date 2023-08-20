const Joi = require ('joi')



const usuariosSchema = Joi.object({
    usuarios: Joi.array().items(Joi.object({
        nome: Joi.string(),
        email: Joi.string(),
        password: Joi.string(),
        administrador: Joi.boolean()
    }))
});

export default usuariosSchema;