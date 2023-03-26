import { buffer } from "micro"
import * as admin from 'firebase-admin'

// app.use(cors())
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

// Secur conection to firebase from bakend
const serviceAccount = require("../../../permissions.json");
const app = !admin.apps.length ? admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: "https://fir-90757.firebaseio.com",
}) : admin.app();

//Establish connection to stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endPointSecret = process.env.STRIPE_SIGNING_SECRET;



const fulFillOrder = async (session) => {
  // console.log('Fullfilling order', session)

  return app.firestore()
    .collection('users')
    .doc(session.metadata.email)
    .collection('orders')
    .doc(session.id)
    .set({
      amount: session.amount_total / 100,
      // amount_shipped: session.total_details.amount_shipping / 100,
      images: JSON.parse(session.metadata.images),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then((err) => {
      if (true) {
        console.log(`SUCCESS: Order ${session.id} had add to the DB`);
      }
      console.log(`Error => ${err}`)
    })

}

export default async (req, res) => {
  if (req.method === "POST") {
    const requestBuffer = await buffer(req);
    const payload = requestBuffer.toString();
    const sig = req.headers['stripe-signature'];


    // Verify that the EVENT posted came from stripe
    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig, endPointSecret);
    } catch (err) {
      console.log('ERROR', err.message)
      return res.status(400).send(`Webhook error : ${err.message}`)
    }

    // Handle the checkout session complated Event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      console.log(session)
      // Fullfill the order 
      return fulFillOrder(session).then(
        () => res.status(200)
      ).catch(
        (err) => res.status(400).send(`Webhook Error: ${err.message}`)
      )

    }
  }
}


export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  }
}




// command for granting webhok secret
// stripe listen --forward-to localhost:3000/api/webhook