const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
    products: {
        type: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }],
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    receiverName: {
        type: String,
        required: true
    },
    receiverAddress: {
        type: String,
        required: true
    },
    receiverPhone: {
        type: String,
        required: true
    },
    receiverEmail: {
        type: String,
        required: true
    },
    grandTotal: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ["Pending", "Completed", "Cancelled"],
        default:"Pending"
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
