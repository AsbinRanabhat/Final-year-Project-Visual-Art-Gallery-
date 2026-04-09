//mongodb+srv://VisualArtGallery:<db_password>@cluster0.ti3dyls.mongodb.net/?appName=Cluster0
require("dotenv").config()
const express = require("express");
const cors = require("cors");
const { connectDatabase } = require("./database/connectDB");
connectDatabase();
const app = express()
const port = process.env.PORT;
app.use(cors());
app.use(express.json())
const authRoute = require("./routes/authRoutes")
const productRoute = require("./routes/productRoutes")
const paymentRoute = require("./routes/paymentRoutes")
app.use("", authRoute)
app.use("", productRoute)
app.use("", paymentRoute)
app.listen(port, (req, res) =>{
    console.log(`Connected to ${port}`)
})
