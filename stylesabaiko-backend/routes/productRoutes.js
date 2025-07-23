const router = require('express').Router()
const productControllers = require('../controllers/productControllers')

router.post('/create', productControllers.createProduct)
router.get('/get-all', productControllers.getProducts)
router.get('/get/:id', productControllers.getProduct)
router.patch('/update/:id', productControllers.updateProduct)
router.delete('/delete/:id', productControllers.deleteProduct)
router.get('/get-popular-products', productControllers.getPopularProducts);
router.get('/get-all/category/:category', productControllers.getProductsByCategory)
router.patch('/update/:id/buy-count', productControllers.updateProductBuyCount);

module.exports = router;


