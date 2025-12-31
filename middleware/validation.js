const Joi = require('joi');

const userUpdateSchema = Joi.object({
    role: Joi.string().valid('USER', 'ADMIN'),
    loyaltyTier: Joi.string().valid('Bronze', 'Silver', 'Gold', 'Platinum'),
    status: Joi.string().valid('ACTIVE', 'SUSPENDED')
});

const flightCreateSchema = Joi.object({
    flightNumber: Joi.string().required(),
    airline: Joi.string().required(),
    origin: Joi.string().required(),
    destination: Joi.string().required(),
    departureTime: Joi.date().required(),
    arrivalTime: Joi.date().required(),
    price: Joi.number().min(0).required(),
    availableSeats: Joi.number().min(0).required(),
    status: Joi.string().valid('ACTIVE', 'INACTIVE', 'DELAYED', 'CANCELLED'),
    gate: Joi.string(),
    terminal: Joi.string()
});

const notificationSchema = Joi.object({
    title: Joi.string().required().min(3).max(100),
    message: Joi.string().required().min(10).max(500),
    type: Joi.string().valid('INFO', 'WARNING', 'SUCCESS', 'PROMOTION').required(),
    target: Joi.string().valid('ALL', 'ADMINS', 'USERS').required()
});

const airlineSchema = Joi.object({
    name: Joi.string().required(),
    iataCode: Joi.string().length(2).required(),
    icaoCode: Joi.string().length(3).optional(),
    country: Joi.string().required(),
    status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE')
});

const airportSchema = Joi.object({
    name: Joi.string().required(),
    city: Joi.string().required(),
    iataCode: Joi.string().length(3).required(),
    icaoCode: Joi.string().length(4).optional(),
    country: Joi.string().required(),
    status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE')
});

const supportTicketSchema = Joi.object({
    subject: Joi.string().required().min(5).max(100),
    message: Joi.string().required().min(10).max(1000),
    category: Joi.string().valid('BOOKING', 'PAYMENT', 'FLIGHT', 'LOYALTY', 'OTHER').required(),
    priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').default('LOW')
});

const supportResponseSchema = Joi.object({
    message: Joi.string().required().min(2).max(1000)
});

module.exports = {
    userUpdateSchema,
    flightCreateSchema,
    notificationSchema,
    airlineSchema,
    airportSchema,
    supportTicketSchema,
    supportResponseSchema
};


