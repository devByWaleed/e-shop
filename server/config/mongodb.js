import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () =>
            console.log("Database Connected"));

        // For Laptop
        // await mongoose.connect(`${process.env.MONGODB_URI}/Eshop`);
        
        // For PC
        await mongoose.connect("mongodb://localhost:27017/Eshop", {
            user: "myAdmin",
            pass: "myPassword123",
            authSource: "admin"
        })
            .then(() => console.log("Authenticated!"))
            .catch(err => console.log(err));
    } catch (error) {
        console.error(error.message);
    }
}

export default connectDB;