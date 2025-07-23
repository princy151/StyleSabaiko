const productModel = require('../models/productModel')
const path = require('path')
const fs = require('fs')

const createProduct = async (req, res) => {
    const { title, description, category, price } = req.body;

    if (!title) {
        return res.status(400).json({
            message: 'Title is required.',
            success: false
        });
    }
    if (!description) {
        return res.status(400).json({
            message: 'Description is required.',
            success: false
        });
    } if (!category) {
        return res.status(400).json({
            message: 'Category is required.',
            success: false
        });
    } if (!price) {
        return res.status(400).json({
            message: 'Price is required.',
            success: false
        });
    }

    // check product image
    if (!req.files || !req.files.image) {
        return res.status(400).json({
            success: false,
            message: "Image not found!!"
        })
    }

    const { image } = req.files;

    // Uploading images
    // 1. Generate unique name for each file
    const imageName = `${Date.now()}-${image.name}`;

    // 2. define specific path
    const imageUploadPath = path.join(__dirname, `../public/products/${imageName}`)
    try {
        await image.mv(imageUploadPath)

        const product = await productModel.create({
            title: title,
            description: description,
            price: price,
            imageUrl: 'test',
            category: category,
            imageUrl: imageName
        })
        return res.status(201).json({
            success: true,
            message: 'Product has been created.',
            product: product
        })
    } catch (error) {
        console.error("❌ Error in createProduct:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }

}

const getProducts = async (req, res) => {

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

    const searchParams = {};

    const { keyword } = req.query;
    if (keyword) {
        searchParams.title = { $regex: keyword, $options: 'i' } // With Case sensitive
    }
    try {
        const products = await productModel.find(searchParams, {}, paginationParams).sort({ createdAt: -1 });
        return res.status(201).json({
            success: true,
            message: 'Products has been fetched.',
            products: products
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }

}
const getProduct = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Product Id is required'
        })
    }
    try {
        const product = await productModel.findOne({ _id: id });
        return res.status(201).json({
            success: true,
            message: 'Product has been fetched.',
            product: product
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Product does not exist.'
        })
    }

}
const updateProduct = async (req, res) => {


    // if there is files, upload new & delete old
    if (req.files && req.files.image) {

        // # upload new to /public/products
        // 1. Destructure file
        const { image } = req.files;

        // 1. Generate unique name for each file
        const imageName = `${Date.now()}-${image.name}`;

        // 2. define specific path
        const imageUploadPath = path.join(__dirname, `../public/products/${imageName}`)

        // move to folder
        await image.mv(imageUploadPath)

        // replace productImage name to new name
        req.body.imageUrl = imageName;

        // # Delete Old image
        // Find product Information (We have only ID)
        const existingProduct = await productModel.findById(req.params.id)
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product does not exist.'
            })
        }
        // Search that image in directory
        if (req.body.image) { // if new image is uploaded, then only remove old image
            const oldImagePath = path.join(__dirname, `../public/products/${existingProduct.imageUrl}`)
            if (fs.existsSync(oldImagePath)) {
                // delete from file system
                fs.unlinkSync(oldImagePath)
            }
        }
    }

    const updateParams = req.body
    try {
        const product = await productModel.findOneAndUpdate({ _id: req.params.id }, updateParams, {
            new: true
        });
        return res.status(201).json({
            success: true,
            message: 'Product has been updated.',
            product: product
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}
const deleteProduct = async (req, res) => {
    const existingProduct = await productModel.findById(req.params.id)
    if (!existingProduct) {
        return res.status(404).json({
            success: false,
            message: 'Product does not exist.'
        })
    }

    const oldImagePath = path.join(__dirname, `../public/products/${existingProduct.imageUrl}`)

    if (fs.existsSync(oldImagePath)) {
        // delete from file system
        fs.unlinkSync(oldImagePath)
    }

    try {
        await productModel.findOneAndDelete({ _id: req.params.id })
        return res.status(201).json({
            success: true,
            message: "Product has been deleted."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const getPopularProducts = async (req, res) => {
    //destructuring
    let { limit, page } = req.query

    if (!limit) {
        limit = 10
    }
    if (!page) {
        page = 1
    }
    const paginationParams = {
        limit: limit,
        skip: (page - 1) * limit,
    };

    try {
        const products = await productModel.find({}, {}, paginationParams).sort({ buyCount: -1 });
        return res.status(201).json({
            success: true,
            message: 'Popular Products has been fetched.',
            products: products
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const getProductsByCategory = async (req, res) => {

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

    const searchParams = {};

    const { category } = req.params;
    if (category) {
        searchParams.category = category.toLowerCase()
    }
    try {
        const products = await productModel.find(searchParams, {}, paginationParams).sort({ createdAt: -1 });
        return res.status(201).json({
            success: true,
            message: 'Products has been fetched.',
            products: products
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }

}

const updateProductBuyCount = async (req, res) => {
    const product = await productModel.findById(req.params.id);
    if (!product) {
        return res.status(400).json({
            success: false,
            message: 'Product does not exist'
        });
    }

    try {
        await productModel.updateOne({ _id: req.params.id }, { buyCount: product.buyCount + 1 });
        return res.status(201).json({
            success: true,
            message: 'Product buy count has been updated'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    getPopularProducts,
    getProductsByCategory,
    updateProductBuyCount
}