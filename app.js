const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const expressHbs = require('express-handlebars')

const app = express();


// app.engine('hbs', expressHbs({layoutDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs'}));
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');
const User = require('./models/user');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    User.findById('5f405caf7481f32ba8a45daa')
    .then(user => {
        req.user = user;
        next();
    }).catch(err => console.log(err));
});

app.use('/admin/', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('')
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
