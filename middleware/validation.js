const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const authSchema = Joi.object({
    name: Joi.string().min(3),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const bookingSchema = Joi.object({
    flightId: Joi.string().required(),
    passengers: Joi.array().items(Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        passportNumber: Joi.string().required(),
    })).min(1).required(),
    totalPrice: Joi.number().required(),
});

module.exports = {
    validate,
    authSchema,
    bookingSchema,
};
