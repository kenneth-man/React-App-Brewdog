const express = require('express');
const app = express();
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST);
const cors = require('cors');

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cors());

app.post('/payment', cors(), async (req, res) => {
	let { amount, id } = req.body;

	try {
		const payment = await stripe.paymentIntents.create({
			amount,
			currency: 'GBP',
			description: 'Sample Payment',
			payment_method: id,
			confirm: true
		})
		
		res.json({
			message: 'Payment successful',
			success: true
		})
	} catch (error) {
		res.json({
			message: 'Payment failed',
			success: false
		})
	}
});

app.listen(process.env.PORT || 4000, () => {
	console.log('Sever is listening on port 4000')
});