const router = require('express').Router()
const cartControllers = require('../controllers/cartControllers')
const { authGuard } = require('../middleware/authGuard')

router.post('/add',  authGuard, cartControllers.addItemToCart)
router.delete('/remove',authGuard, cartControllers.removeItemsFromCart)
router.delete('/remove/:id', authGuard, cartControllers.removeItemFromCart) // The cart ID should be passed here, no the product ID
router.get('/get-all', authGuard, cartControllers.getCartItems)

module.exports = router;


