const express = require('express');
const authController = require('../controllers/auth');
const {check, body} = require('express-validator/check');

const router = express.Router();
const User = require('../models/user');

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post(
    '/signup', 
    check('email').isEmail().withMessage('Invalid email').custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              'Email already in use'
            );
          }
        });
      }),
    body('password', 'Password needs to be at least 5 alphanumeric characters').isLength({min: 5}).isAlphanumeric(),
    body('confirmPassword').custom((value, { req}) => {
        if(value !== req.body.password){
            throw new Error('Passwords have to match');
        } 

        return true;
    }),
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;