const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename), 
    'data', 
    'products.json'
);

const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if(err){
            return cb([]);
        }

        cb(JSON.parse(fileContent));
    });
};

module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save(){
        //Dummy value for now
        this.id = Math.random().toString();
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    // static ensures we can call this method on the class itself and not on an instantied object
    static fetchAll(cb) {
       getProductsFromFile(cb);
    }

    static findByID(id, cb){
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }
}