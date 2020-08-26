const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
// const expressHbs = require('express-handlebars')

const app = express(); 
// const store = new MongoDBStore({
//     url: 'mongodb+srv://store-manager:manaGEME173@cluster0.zurim.mongodb.net/shop?authSource=admin',
//     collection: 'sessions'
// });


// app.engine('hbs', expressHbs({layoutDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs'}));
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');
const User = require('./models/user');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}));

app.use((req, res, next) => {
    User.findById('5f405caf7481f32ba8a45daa')
    .then(user => {
        req.user = user;
        next();
    }).catch(err => console.log(err));
});

app.use('/admin/', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb://store-manager:manaGEME173@cluster0-shard-00-00.zurim.mongodb.net:27017,cluster0-shard-00-01.zurim.mongodb.net:27017,cluster0-shard-00-02.zurim.mongodb.net:27017/shop?ssl=true&replicaSet=atlas-96hs71-shard-0&authSource=admin&w=majority')
.then(result => {
    User.findOne().then(user => {
        if(!user){
            const user = new User({
                name: 'Cyrielle',
                email: 'test@test.com',
                cart: {
                    items: []
                }
            });
            user.save();
        }
    });

    app.listen(3000);
})
.catch(err => console.log(err));
