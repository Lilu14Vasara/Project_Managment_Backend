import dotenv from "dotenv";
dotenv.config();
console.log("ACCESS:", process.env.ACCESS_TOKEN_SECRET);

import app from "./app.js";
import connectDb from "./db/index.js";



connectDb()
.then(()=>{
    app.listen(3000, () => {
        console.log(`server running at port 3000`);
    });
})
.catch((err)=>{
    console.error("MongoDb Connection error");
});