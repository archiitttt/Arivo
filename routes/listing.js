const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {isLoggedIn, isOwner} = require('../middleware.js');
const listingController = require('../controllers/listing.js');
const multer  = require('multer');
const { storage } = require("../cloudConfig");
const upload = multer({ storage });


router.get('/', wrapAsync(listingController.index));

router.route('/new')
.get(isLoggedIn, listingController.renderNewForm)
.post(upload.single('image'), wrapAsync(listingController.createListing));

router.route('/:id')
.get(wrapAsync(listingController.showListing))
.delete(isLoggedIn, isOwner, listingController.deleteListing);

router.route('/:id/edit')
.get(isLoggedIn, isOwner, listingController.renderEditForm)
.put(upload.single('image'), listingController.editListing);

module.exports = router;