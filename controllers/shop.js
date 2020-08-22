const Product = require('../models/product');
const Order = require('../models/order');
const product = require('../models/product');


exports.getProducts = (req, res, next) => {
    Product.find().then(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
    const prodID = req.params.productID;
    Product.findById(prodID)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
    Product.find().then(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.getCart = (req, res, next) => {
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        }).catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodID = req.body.productId;
    Product.findById(prodID).then(product => {
        return req.user.addToCart(product);
    }).then(result => {
        res.redirect('/cart');
    }).catch(err => console.log(err));
};


exports.deleteCartItem = (req, res, next) => {
    const prodId = req.body.productId;

    req.user.deleteItemFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        }).catch(err => console.log(err))
};

exports.postOrder = (req, res, next) => {
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(p => {
                return { quantity: p.quantity, productData: {... p.productId._doc} }
            });
            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user
                },
                products: products
            });

            order.save();
        })
        .then(result => {
            return req.user.clearCart();
        }).then(() => {
            res.redirect('/orders');
        }).catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    Order.find({"user.userId": req.user._id}).then(orders => {
        res.render('shop/orders', {
            path: '/orders',
            pageTitle: 'Your Orders',
            orders: orders
        });
    }).catch(err => console.log(err));
};

