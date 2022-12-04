const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


export default async function handler(req, res) {
  const { items, email } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],

    line_items: items.map((item) => ({
      price_data: {
        currency: 'usd',
        unit_amount: item.price * 100,
        product_data: {
          name: item.title,
          description: item.description,
          images: [item.image],
        },
      },

      quantity: 1,

    })),

    mode: 'payment',
    success_url: `${process.env.HOST}/success`,
    cancel_url: `${process.env.HOST}/checkout`,
    metadata: {
      email,
      images: JSON.stringify(items.map((item) => item.image))
    }
  });

  res.status(200).json({ id: session.id })

};



// shipping_address_collection: { allowed_countries: ['US', 'CA', 'SA', 'NG'] },
    // shipping_options: [
    //   {
    //     shipping_rate_data: ['shr_1M2tQEAocApQapQDzUDqL39j', 'shr_1M2t0eAocApQapQD4bYgSPP0'],
    //   },
    // ],
