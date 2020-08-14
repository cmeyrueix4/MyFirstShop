const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars')

const app = express();


// app.engine('hbs', expressHbs({layoutDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs'}));
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    // User.findByPk(1)
    // .then(user => {
    //     req.user = user;
    //     next();
    // }).catch(err => console.log(err));
    next();
});

app.use('/admin/', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
});

