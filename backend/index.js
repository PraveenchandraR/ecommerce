// const express=require("express")



import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";

const app = express();
const PORT = 8080;

const MONGOURL = 'mongodb://127.0.0.1:27017/loc8r';
//    'mongodb://127.0.0.1:27017';
    // / loc8r'

app.use(express.json());
app.use(cors());

const connectDB = async() => {
    try {
       
        const client = new MongoClient(MONGOURL);
        await client.connect();
        console.log("Mongodb connected");
        return client;
    }
    catch (err){
        console.log(err.message)
    }
}
const client = await connectDB();



app.get("/", (req, res) => {
    res.send("hello world")
})

app.get("/mobiles", async(req, res) => {
    const mobiles = await client.db("ecommobile").collection("mobiles").find().toArray();
    res.send(mobiles);
})

app.get("/cart", async(req, res) => {
    const cart = await client.db("ecommobile").collection("cart").find().toArray();
    res.send(cart);
})

app.post("/mobiles", async(req, res) => {
    const mobiles = req.body;
    const result = await client
        .db("ecommobile")
        .collection("mobiles")
        .insertMany(mobiles);
    res.send(result);

})

//new mobile added
//+ -
//delete
//

app.put("/cart", async (req, res) => {
    
    const mobile = req.body;
    console.log(mobile);
    const { type } = req.query;

    const isExist =await client.db("ecommobile").collection("cart")
        .findOne({ _id: mobile._id });
    
    
    if (isExist) {
       
        if (type === "decrement" && isExist.qty <= 1) {
             await  client.db("ecommobile").collection("cart")
        .deleteOne({_id:mobile._id });
            
        } else {
               await  client.db("ecommobile").collection("cart")
        .updateOne({_id:mobile._id },{$inc:{qty: type==="increment"?+1: -1 }});
            
        }

    } else {
       await  client.db("ecommobile").collection("cart")
        .insertOne({...mobile,qty:1 });
    
    }

const cart= await  client.db("ecommobile").collection("cart")
        .find().toArray();
    res.send(cart);
    
})



app.listen(PORT, () => 
    console.log(`server is running in port  ${PORT}`)
)