const Razorpay = require('razorpay');
const shortid = require('shortid');
const User = require('../models/User');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'YOUR_KEY_ID',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET',
});

const CREDIT_PACKAGES = {
  basic: { amount: 499, credits: 5 },
  standard: { amount: 999, credits: 12 },
  premium: { amount: 1999, credits: 30 },
};

const createOrder = async (req, res) => {
  try {
    const { packageType } = req.body;

    if (!CREDIT_PACKAGES[packageType]) {
      return res.status(400).json({ message: 'Invalid package type' });
    }

    const package = CREDIT_PACKAGES[packageType];
    const payment_capture = 1;
    const amount = package.amount;
    const currency = 'INR';
    const options = {
      amount: amount * 100,
      currency,
      receipt: shortid.generate(),
      payment_capture,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      credits: package.credits,
    });
  } catch (error) {
    console.error('Payment order creation error:', error);
    res.status(500).json({ message: 'Error creating payment order' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      packageType
    } = req.body;


    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !packageType) {
      return res.status(400).json({ message: 'Missing payment verification parameters' });
    }

    if (!CREDIT_PACKAGES[packageType]) {
      return res.status(400).json({ message: 'Invalid package type' });
    }

    const creditsToAdd = CREDIT_PACKAGES[packageType].credits;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { credits: creditsToAdd } },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: `Successfully added ${creditsToAdd} credits`,
      user
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Error processing payment verification' });
  }
};

const getCredits = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('credits');
    res.status(200).json({ credits: user.credits });
  } catch (error) {
    console.error('Get credits error:', error);
    res.status(500).json({ message: 'Error retrieving credits information' });
  }
};

const deductCredits = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.credits < 1) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credits to create a meeting'
      });
    }

    user.credits -= 1;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Credit deducted successfully',
      credits: user.credits
    });
  } catch (error) {
    console.error('Deduct credits error:', error);
    res.status(500).json({ message: 'Error deducting credits' });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getCredits,
  deductCredits,
};