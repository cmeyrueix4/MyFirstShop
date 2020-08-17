const { get } = require('../routes/shop');

const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class User {
    constructor(username, email, cart){
        this.name = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save(){
        const db = getDb();

        return db.collection('users').insertOne(this);
    }

    addToCart(product){
        // const cartProduct = this.cart.items.findIndex(cp => {
        //     return cp._id === product.id;
        // });
        const updatedCart = {items: [{...product, quantity: 1}]};
        const db = getDb();

        return db.collection('users').updateOne(
            {_id: new mongodb.ObjectID(this._id)}, 
            {$set: {cart: updatedCart}}
        );

    }

    static findById(userId){
        const db = getDb();

        return db.collection('users')
        .find({_id: new mongodb.ObjectID(userId)}).next().then(user => {
            console.log(user);
            return user;
        })
        .catch(err => console.log(err));
    }
}

module.exports = User;