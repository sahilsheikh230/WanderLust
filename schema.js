const Joi = require('joi');

// Joi schemas
module.exports.listingSchema = Joi.object({
  Listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required().min(10),
    price: Joi.number().required().min(0),
    
    location: Joi.string().required(),
    country: Joi.string().required()
  }).required()
});

module.exports.reviewschema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().required().min(0).max(5)
  }).required()
});