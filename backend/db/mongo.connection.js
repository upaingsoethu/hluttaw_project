// config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const  mongodbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Mongodb Server is connected to : ${process.env.MONGO_URL}` );
    } catch (err) {
        console.error(err.message);
        process.exit(1);
       
       
    }
};

export default mongodbConnection;


