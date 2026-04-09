const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    productName: {
        type: String,
        required: [true, "Provide Artwork Title"],
        trim: true
    },
    productDescription: {
        type: String,
        required: [true, "Provide Artwork Description"],
    },
    productPrice: {
        type: Number,
        required: [true, "Provide Artwork Price"],
    },
    productCategory: {
        type: String,
        enum: ["Oil", "Canvas", "Digital", "Sculpture", "Mixed Media"],
        required: [true, "Select a Category"],
    },
    productImage: {
        type: String,
        required: [true, "Provide Artwork Image URL"],
    },
    // Linking the artwork to the Artist (User)
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Artwork must belong to an artist"]
    },
    availability: {
        type: String,
        enum: ["Available", "Sold", "Reserved"],
        default: "Available"
    },
    dimensions: {
        type: String, // e.g., "24x36 inches"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;