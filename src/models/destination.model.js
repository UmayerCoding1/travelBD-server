import mongoose, { Schema } from "mongoose";

const destinationSchema = new Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        index: true
    },
    location: {
        type: String, 
        require: true,
    },
    tour_location: {
        type: String,
        require: true,
    },
    Offer:{
        day:{}
    }
},{timestamps: true})

export const Destination = mongoose.model('DESTINATION', destinationSchema);

