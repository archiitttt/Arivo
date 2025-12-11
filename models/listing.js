const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');

const listingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : String,
    image : {
        filename : {
            type : String,
            default : 'listingImage'
        },
        url : {
            type : String,
            default : 'https://unsplash.com/photos/birds-eye-view-photograph-of-green-mountains-01_igFr7hd4',
            set : v=> v==='' ? 'https://unsplash.com/photos/birds-eye-view-photograph-of-green-mountains-01_igFr7hd4' : v
        }
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Review'
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    }
})

listingSchema.post("findOneAndDelete", async (listing)=>{

    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
})

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;