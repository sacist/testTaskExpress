import mongoose from "mongoose";

export const connectToMongo=async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL as string)
        console.log('Подключено к mongo'); 
    } catch (e) {
        console.log(e);
    }
}