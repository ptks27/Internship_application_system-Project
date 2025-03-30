import mongoose from "mongoose";

const MONGO_URL = "mongodb+srv://basjob:basjob@cluster0.sjygt.mongodb.net/";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected!");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};

export default connectDB;
