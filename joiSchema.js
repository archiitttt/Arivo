const joi = require('joi');

module.exports.joiListingSchema = joi.object({
    title : joi.string().required(),
    description : joi.string().required(),
    url : joi.string().allow('', null),
    price : joi.number().required(),
    location : joi.string().required(),
    country : joi.string().required()

});

module.exports.joiReviewSchema = joi.object({
    review : joi.object({
        rating : joi.number().required(),
        comment : joi.string().required()
    }).required()
});
