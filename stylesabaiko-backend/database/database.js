const mongoose = require('mongoose');
// creating a function
const connectDB = () => {
    mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log("Database Connected successfully")
    })

}
module.exports = connectDB;

