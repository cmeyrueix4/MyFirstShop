const User = require('../models/user');

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodeMailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');

const transporter = nodeMailer.createTransport(sendgrid({
    auth: {
        api_key: ''
    }
}));

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');

    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message
    });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');

    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/login');
            }

            bcrypt.compare(password, user.password)
                .then(result => {
                    if (result) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }

                    req.flash('error', 'Invalid email or password.');
                    res.redirect('/login');
                }).catch(err => {
                    console.log(err);
                    res.redirect('/login');
                })
        })
        .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPass = req.body.confirmPassword;

    User.findOne({ email: email }).then(userDoc => {
        if (userDoc) {
            req.flash('error', 'Email in already in use');
            return res.redirect('/signup');
        }

        return bcrypt.hash(password, 12).then(hashPass => {
            const user = new User({
                email: email,
                password: hashPass,
                cart: { items: [] }
            });

            return user.save();
        }).then(result => {
            res.redirect('/login');
            return transporter.sendMail({
                to: email,
                from: '',
                subject: 'Signup succeeded!',
                html: '<h1>You successfully signed up!</h1>'
            });
        }).catch(err => {
            console.log(err);
        });

    }).catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');

    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/reset', {
        path: '/rest',
        pageTitle: 'Reset Password',
        errorMessage: message
    });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }

        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email }).then(user => {
            if (!user) {
                req.flash('error', 'No account with that email exists');
                return res.redirect('/reset');
            }

            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();

        }).then(result => {
            res.redirect('/');
            transporter.sendMail({
                to: req.body.email,
                from: '',
                subject: 'Password reset',
                html: `
                <p>You requested a password reset</p>
                <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
              `
            });
        }).catch(err => console.log(err))
    });
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: new Date() } })
        .then(user => {
            let message = req.flash('error');

            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }

            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            });
        }).catch(err => {
            console.log(err);
        })
};

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken; 
    let userReset;

    User.findOne({resetToken: passwordToken, resetTokenExpiration: {$gt: new Date()}, _id: userId})
    .then(user => {
        userReset = user;
        return bcrypt.hash(newPassword, 12);
    }).then(hashPass => {
        userReset.password = hashPass;
        userReset.resetToken = null;
        userReset.resetTokenExpiration = undefined;
        return userReset.save();
    }).then(result => {
        res.redirect('/login');
    }).catch(err => console.log(err))
};