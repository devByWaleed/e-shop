import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Set up event listeners BEFORE connecting
        mongoose.connection.once('connected', () => {
            console.log("✅ Database Connected Successfully");
        });

        mongoose.connection.on('error', (err) => {
            console.error("❌ MongoDB Connection Error:", err.message);
        });

        // Connect to MongoDB
        await mongoose.connect(`${process.env.MONGODB_URI}/Eshop`, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s
            socketTimeoutMS: 45000,
        });

        console.log("✅ MongoDB connection established");

    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error.message);
        // Re-throw the error so the caller knows it failed
        throw error;
    }
};

export default connectDB;