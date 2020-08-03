const path = require('path');

const express = require('express');

// Use of MVC pattern means these exports are no longer needed
// const rootDir = require('../util/path'); 
// const adminData = require('./admin')

const productsController = require('../controllers/products');

const router = express.Router();

router.get('/', productsController.getProducts);

module.exports = router;