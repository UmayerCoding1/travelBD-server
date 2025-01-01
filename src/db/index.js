import mongoose from 'mongoose';
import {DB_NAME} from '../constants.js'
console.log(process.env.MONGODB_URL);

const connectDB = async () => {
    try {
        // const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL_LOCAL}/${DB_NAME}`)
        console.log(`${process.env.MONGODB_URL_LOCAL}`);
        // console.log(`${process.env.MONGODB_URL}`);
        
    } catch (error) {
        console.log(error);
        process.exit(1);
        
    }
}

export default connectDB;