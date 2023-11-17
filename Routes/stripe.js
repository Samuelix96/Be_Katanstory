const express = require("express")
const stripe = express.Router();
require("dotenv").config();
const Stripe = require("stripe")

const keyStripe = Stripe(process.env.STRIPE_KEY)

stripe.post('/create-checkout-session', async (req, res) => {
    const productsCart = req.body.productsCart;

    if (!productsCart || !Array.isArray(productsCart) || productsCart.length === 0) {
        return res.status(400).json({ error: 'Invalid products data' });
    }

    const lineItems = productsCart.map(product => {
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: product.title,
                    images: [product.img]
                },
                unit_amount: product.price * 100, 
            },
            quantity: 1, 
        };
    });

    try {
        const session = await keyStripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/checkoutsuccess`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
        });

        res.send({ url: session.url });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = stripe;