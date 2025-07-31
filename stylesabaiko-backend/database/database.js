const mongoose = require('mongoose');
const connectDB = () => {
    // Connect to MongoDB using the URL from environment variables
    mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log("Database Connected successfully")
    })

}
module.exports = connectDB;

