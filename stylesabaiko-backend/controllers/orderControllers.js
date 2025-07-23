const orderModel = require('../models/orderModel')
const orderid = require('order-id')('key');

const createOrder = async (req, res) => { 
    const user = req.user;
    const { products, receiverName, receiverAddress, receiverPhone, receiverEmail, grandTotal } = req.body
    if (!products || !receiverName || !receiverAddress || !receiverPhone || !receiverEmail || !grandTotal) {
        return res.status(400).json({
            message: 'All Fields are required.',
            success: false
        }); 
    }

    // Generate Order Id
    const orderId = orderid.generate();
    try {
        const newOrder = new orderModel({
            userId: user.id,
            orderId: orderId,
            products: products,
            receiverName: receiverName,
            receiverAddress: receiverAddress,
            receiverPhone: receiverPhone,
            receiverEmail: receiverEmail,
            grandTotal: grandTotal
        });
        const order = await newOrder.save();
        return res.status(201).json({
            success: true,
            message: 'Order has been stored.',
            order: order
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.'
        })
    }
}

const get_all_order_by_status = async (req, res) => { 
    const user = req.user;
    //destructuring
    let { limit, page } = req.query

    if (!limit) {
        limit = 100
    }
    if (!page) {
        page = 1
    }
    const paginationParams = {
        limit: limit,
        skip: (page - 1) * limit,
    };

    const status = req.params.status

    try {
        const orders = await orderModel.find({ userId: user.id, orderStatus:status }, {}, paginationParams).sort({ createdAt: -1 }).populate('products.product');
        return res.status(201).json({
            success: true,
            message: 'Orders has been fetched.',
            orders: orders
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const updateOrder = async (req, res) => {        
    //destructuring
    try {
        const orderId = req.params.id
        const orderStatus = req.params.status
        const fetchedOrder = await orderModel.findOneAndUpdate({ _id: orderId }, {orderStatus:orderStatus}, { new: true });
    
        return res.status(201).json({
            success: true,
            message: 'Orders updated successfully.',
            orders: fetchedOrder
        })
    } catch (error) {
        console.log("Error ma aayo");
        
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
    
};

const getOrders = async (req, res) => {
    const user = req.user
    //destructuring
    let { limit, page } = req.query

    if (!limit) {
        limit = 100
    }
    if (!page) {
        page = 1
    }
    const paginationParams = {
        limit: limit,
        skip: (page - 1) * limit,
    };

    try {
        const orders = await orderModel.find({userId: user.id}, {}, paginationParams).sort({ createdAt: -1 }).populate('products.product');
        return res.status(201).json({
            success: true,
            message: 'Orders has been fetched.',
            orders: orders
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const getOrder = async (req, res) => { 
    const order = await orderModel.findById(req.params.id).populate('products.product');
    if (!order) {
        return res.status(400).json({
            success: false,
            message: 'Order does not exist.'
        })
    }
    return res.status(201).json({
        success: true,
        message: 'Order has been fetched.',
        order: order
    })
}


const getAllOrders = async (req, res) => {
    //destructuring
    let { limit, page } = req.query

    if (!limit) {
        limit = 100
    }
    if (!page) {
        page = 1
    }
    const paginationParams = {
        limit: limit,
        skip: (page - 1) * limit,
    };

    try {
        const orders = await orderModel.find({}, {}, paginationParams).sort({ createdAt: -1 }).populate('products.product');
        return res.status(201).json({
            success: true,
            message: 'Orders has been fetched.',
            orders: orders
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

module.exports = {
    createOrder,
    getOrder,
    getOrders,
    getAllOrders,
    updateOrder,
    get_all_order_by_status
}