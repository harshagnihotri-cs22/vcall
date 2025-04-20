const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

router.post('/order', auth, paymentController.createOrder);

router.post('/verify', auth, paymentController.verifyPayment);

router.get('/credits', auth, paymentController.getCredits);

router.post('/deduct', auth, paymentController.deductCredits);

module.exports = router;