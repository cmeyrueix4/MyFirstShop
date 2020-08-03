//To be changed when a database is integrated
const products = [];

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save(){
        products.push(this);
    }

    // static ensures we can call this method on the class itself and not on an instantied object
    static fetchAll() {
        return products;
    }
}