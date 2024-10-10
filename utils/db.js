import mongoose from "mongoose";

export async function DBconnection() {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log('MongoDB Connected Successfully'))
        .catch((err) => console.error('MongoDB Connection Error: ', err));
}

export default mongoose;
