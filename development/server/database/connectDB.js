const mongoose = require("mongoose");

exports.connectDatabase = async () => {
    const isDev =
        (process.env.NODE_ENV || "development").trim().toLowerCase() !== "production";
    const allowDevAuthStub =
        isDev &&
        (process.env.ALLOW_DEV_AUTH_STUB || "false").trim().toLowerCase() === "true";

    // In dev stub mode, skip mandatory DB connection so the API can start even offline.
    if (allowDevAuthStub) {
        console.warn("DEV AUTH STUB enabled – skipping MongoDB connection.");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongodb Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Failed", error.message);
        process.exit(1);
    }
};
