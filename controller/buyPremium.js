const Order = require('../models/order');
const User = require("../models/users");
const Razorpay = require('razorpay');


exports.getPremium = (req, res) => {
    const razorpay = new Razorpay({
        key_id: "rzp_test_ThRERnDash6qY4",
        key_secret: "aA9FdFOw0LMc4HbAwhJvj1JX"
    }); 

    razorpay.orders.create({
        amount: 2500,
        currency: 'INR',
    }, (err, order) => {
        if (err) {
            return res.status(500)
                .json({
                    error: err,
                    message: "Order id not created in razorpay"
                });
        } else {
            Order.create({
                orderId: order.id,
                userId: req.user.id,
                status: req.body.status
            }).then(order => {
                return res.status(201).json({
                    order,
                    key_id: razorpay.key_id
                })
            }).catch(e => console.log(e));
        }
    })
};


exports.postPremium = (req, res) => {
    
    Order.update({
        paymentId: req.body.paymentId,
        status: req.body.status
    },
        {
            where: {
                orderId: req.body.orderId,
            }
        }
    ).then(() => {
        User.update({
            isPremium: true
        }, {
            where: {
                id: req.user.id
            }
        })
    })
        .then()
        .catch(e => console.log(e));
    
};


