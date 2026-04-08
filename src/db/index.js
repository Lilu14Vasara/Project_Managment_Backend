import mongoose from "mongoose";

const connectDb=async()=>{
   try {
    await mongoose.connect("mongodb+srv://Lilu_Vasara:Lilu1411@cluster0.9x9qz.mongodb.net/projectDb");
    console.log("MongoDB connected");
   } catch (error) {
    console.error("MongoDB connections Error",error);
    process.exit(1);
   }
}
export default connectDb