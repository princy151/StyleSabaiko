const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { productSchema } = require('./productModel');

const cartSchema = new mongoose.Schema({
    product: {
        type: Schema.Types.ObjectId, ref: 'products',
        required: true
    },
    userId: {
        type: String,
        required: true
    }

})
const cart = mongoose.model('carts', cartSchema)
module.exports = cart;