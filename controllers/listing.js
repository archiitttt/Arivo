const Listing = require('../models/listing.js');
const {joiListingSchema} = require('../joiSchema.js');
const cloudinary = require('../cloudConfig.js');
const ExpressError = require('../utils/ExpressError.js');

module.exports.index = async (req, res)=>{
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', {allListings});
};

module.exports.renderNewForm = (req, res)=>{
    res.render('listings/new.ejs');
};

module.exports.showListing = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews", populate : {path : "author"}}).populate("owner");
    if(!listing){
        req.flash('failure', 'The Listing you requested does not exist!');
        res.redirect('/listings');
    }
    res.render('listings/show.ejs', {listing});
}

module.exports.createListing = async (req, res) => {
    const { error } = joiListingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }

    const { title, description, price, location, country } = req.body;

    let image = {
        url: req.file ? req.file.path : undefined,
        filename: req.file ? req.file.filename : undefined
    };

    await Listing.create({
        title,
        description,
        image,
        price,
        location,
        country,
        owner: req.user._id,
    });

    req.flash('success', 'New Listing Created!');
    res.redirect('/listings');
};


module.exports.deleteListing = async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing Deleted!');
    res.redirect('/listings');
};

module.exports.renderEditForm = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', {listing});
};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let { title, description, price, location, country } = req.body;

    const updatedData = {
        title,
        description,
        price,
        location,
        country
    };

    if (req.file) {
        updatedData.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await Listing.findByIdAndUpdate(id, updatedData);

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};