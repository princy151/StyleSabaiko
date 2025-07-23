const CartModel = require('../models/cartModel')

const addItemToCart = async (req, res) => {
    const { product } = req.body
    if (!product) {
        return res.status(400).json({
            message: 'Product is required.',
            success: false
        }); 
    }
    const user = req.user;
    const existedItem = await getCartItem(user, product);
    if (existedItem) {
        return res.status(400).json({
            success: false,
            message: `${existedItem.product.title} has already been added to the cart.`
        })
    }
    try {
        const newCartItem = new CartModel({
            userId: user.id,
            product: product
        });
        const cartItem = await newCartItem.save();
        return res.status(201).json({
            success: true,
            message: 'Item has been added.',
            cartItem: cartItem
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.'
        })
        
    }
 }
const removeItemFromCart = async (req, res) => {
    try {
        await CartModel.deleteOne({ _id: req.params.id });
        return res.status(201).json({
            success: true,
            message: 'Cart Item has been removed.'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.'
        })   
    }
}
const removeItemsFromCart = async (req, res) => {
    const user = req.user;
    try {
        await CartModel.deleteMany({ userId: user.id });
        return res.status(201).json({
            success: true,
            message: 'Cart Items have been deleted.'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.'
        });
    }
}


const getCartItems = async (req, res) => {
    const user = req.user;
    try {
        const cartItems = await CartModel.find({ userId: user.id }).populate('product');
        return res.status(201).json({
            success: true,
            message: 'Cart Items have been fetched.',
            cartItems: cartItems
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.'
        })
    }
}

const getCartItem = async (user, product) => {
   return await CartModel.findOne({ userId: user.id, product: product }).populate('product');
};

module.exports = {
    addItemToCart,
    removeItemFromCart,
    removeItemsFromCart,
    getCartItems
}