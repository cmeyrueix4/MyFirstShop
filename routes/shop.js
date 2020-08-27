const path = require('path');

const express = require('express');

// Use of MVC pattern means these exports are no longer needed
// const rootDir = require('../util/path'); 
// const adminData = require('./admin')

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

//Order of routes matters!! add any /products/... routes before this
router.get('/products/:productID', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.deleteCartItem);

router.post('/create-order', isAuth, shopController.postOrder);

router.get('/orders', isAuth, shopController.getOrders);

module.exports = router;