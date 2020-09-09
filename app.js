const express = require('express');
const stripe = require('stripe')('sk_test_51HPHkOIhi6EjqRHzwxI2ISK78ELRWw0TrZMyI2WEEFOjjr3KCvp4OBuVlszPdlHsokj7w9Ejkx5QqjInWLKb7WM300yurAdYJN');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

//handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//set static folder
app.use(express.static(`${__dirname}/public`));

//index route
app.get('/', (req, res) => {
	res.render('index')
});

//charge route
app.post('/charge', (req, res) => {
	const amount = 500;
	stripe.customers.create({
		email: req.body.stripeEmail,
		source: req.body.stripeToken
	})
		.then(customer => stripe.charges.create({
			amount,
			description: "Murder On The Orient by Agatha Christie",
			currency: 'inr',
			customer: customer.id
		}))

		.then(charge => res.render('success'));
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log('Server started on port 5000');
});