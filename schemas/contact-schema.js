import Joi from "joi"

const contactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    number:  Joi.number().required()
})

export default {
    contactSchema,
}