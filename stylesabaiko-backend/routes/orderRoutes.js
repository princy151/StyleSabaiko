const router = require('express').Router()
const orderControllers = require('../controllers/orderControllers')
const { authGuard, adminGuard } = require('../middleware/authGuard')

router.post('/create', authGuard, orderControllers.createOrder)
router.get('/get-all', authGuard, orderControllers.getOrders)
router.get('/get/:id', authGuard, orderControllers.getOrder)

router.get('/admin/get-all', adminGuard, orderControllers.getAllOrders)

router.patch('/update/:id/:status', adminGuard, orderControllers.updateOrder)
router.get('/getby/:status',authGuard,orderControllers.get_all_order_by_status)

module.exports = router;


